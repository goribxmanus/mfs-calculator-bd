package com.mfs.chargecalculator.viewmodel

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.mfs.chargecalculator.data.local.HistoryDao
import com.mfs.chargecalculator.data.local.HistoryEntity
import com.mfs.chargecalculator.data.preferences.AppLanguage
import com.mfs.chargecalculator.data.preferences.AppUserPreferences
import com.mfs.chargecalculator.data.preferences.ThemeMode
import com.mfs.chargecalculator.data.preferences.UserPreferencesRepository
import com.mfs.chargecalculator.engine.MfsCalculationEngine
import com.mfs.chargecalculator.model.CalculationResult
import com.mfs.chargecalculator.model.MfsId
import com.mfs.chargecalculator.model.MfsProviderConfig
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import java.math.BigDecimal
import java.math.RoundingMode

class CalculatorViewModel(
    private val historyDao: HistoryDao,
    private val preferencesRepository: UserPreferencesRepository
) : ViewModel() {

    private val _rawAmount = MutableStateFlow("")
    val rawAmount: StateFlow<String> = _rawAmount.asStateFlow()

    private val _selectedMfsId = MutableStateFlow(MfsId.BKASH)
    val selectedMfsId: StateFlow<MfsId> = _selectedMfsId.asStateFlow()

    private val _isCopied = MutableStateFlow(false)
    val isCopied: StateFlow<Boolean> = _isCopied.asStateFlow()

    val userPreferences: StateFlow<AppUserPreferences> = preferencesRepository.userPreferencesFlow
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.Eagerly,
            initialValue = AppUserPreferences(
                language = AppLanguage.ENGLISH,
                themeMode = ThemeMode.SYSTEM,
                selectedMfsId = MfsId.BKASH,
                rates = MfsProviderConfig.ALL.associate { it.id to it.defaultRatePer1000 },
                sendMoneyFees = MfsProviderConfig.ALL.associate { it.id to it.defaultSendMoneyFee }
            )
        )

    val historyList: StateFlow<List<HistoryEntity>> = historyDao.getRecentHistory()
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = emptyList()
        )

    // Authoritative instantly computed calculation result
    val calculationResult: StateFlow<CalculationResult> = combine(
        _rawAmount,
        _selectedMfsId,
        userPreferences
    ) { rawInput, mfsId, prefs ->
        val amount = MfsCalculationEngine.parseAmount(rawInput)
        val rate = BigDecimal(prefs.rates[mfsId] ?: MfsProviderConfig.fromId(mfsId).defaultRatePer1000)
        val fee = BigDecimal(prefs.sendMoneyFees[mfsId] ?: MfsProviderConfig.fromId(mfsId).defaultSendMoneyFee)
        val providerName = MfsProviderConfig.fromId(mfsId).displayName

        MfsCalculationEngine.calculate(
            amount = amount,
            mfsName = providerName,
            ratePer1000 = rate,
            sendMoneyFee = fee
        )
    }.stateIn(
        scope = viewModelScope,
        started = SharingStarted.Eagerly,
        initialValue = CalculationResult.EMPTY
    )

    private var historySaveJob: Job? = null
    private var lastSavedSignature: String? = null

    init {
        viewModelScope.launch {
            userPreferences.collect { prefs ->
                if (_selectedMfsId.value == MfsId.BKASH && prefs.selectedMfsId != MfsId.BKASH) {
                    _selectedMfsId.value = prefs.selectedMfsId
                }
            }
        }
    }

    fun onDigit(digit: String) {
        val current = _rawAmount.value
        if (current.length >= 10) return // Prevent overflow

        val next = when {
            digit == "00" -> {
                if (current.isEmpty() || current == "0") "0" else current + "00"
            }
            current == "0" && digit != "0" -> digit
            else -> current + digit
        }

        // Limit to 2 decimal places if decimal exists
        if (next.contains(".")) {
            val parts = next.split(".")
            if (parts.size > 1 && parts[1].length > 2) return
        }

        _rawAmount.value = next
        scheduleHistoryCommit()
    }

    fun onDecimal() {
        val current = _rawAmount.value
        if (current.contains(".")) return
        _rawAmount.value = if (current.isEmpty()) "0." else "$current."
    }

    fun onBackspace() {
        val current = _rawAmount.value
        if (current.isNotEmpty()) {
            _rawAmount.value = current.dropLast(1)
            scheduleHistoryCommit()
        }
    }

    fun onQuickAdd(addition: Double) {
        val currentVal = MfsCalculationEngine.parseAmount(_rawAmount.value)
        val newVal = currentVal.add(BigDecimal(addition.toString())).setScale(2, RoundingMode.HALF_UP)
        // Clean display (drop trailing .00 if whole number)
        _rawAmount.value = if (newVal.remainder(BigDecimal.ONE).compareTo(BigDecimal.ZERO) == 0) {
            newVal.toBigInteger().toString()
        } else {
            newVal.toPlainString()
        }
        scheduleHistoryCommit()
    }

    fun onClearAmount() {
        _rawAmount.value = ""
        historySaveJob?.cancel()
    }

    fun onReset() {
        _rawAmount.value = ""
        _selectedMfsId.value = MfsId.BKASH
        viewModelScope.launch {
            preferencesRepository.setSelectedMfs(MfsId.BKASH)
        }
        historySaveJob?.cancel()
    }

    fun onSelectMfs(mfsId: MfsId) {
        _selectedMfsId.value = mfsId
        viewModelScope.launch {
            preferencesRepository.setSelectedMfs(mfsId)
        }
        scheduleHistoryCommit()
    }

    fun onCopyTotal(context: Context) {
        val result = calculationResult.value
        val textToCopy = result.formattedTotal
        try {
            val clipboard = context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
            val clip = ClipData.newPlainText("MFS Total", textToCopy)
            clipboard.setPrimaryClip(clip)

            _isCopied.value = true
            viewModelScope.launch {
                delay(2000)
                _isCopied.value = false
            }
            // Also commit to history immediately on copy if valid
            commitCalculationToHistoryNow()
        } catch (_: Exception) {
            // Graceful failure as requested
        }
    }

    fun onRestoreHistory(item: HistoryEntity) {
        historySaveJob?.cancel()
        val mfs = MfsProviderConfig.fromName(item.mfsName)
        _selectedMfsId.value = mfs.id
        val amount = BigDecimal(item.amount.toString()).setScale(2, RoundingMode.HALF_UP)
        _rawAmount.value = if (amount.remainder(BigDecimal.ONE).compareTo(BigDecimal.ZERO) == 0) {
            amount.toBigInteger().toString()
        } else {
            amount.toPlainString()
        }
        lastSavedSignature = "${mfs.displayName}_${item.amount}_${item.totalCustomerPays}"
    }

    fun onClearHistory() {
        viewModelScope.launch {
            historyDao.clearAll()
        }
    }

    fun updateRateAndFee(mfsId: MfsId, rate: Double, fee: Double) {
        viewModelScope.launch {
            preferencesRepository.updateRateAndFee(mfsId, rate, fee)
        }
    }

    fun restoreDefaultRates() {
        viewModelScope.launch {
            preferencesRepository.restoreDefaultRates()
        }
    }

    fun setLanguage(language: AppLanguage) {
        viewModelScope.launch {
            preferencesRepository.setLanguage(language)
        }
    }

    fun setThemeMode(themeMode: ThemeMode) {
        viewModelScope.launch {
            preferencesRepository.setThemeMode(themeMode)
        }
    }

    private fun scheduleHistoryCommit() {
        historySaveJob?.cancel()
        historySaveJob = viewModelScope.launch {
            delay(1800) // Debounce history save after typing stops
            commitCalculationToHistoryNow()
        }
    }

    private fun commitCalculationToHistoryNow() {
        val result = calculationResult.value
        if (result.amount <= BigDecimal.ZERO) return

        val sig = "${result.mfsName}_${result.amount}_${result.totalCustomerPays}"
        if (sig == lastSavedSignature) return
        lastSavedSignature = sig

        viewModelScope.launch {
            historyDao.insertAndTrim(
                HistoryEntity(
                    mfsName = result.mfsName,
                    amount = result.amount.toDouble(),
                    grossPercentageCharge = result.grossPercentageCharge.toDouble(),
                    sendMoneyFee = result.sendMoneyFee.toDouble(),
                    netCharge = result.netCharge.toDouble(),
                    totalCustomerPays = result.totalCustomerPays.toDouble()
                )
            )
        }
    }
}

package com.mfs.chargecalculator.data.preferences

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.doublePreferencesKey
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.emptyPreferences
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import com.mfs.chargecalculator.model.MfsId
import com.mfs.chargecalculator.model.MfsProviderConfig
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.catch
import kotlinx.coroutines.flow.map
import java.io.IOException

val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "user_preferences")

data class AppUserPreferences(
    val language: AppLanguage,
    val themeMode: ThemeMode,
    val selectedMfsId: MfsId,
    val rates: Map<MfsId, Double>,
    val sendMoneyFees: Map<MfsId, Double>
)

class UserPreferencesRepository(private val context: Context) {

    private object PreferencesKeys {
        val LANGUAGE = stringPreferencesKey("app_language")
        val THEME_MODE = stringPreferencesKey("app_theme_mode")
        val SELECTED_MFS = stringPreferencesKey("selected_mfs_id")

        val BKASH_RATE = doublePreferencesKey("rate_bkash")
        val BKASH_FEE = doublePreferencesKey("fee_bkash")

        val NAGAD_RATE = doublePreferencesKey("rate_nagad")
        val NAGAD_FEE = doublePreferencesKey("fee_nagad")

        val ROCKET_RATE = doublePreferencesKey("rate_rocket")
        val ROCKET_FEE = doublePreferencesKey("fee_rocket")

        val UPAY_RATE = doublePreferencesKey("rate_upay")
        val UPAY_FEE = doublePreferencesKey("fee_upay")
    }

    val userPreferencesFlow: Flow<AppUserPreferences> = context.dataStore.data
        .catch { exception ->
            if (exception is IOException) {
                emit(emptyPreferences())
            } else {
                throw exception
            }
        }
        .map { preferences ->
            val langCode = preferences[PreferencesKeys.LANGUAGE] ?: AppLanguage.ENGLISH.code
            val themeStr = preferences[PreferencesKeys.THEME_MODE] ?: ThemeMode.SYSTEM.value
            val mfsStr = preferences[PreferencesKeys.SELECTED_MFS] ?: MfsId.BKASH.name

            val rates = mapOf(
                MfsId.BKASH to (preferences[PreferencesKeys.BKASH_RATE] ?: MfsProviderConfig.BKASH.defaultRatePer1000),
                MfsId.NAGAD to (preferences[PreferencesKeys.NAGAD_RATE] ?: MfsProviderConfig.NAGAD.defaultRatePer1000),
                MfsId.ROCKET to (preferences[PreferencesKeys.ROCKET_RATE] ?: MfsProviderConfig.ROCKET.defaultRatePer1000),
                MfsId.UPAY to (preferences[PreferencesKeys.UPAY_RATE] ?: MfsProviderConfig.UPAY.defaultRatePer1000)
            )

            val fees = mapOf(
                MfsId.BKASH to (preferences[PreferencesKeys.BKASH_FEE] ?: MfsProviderConfig.BKASH.defaultSendMoneyFee),
                MfsId.NAGAD to (preferences[PreferencesKeys.NAGAD_FEE] ?: MfsProviderConfig.NAGAD.defaultSendMoneyFee),
                MfsId.ROCKET to (preferences[PreferencesKeys.ROCKET_FEE] ?: MfsProviderConfig.ROCKET.defaultSendMoneyFee),
                MfsId.UPAY to (preferences[PreferencesKeys.UPAY_FEE] ?: MfsProviderConfig.UPAY.defaultSendMoneyFee)
            )

            val selectedMfsId = try {
                MfsId.valueOf(mfsStr)
            } catch (_: Exception) {
                MfsId.BKASH
            }

            AppUserPreferences(
                language = AppLanguage.fromCode(langCode),
                themeMode = ThemeMode.fromValue(themeStr),
                selectedMfsId = selectedMfsId,
                rates = rates,
                sendMoneyFees = fees
            )
        }

    suspend fun setLanguage(language: AppLanguage) {
        context.dataStore.edit { preferences ->
            preferences[PreferencesKeys.LANGUAGE] = language.code
        }
    }

    suspend fun setThemeMode(themeMode: ThemeMode) {
        context.dataStore.edit { preferences ->
            preferences[PreferencesKeys.THEME_MODE] = themeMode.value
        }
    }

    suspend fun setSelectedMfs(mfsId: MfsId) {
        context.dataStore.edit { preferences ->
            preferences[PreferencesKeys.SELECTED_MFS] = mfsId.name
        }
    }

    suspend fun updateRateAndFee(mfsId: MfsId, rate: Double, fee: Double) {
        context.dataStore.edit { preferences ->
            when (mfsId) {
                MfsId.BKASH -> {
                    preferences[PreferencesKeys.BKASH_RATE] = rate
                    preferences[PreferencesKeys.BKASH_FEE] = fee
                }
                MfsId.NAGAD -> {
                    preferences[PreferencesKeys.NAGAD_RATE] = rate
                    preferences[PreferencesKeys.NAGAD_FEE] = fee
                }
                MfsId.ROCKET -> {
                    preferences[PreferencesKeys.ROCKET_RATE] = rate
                    preferences[PreferencesKeys.ROCKET_FEE] = fee
                }
                MfsId.UPAY -> {
                    preferences[PreferencesKeys.UPAY_RATE] = rate
                    preferences[PreferencesKeys.UPAY_FEE] = fee
                }
            }
        }
    }

    suspend fun restoreDefaultRates() {
        context.dataStore.edit { preferences ->
            preferences[PreferencesKeys.BKASH_RATE] = MfsProviderConfig.BKASH.defaultRatePer1000
            preferences[PreferencesKeys.BKASH_FEE] = MfsProviderConfig.BKASH.defaultSendMoneyFee

            preferences[PreferencesKeys.NAGAD_RATE] = MfsProviderConfig.NAGAD.defaultRatePer1000
            preferences[PreferencesKeys.NAGAD_FEE] = MfsProviderConfig.NAGAD.defaultSendMoneyFee

            preferences[PreferencesKeys.ROCKET_RATE] = MfsProviderConfig.ROCKET.defaultRatePer1000
            preferences[PreferencesKeys.ROCKET_FEE] = MfsProviderConfig.ROCKET.defaultSendMoneyFee

            preferences[PreferencesKeys.UPAY_RATE] = MfsProviderConfig.UPAY.defaultRatePer1000
            preferences[PreferencesKeys.UPAY_FEE] = MfsProviderConfig.UPAY.defaultSendMoneyFee
        }
    }
}

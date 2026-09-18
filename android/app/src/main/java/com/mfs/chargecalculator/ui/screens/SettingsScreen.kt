package com.mfs.chargecalculator.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Restore
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.RadioButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateMapOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.mfs.chargecalculator.R
import com.mfs.chargecalculator.data.preferences.ThemeMode
import com.mfs.chargecalculator.model.MfsId
import com.mfs.chargecalculator.model.MfsProviderConfig
import com.mfs.chargecalculator.viewmodel.CalculatorViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SettingsScreen(
    viewModel: CalculatorViewModel,
    onNavigateBack: () -> Unit
) {
    val userPreferences by viewModel.userPreferences.collectAsState()
    var showRestoreConfirmDialog by remember { mutableStateOf(false) }

    val rateInputs = remember(userPreferences.rates) {
        mutableStateMapOf<MfsId, String>().apply {
            MfsProviderConfig.ALL.forEach {
                put(it.id, (userPreferences.rates[it.id] ?: it.defaultRatePer1000).toString())
            }
        }
    }

    val feeInputs = remember(userPreferences.sendMoneyFees) {
        mutableStateMapOf<MfsId, String>().apply {
            MfsProviderConfig.ALL.forEach {
                put(it.id, (userPreferences.sendMoneyFees[it.id] ?: it.defaultSendMoneyFee).toString())
            }
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(stringResource(id = R.string.settings)) },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(
                            imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                            contentDescription = stringResource(id = R.string.back)
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.background
                )
            )
        },
        containerColor = MaterialTheme.colorScheme.background
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .verticalScroll(rememberScrollState()),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .widthIn(max = 600.dp)
                    .padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(20.dp)
            ) {
                // SECTION 1: THEME MODE
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(14.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(
                            text = stringResource(id = R.string.theme_title),
                            style = MaterialTheme.typography.titleMedium.copy(
                                fontWeight = FontWeight.Bold,
                                fontSize = 16.sp
                            )
                        )
                        Spacer(modifier = Modifier.height(10.dp))

                        val themeOptions = listOf(
                            ThemeMode.SYSTEM to stringResource(id = R.string.theme_system),
                            ThemeMode.LIGHT to stringResource(id = R.string.theme_light),
                            ThemeMode.DARK to stringResource(id = R.string.theme_dark)
                        )

                        themeOptions.forEach { (mode, label) ->
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(vertical = 4.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                RadioButton(
                                    selected = (userPreferences.themeMode == mode),
                                    onClick = { viewModel.setThemeMode(mode) }
                                )
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(
                                    text = label,
                                    style = MaterialTheme.typography.bodyLarge
                                )
                            }
                        }
                    }
                }

                // SECTION 2: MFS RATES & SEND MONEY FEES
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(14.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(
                            text = stringResource(id = R.string.rate_per_1000),
                            style = MaterialTheme.typography.titleMedium.copy(
                                fontWeight = FontWeight.Bold,
                                fontSize = 16.sp
                            )
                        )
                        Spacer(modifier = Modifier.height(14.dp))

                        MfsProviderConfig.ALL.forEach { provider ->
                            Column(modifier = Modifier.padding(bottom = 14.dp)) {
                                Text(
                                    text = provider.displayName,
                                    style = MaterialTheme.typography.labelLarge.copy(
                                        fontWeight = FontWeight.Bold,
                                        color = MaterialTheme.colorScheme.primary,
                                        fontSize = 14.sp
                                    )
                                )
                                Spacer(modifier = Modifier.height(6.dp))
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                                ) {
                                    OutlinedTextField(
                                        value = rateInputs[provider.id] ?: "",
                                        onValueChange = { newVal ->
                                            rateInputs[provider.id] = newVal
                                            newVal.toDoubleOrNull()?.let { validRate ->
                                                if (validRate >= 0) {
                                                    val curFee = feeInputs[provider.id]?.toDoubleOrNull() ?: provider.defaultSendMoneyFee
                                                    viewModel.updateRateAndFee(provider.id, validRate, curFee)
                                                }
                                            }
                                        },
                                        label = { Text(stringResource(id = R.string.rate)) },
                                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                                        modifier = Modifier.weight(1f),
                                        singleLine = true
                                    )

                                    OutlinedTextField(
                                        value = feeInputs[provider.id] ?: "",
                                        onValueChange = { newVal ->
                                            feeInputs[provider.id] = newVal
                                            newVal.toDoubleOrNull()?.let { validFee ->
                                                if (validFee >= 0) {
                                                    val curRate = rateInputs[provider.id]?.toDoubleOrNull() ?: provider.defaultRatePer1000
                                                    viewModel.updateRateAndFee(provider.id, curRate, validFee)
                                                }
                                            }
                                        },
                                        label = { Text(stringResource(id = R.string.send_money_fee)) },
                                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                                        modifier = Modifier.weight(1f),
                                        singleLine = true
                                    )
                                }
                            }
                        }

                        Spacer(modifier = Modifier.height(8.dp))

                        // Restore Default Rates Button
                        OutlinedButton(
                            onClick = { showRestoreConfirmDialog = true },
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(10.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Default.Restore,
                                contentDescription = null,
                                modifier = Modifier.size(18.dp)
                            )
                            Spacer(modifier = Modifier.size(8.dp))
                            Text(
                                text = stringResource(id = R.string.restore_defaults),
                                style = MaterialTheme.typography.labelLarge.copy(
                                    fontWeight = FontWeight.SemiBold
                                )
                            )
                        }
                    }
                }
            }
        }
    }

    if (showRestoreConfirmDialog) {
        AlertDialog(
            onDismissRequest = { showRestoreConfirmDialog = false },
            title = { Text(stringResource(id = R.string.restore_defaults)) },
            text = { Text(stringResource(id = R.string.restore_defaults_confirm)) },
            confirmButton = {
                Button(
                    onClick = {
                        viewModel.restoreDefaultRates()
                        showRestoreConfirmDialog = false
                    }
                ) {
                    Text(stringResource(id = R.string.confirm))
                }
            },
            dismissButton = {
                TextButton(onClick = { showRestoreConfirmDialog = false }) {
                    Text(stringResource(id = R.string.cancel))
                }
            }
        )
    }
}

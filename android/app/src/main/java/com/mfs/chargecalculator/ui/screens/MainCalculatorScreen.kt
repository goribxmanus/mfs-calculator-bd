package com.mfs.chargecalculator.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.RestartAlt
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.mfs.chargecalculator.R
import com.mfs.chargecalculator.ui.components.AmountInputField
import com.mfs.chargecalculator.ui.components.HistorySection
import com.mfs.chargecalculator.ui.components.MfsSelector
import com.mfs.chargecalculator.ui.components.NumericKeypad
import com.mfs.chargecalculator.ui.components.QuickAddButtons
import com.mfs.chargecalculator.ui.components.ResultCard
import com.mfs.chargecalculator.ui.components.TopAppBarWithMenu
import com.mfs.chargecalculator.viewmodel.CalculatorViewModel

@Composable
fun MainCalculatorScreen(
    viewModel: CalculatorViewModel,
    onNavigateToSettings: () -> Unit,
    onNavigateToAboutDeveloper: () -> Unit
) {
    val context = LocalContext.current
    val rawAmount by viewModel.rawAmount.collectAsState()
    val selectedMfsId by viewModel.selectedMfsId.collectAsState()
    val calculationResult by viewModel.calculationResult.collectAsState()
    val isCopied by viewModel.isCopied.collectAsState()
    val userPreferences by viewModel.userPreferences.collectAsState()
    val historyList by viewModel.historyList.collectAsState()

    val scrollState = rememberScrollState()

    Scaffold(
        topBar = {
            TopAppBarWithMenu(
                currentLanguage = userPreferences.language,
                onNavigateToCalculator = { /* already on calculator */ },
                onNavigateToAboutDeveloper = onNavigateToAboutDeveloper,
                onNavigateToSettings = onNavigateToSettings,
                onLanguageSelected = { viewModel.setLanguage(it) }
            )
        },
        containerColor = MaterialTheme.colorScheme.background
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .verticalScroll(scrollState),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Constrain width on tablets and foldables for optimal reachability
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .widthIn(max = 600.dp)
                    .padding(horizontal = 16.dp, vertical = 8.dp),
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {

                // 2. RESULT CARD (MUST BE AT THE TOP ABOVE EVERYTHING)
                ResultCard(
                    result = calculationResult,
                    isCopied = isCopied,
                    onCopyClick = { viewModel.onCopyTotal(context) }
                )

                // 3. MFS SELECTOR (4 providers: bKash, Nagad, Rocket, Upay)
                MfsSelector(
                    selectedMfsId = selectedMfsId,
                    onSelectMfs = { viewModel.onSelectMfs(it) }
                )

                // 4. AMOUNT INPUT
                AmountInputField(
                    rawAmount = rawAmount,
                    onClear = { viewModel.onClearAmount() }
                )

                // 5. QUICK-ADD CONTROLS (+500, +1,000, +1,500, +2,000, Clear)
                QuickAddButtons(
                    onQuickAdd = { viewModel.onQuickAdd(it) },
                    onClear = { viewModel.onClearAmount() }
                )

                // 6. NUMERIC KEYPAD (1-9, 00, 0, ⌫)
                NumericKeypad(
                    onDigit = { viewModel.onDigit(it) },
                    onDecimal = { viewModel.onDecimal() },
                    onBackspace = { viewModel.onBackspace() }
                )

                // 7. RESET BUTTON (Clears amount & state, returns to default MFS, DOES NOT DELETE HISTORY)
                OutlinedButton(
                    onClick = { viewModel.onReset() },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(44.dp),
                    shape = RoundedCornerShape(10.dp),
                    border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline.copy(alpha = 0.4f))
                ) {
                    Icon(
                        imageVector = Icons.Default.RestartAlt,
                        contentDescription = null,
                        modifier = Modifier.size(18.dp),
                        tint = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Spacer(modifier = Modifier.size(8.dp))
                    Text(
                        text = stringResource(id = R.string.reset),
                        style = MaterialTheme.typography.labelLarge.copy(
                            fontWeight = FontWeight.SemiBold,
                            fontSize = 14.sp,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    )
                }

                Spacer(modifier = Modifier.height(6.dp))

                // 8. CALCULATION HISTORY (Up to 100 entries, newest first, restore on tap)
                HistorySection(
                    historyList = historyList,
                    onSelectHistory = { viewModel.onRestoreHistory(it) },
                    onClearHistory = { viewModel.onClearHistory() }
                )

                Spacer(modifier = Modifier.height(24.dp))
            }
        }
    }
}

package com.mfs.chargecalculator.ui.components

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.History
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Language
import androidx.compose.material.icons.filled.Menu
import androidx.compose.material.icons.filled.PointOfSale
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.RadioButton
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.mfs.chargecalculator.R
import com.mfs.chargecalculator.data.preferences.AppLanguage

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TopAppBarWithMenu(
    title: String = stringResource(id = R.string.app_name),
    subtitle: String = stringResource(id = R.string.app_subtitle),
    currentLanguage: AppLanguage,
    onNavigateToCalculator: () -> Unit,
    onNavigateToHistory: () -> Unit,
    onNavigateToAboutDeveloper: () -> Unit,
    onNavigateToSettings: () -> Unit,
    onLanguageSelected: (AppLanguage) -> Unit
) {
    var menuExpanded by remember { mutableStateOf(false) }
    var showLanguageDialog by remember { mutableStateOf(false) }

    TopAppBar(
        title = {
            Column {
                Text(
                    text = title,
                    style = MaterialTheme.typography.titleMedium.copy(
                        fontWeight = FontWeight.Bold,
                        fontSize = 18.sp
                    ),
                    maxLines = 1
                )
                Text(
                    text = subtitle,
                    style = MaterialTheme.typography.bodySmall.copy(
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        fontSize = 11.sp
                    ),
                    maxLines = 1
                )
            }
        },
        colors = TopAppBarDefaults.topAppBarColors(
            containerColor = MaterialTheme.colorScheme.background,
            titleContentColor = MaterialTheme.colorScheme.onBackground
        ),
        actions = {
            // Separate small, unobtrusive Settings (gear icon)
            IconButton(
                onClick = onNavigateToSettings
            ) {
                Icon(
                    imageVector = Icons.Default.Settings,
                    contentDescription = stringResource(id = R.string.settings),
                    tint = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }

            // Corner Menu Button
            IconButton(
                onClick = { menuExpanded = true }
            ) {
                Icon(
                    imageVector = Icons.Default.Menu,
                    contentDescription = "Menu",
                    tint = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }

            // Dropdown Menu
            DropdownMenu(
                expanded = menuExpanded,
                onDismissRequest = { menuExpanded = false }
            ) {
                // Item 1: Cashout Charge (Returns to main calculator)
                DropdownMenuItem(
                    text = { Text(stringResource(id = R.string.menu_cashout_charge)) },
                    leadingIcon = {
                        Icon(Icons.Default.PointOfSale, contentDescription = null)
                    },
                    onClick = {
                        menuExpanded = false
                        onNavigateToCalculator()
                    }
                )

                // Item 2: Calculation History (Transferred to dropdown menu per user request)
                DropdownMenuItem(
                    text = { Text(stringResource(id = R.string.calculation_history)) },
                    leadingIcon = {
                        Icon(Icons.Default.History, contentDescription = null)
                    },
                    onClick = {
                        menuExpanded = false
                        onNavigateToHistory()
                    }
                )

                // Item 3: About Developer
                DropdownMenuItem(
                    text = { Text(stringResource(id = R.string.menu_about_developer)) },
                    leadingIcon = {
                        Icon(Icons.Default.Info, contentDescription = null)
                    },
                    onClick = {
                        menuExpanded = false
                        onNavigateToAboutDeveloper()
                    }
                )

                // Item 4: Language / ভাষা
                DropdownMenuItem(
                    text = { Text(stringResource(id = R.string.menu_language)) },
                    leadingIcon = {
                        Icon(Icons.Default.Language, contentDescription = null)
                    },
                    onClick = {
                        menuExpanded = false
                        showLanguageDialog = true
                    }
                )
            }
        }
    )

    // Language Selection Dialog
    if (showLanguageDialog) {
        AlertDialog(
            onDismissRequest = { showLanguageDialog = false },
            title = { Text(stringResource(id = R.string.language)) },
            text = {
                Column {
                    AppLanguage.entries.forEach { lang ->
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier
                                .padding(vertical = 4.dp)
                        ) {
                            RadioButton(
                                selected = (currentLanguage == lang),
                                onClick = {
                                    onLanguageSelected(lang)
                                    showLanguageDialog = false
                                }
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = lang.title,
                                style = MaterialTheme.typography.bodyLarge
                            )
                        }
                    }
                }
            },
            confirmButton = {
                TextButton(onClick = { showLanguageDialog = false }) {
                    Text(stringResource(id = R.string.cancel))
                }
            }
        )
    }
}

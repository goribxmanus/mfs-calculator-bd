package com.mfs.chargecalculator

import android.content.Context
import android.content.res.Configuration
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalConfiguration
import androidx.compose.ui.platform.LocalContext
import androidx.navigation.compose.rememberNavController
import com.mfs.chargecalculator.data.preferences.AppLanguage
import com.mfs.chargecalculator.ui.navigation.AppNavHost
import com.mfs.chargecalculator.ui.theme.MfsChargeCalculatorTheme
import com.mfs.chargecalculator.viewmodel.CalculatorViewModel
import com.mfs.chargecalculator.viewmodel.CalculatorViewModelFactory
import java.util.Locale

class MainActivity : ComponentActivity() {

    private val viewModel: CalculatorViewModel by viewModels {
        val app = application as MfsCalculatorApp
        CalculatorViewModelFactory(
            historyDao = app.database.historyDao(),
            preferencesRepository = app.preferencesRepository
        )
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        setContent {
            val userPreferences by viewModel.userPreferences.collectAsState()
            val navController = rememberNavController()

            // Update configuration locale dynamically for immediate language switching
            val context = LocalContext.current
            val locale = if (userPreferences.language == AppLanguage.BENGALI) {
                Locale("bn")
            } else {
                Locale("en")
            }
            val localizedContext = updateLocale(context, locale)
            val configuration = LocalConfiguration.current
            configuration.setLocale(locale)

            CompositionLocalProvider(
                LocalContext provides localizedContext,
                LocalConfiguration provides configuration
            ) {
                MfsChargeCalculatorTheme(themeMode = userPreferences.themeMode) {
                    Surface(modifier = Modifier.fillMaxSize()) {
                        AppNavHost(
                            navController = navController,
                            viewModel = viewModel
                        )
                    }
                }
            }
        }
    }

    private fun updateLocale(context: Context, locale: Locale): Context {
        Locale.setDefault(locale)
        val config = Configuration(context.resources.configuration)
        config.setLocale(locale)
        return context.createConfigurationContext(config)
    }
}

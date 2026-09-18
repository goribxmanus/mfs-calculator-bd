package com.mfs.chargecalculator.ui.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import com.mfs.chargecalculator.ui.screens.AboutDeveloperScreen
import com.mfs.chargecalculator.ui.screens.HistoryScreen
import com.mfs.chargecalculator.ui.screens.MainCalculatorScreen
import com.mfs.chargecalculator.ui.screens.SettingsScreen
import com.mfs.chargecalculator.viewmodel.CalculatorViewModel

@Composable
fun AppNavHost(
    navController: NavHostController,
    viewModel: CalculatorViewModel
) {
    NavHost(
        navController = navController,
        startDestination = Screen.Calculator.route
    ) {
        composable(Screen.Calculator.route) {
            MainCalculatorScreen(
                viewModel = viewModel,
                onNavigateToHistory = {
                    navController.navigate(Screen.History.route)
                },
                onNavigateToSettings = {
                    navController.navigate(Screen.Settings.route)
                },
                onNavigateToAboutDeveloper = {
                    navController.navigate(Screen.AboutDeveloper.route)
                }
            )
        }

        composable(Screen.History.route) {
            HistoryScreen(
                viewModel = viewModel,
                onNavigateBack = {
                    navController.popBackStack()
                }
            )
        }

        composable(Screen.Settings.route) {
            SettingsScreen(
                viewModel = viewModel,
                onNavigateBack = {
                    navController.popBackStack()
                }
            )
        }

        composable(Screen.AboutDeveloper.route) {
            AboutDeveloperScreen(
                onNavigateBack = {
                    navController.popBackStack()
                }
            )
        }
    }
}

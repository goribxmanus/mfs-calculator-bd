package com.mfs.chargecalculator.ui.navigation

sealed class Screen(val route: String) {
    data object Calculator : Screen("calculator")
    data object Settings : Screen("settings")
    data object AboutDeveloper : Screen("about_developer")
}

package com.mfs.chargecalculator.data.preferences

enum class ThemeMode(val value: String) {
    SYSTEM("system"),
    LIGHT("light"),
    DARK("dark");

    companion object {
        fun fromValue(value: String?): ThemeMode {
            return entries.firstOrNull { it.value.equals(value, ignoreCase = true) } ?: SYSTEM
        }
    }
}

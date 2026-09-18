package com.mfs.chargecalculator.data.preferences

enum class AppLanguage(val code: String, val title: String) {
    ENGLISH("en", "English"),
    BENGALI("bn", "বাংলা");

    companion object {
        fun fromCode(code: String?): AppLanguage {
            return entries.firstOrNull { it.code.equals(code, ignoreCase = true) } ?: ENGLISH
        }
    }
}

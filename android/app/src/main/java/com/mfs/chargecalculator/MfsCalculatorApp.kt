package com.mfs.chargecalculator

import android.app.Application
import com.mfs.chargecalculator.data.local.AppDatabase
import com.mfs.chargecalculator.data.preferences.UserPreferencesRepository

class MfsCalculatorApp : Application() {

    lateinit var database: AppDatabase
        private set

    lateinit var preferencesRepository: UserPreferencesRepository
        private set

    override fun onCreate() {
        super.onCreate()
        database = AppDatabase.getDatabase(this)
        preferencesRepository = UserPreferencesRepository(this)
    }
}

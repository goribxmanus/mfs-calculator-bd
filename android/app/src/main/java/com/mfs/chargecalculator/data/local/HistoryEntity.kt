package com.mfs.chargecalculator.data.local

import androidx.room.Entity
import androidx.room.PrimaryKey
import java.math.BigDecimal

@Entity(tableName = "calculation_history")
data class HistoryEntity(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val mfsName: String,
    val amount: Double,
    val grossPercentageCharge: Double,
    val sendMoneyFee: Double,
    val netCharge: Double,
    val totalCustomerPays: Double,
    val timestamp: Long = System.currentTimeMillis()
)

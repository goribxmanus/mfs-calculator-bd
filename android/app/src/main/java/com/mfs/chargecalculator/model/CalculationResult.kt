package com.mfs.chargecalculator.model

import java.math.BigDecimal
import java.text.DecimalFormat
import java.text.DecimalFormatSymbols
import java.util.Locale

data class CalculationResult(
    val amount: BigDecimal,
    val mfsName: String,
    val grossPercentageCharge: BigDecimal,
    val sendMoneyFee: BigDecimal,
    val netCharge: BigDecimal,
    val totalCustomerPays: BigDecimal
) {
    val formattedAmount: String get() = formatTaka(amount)
    val formattedGrossCharge: String get() = formatTaka(grossPercentageCharge)
    val formattedSendMoneyFee: String get() = formatTaka(sendMoneyFee)
    val formattedNetCharge: String get() = formatTaka(netCharge)
    val formattedTotal: String get() = formatTaka(totalCustomerPays)

    companion object {
        private val formatter = DecimalFormat("৳#,##0.00", DecimalFormatSymbols(Locale.US))

        fun formatTaka(value: BigDecimal): String {
            return formatter.format(value)
        }

        val EMPTY = CalculationResult(
            amount = BigDecimal.ZERO,
            mfsName = "bKash",
            grossPercentageCharge = BigDecimal.ZERO,
            sendMoneyFee = BigDecimal("5.00"),
            netCharge = BigDecimal.ZERO,
            totalCustomerPays = BigDecimal.ZERO
        )
    }
}

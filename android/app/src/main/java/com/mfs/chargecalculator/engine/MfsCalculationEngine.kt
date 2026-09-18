package com.mfs.chargecalculator.engine

import com.mfs.chargecalculator.model.CalculationResult
import java.math.BigDecimal
import java.math.RoundingMode

object MfsCalculationEngine {

    val MAX_SAFE_AMOUNT = BigDecimal("10000000.00") // ৳10 Million safe business limit
    private val ONE_THOUSAND = BigDecimal("1000.00")

    /**
     * Authoritative calculation engine for MFS business charges.
     *
     * Formula:
     * 1. percentageCharge = amount * rate / 1000
     * 2. netCharge = max(0, percentageCharge - sendMoneyFee)
     * 3. totalCustomerPays = amount + netCharge
     */
    fun calculate(
        amount: BigDecimal,
        mfsName: String,
        ratePer1000: BigDecimal,
        sendMoneyFee: BigDecimal
    ): CalculationResult {
        val safeAmount = when {
            amount <= BigDecimal.ZERO -> BigDecimal.ZERO
            amount > MAX_SAFE_AMOUNT -> MAX_SAFE_AMOUNT
            else -> amount.setScale(2, RoundingMode.HALF_UP)
        }

        if (safeAmount == BigDecimal.ZERO) {
            return CalculationResult(
                amount = BigDecimal.ZERO.setScale(2),
                mfsName = mfsName,
                grossPercentageCharge = BigDecimal.ZERO.setScale(2),
                sendMoneyFee = sendMoneyFee.setScale(2, RoundingMode.HALF_UP),
                netCharge = BigDecimal.ZERO.setScale(2),
                totalCustomerPays = BigDecimal.ZERO.setScale(2)
            )
        }

        // percentageCharge = amount * rate / 1000
        val grossCharge = safeAmount
            .multiply(ratePer1000)
            .divide(ONE_THOUSAND, 2, RoundingMode.HALF_UP)

        // For bKash and Nagad, sendMoneyFee is subtracted from gross charge.
        // Rocket/Upay have sendMoneyFee = 0.
        // netCharge = max(0, percentageCharge - sendMoneyFee)
        val rawNetCharge = grossCharge.subtract(sendMoneyFee)
        val netCharge = if (rawNetCharge < BigDecimal.ZERO) BigDecimal.ZERO.setScale(2) else rawNetCharge.setScale(2, RoundingMode.HALF_UP)

        // totalCustomerPays = amount + netCharge
        val totalCustomerPays = safeAmount.add(netCharge).setScale(2, RoundingMode.HALF_UP)

        return CalculationResult(
            amount = safeAmount,
            mfsName = mfsName,
            grossPercentageCharge = grossCharge,
            sendMoneyFee = sendMoneyFee.setScale(2, RoundingMode.HALF_UP),
            netCharge = netCharge,
            totalCustomerPays = totalCustomerPays
        )
    }

    fun parseAmount(input: String): BigDecimal {
        if (input.isBlank()) return BigDecimal.ZERO
        val sanitized = input.trim().replace(",", "")
        return try {
            val parsed = BigDecimal(sanitized)
            if (parsed < BigDecimal.ZERO) BigDecimal.ZERO else parsed
        } catch (_: Exception) {
            BigDecimal.ZERO
        }
    }
}

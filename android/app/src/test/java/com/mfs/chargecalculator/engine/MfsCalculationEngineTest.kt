package com.mfs.chargecalculator.engine

import org.junit.Assert.assertEquals
import org.junit.Test
import java.math.BigDecimal

class MfsCalculationEngineTest {

    @Test
    fun testBkashStandardCalculation() {
        // bKash: 18.5 per 1000, 5.00 send money fee
        val result = MfsCalculationEngine.calculate(
            amount = BigDecimal("1000.00"),
            mfsName = "bKash",
            ratePer1000 = BigDecimal("18.50"),
            sendMoneyFee = BigDecimal("5.00")
        )

        assertEquals("৳1,000.00", result.formattedAmount)
        assertEquals("৳18.50", result.formattedGrossCharge)
        assertEquals("৳5.00", result.formattedSendMoneyFee)
        assertEquals("৳13.50", result.formattedNetCharge)
        assertEquals("৳1,013.50", result.formattedTotal)
    }

    @Test
    fun testNagadStandardCalculation() {
        // Nagad: 13 per 1000, 5.00 send money fee
        val result = MfsCalculationEngine.calculate(
            amount = BigDecimal("1000.00"),
            mfsName = "Nagad",
            ratePer1000 = BigDecimal("13.00"),
            sendMoneyFee = BigDecimal("5.00")
        )

        assertEquals("৳1,000.00", result.formattedAmount)
        assertEquals("৳13.00", result.formattedGrossCharge)
        assertEquals("৳5.00", result.formattedSendMoneyFee)
        assertEquals("৳8.00", result.formattedNetCharge)
        assertEquals("৳1,008.00", result.formattedTotal)
    }

    @Test
    fun testRocketStandardCalculation() {
        // Rocket: 16.70 per 1000, 0.00 send money fee
        val result = MfsCalculationEngine.calculate(
            amount = BigDecimal("1000.00"),
            mfsName = "Rocket",
            ratePer1000 = BigDecimal("16.70"),
            sendMoneyFee = BigDecimal("0.00")
        )

        assertEquals("৳1,000.00", result.formattedAmount)
        assertEquals("৳16.70", result.formattedGrossCharge)
        assertEquals("৳0.00", result.formattedSendMoneyFee)
        assertEquals("৳16.70", result.formattedNetCharge)
        assertEquals("৳1,016.70", result.formattedTotal)
    }

    @Test
    fun testUpayStandardCalculation() {
        // Upay: 14 per 1000, 0.00 send money fee
        val result = MfsCalculationEngine.calculate(
            amount = BigDecimal("1000.00"),
            mfsName = "Upay",
            ratePer1000 = BigDecimal("14.00"),
            sendMoneyFee = BigDecimal("0.00")
        )

        assertEquals("৳1,000.00", result.formattedAmount)
        assertEquals("৳14.00", result.formattedGrossCharge)
        assertEquals("৳0.00", result.formattedSendMoneyFee)
        assertEquals("৳14.00", result.formattedNetCharge)
        assertEquals("৳1,014.00", result.formattedTotal)
    }

    @Test
    fun testZeroAmount() {
        val result = MfsCalculationEngine.calculate(
            amount = BigDecimal.ZERO,
            mfsName = "bKash",
            ratePer1000 = BigDecimal("18.50"),
            sendMoneyFee = BigDecimal("5.00")
        )

        assertEquals("৳0.00", result.formattedAmount)
        assertEquals("৳0.00", result.formattedGrossCharge)
        assertEquals("৳0.00", result.formattedNetCharge)
        assertEquals("৳0.00", result.formattedTotal)
    }

    @Test
    fun testDecimalAmount() {
        val result = MfsCalculationEngine.calculate(
            amount = BigDecimal("500.50"),
            mfsName = "bKash",
            ratePer1000 = BigDecimal("18.50"),
            sendMoneyFee = BigDecimal("5.00")
        )

        // 500.50 * 18.5 / 1000 = 9.25925 -> 9.26
        // Net: 9.26 - 5.00 = 4.26
        // Total: 500.50 + 4.26 = 504.76
        assertEquals("৳500.50", result.formattedAmount)
        assertEquals("৳9.26", result.formattedGrossCharge)
        assertEquals("৳4.26", result.formattedNetCharge)
        assertEquals("৳504.76", result.formattedTotal)
    }

    @Test
    fun testNegativeNetChargeScenario() {
        // If percentage charge is less than send money fee, net charge must clamp to 0.00
        val result = MfsCalculationEngine.calculate(
            amount = BigDecimal("100.00"),
            mfsName = "bKash",
            ratePer1000 = BigDecimal("18.50"),
            sendMoneyFee = BigDecimal("5.00")
        )
        // 100 * 18.5 / 1000 = 1.85
        // 1.85 - 5.00 = -3.15 -> clamps to 0.00
        assertEquals("৳0.00", result.formattedNetCharge)
        assertEquals("৳100.00", result.formattedTotal)
    }

    @Test
    fun testParseAmount() {
        assertEquals(BigDecimal("1000.00"), MfsCalculationEngine.parseAmount("1,000.00"))
        assertEquals(BigDecimal("500"), MfsCalculationEngine.parseAmount("500"))
        assertEquals(BigDecimal.ZERO, MfsCalculationEngine.parseAmount(""))
        assertEquals(BigDecimal.ZERO, MfsCalculationEngine.parseAmount("abc"))
    }
}

package com.mfs.chargecalculator.model

enum class MfsId {
    BKASH,
    NAGAD,
    ROCKET,
    UPAY
}

data class MfsProviderConfig(
    val id: MfsId,
    val displayName: String,
    val defaultRatePer1000: Double,
    val defaultSendMoneyFee: Double
) {
    companion object {
        val BKASH = MfsProviderConfig(
            id = MfsId.BKASH,
            displayName = "bKash",
            defaultRatePer1000 = 18.50,
            defaultSendMoneyFee = 5.00
        )
        val NAGAD = MfsProviderConfig(
            id = MfsId.NAGAD,
            displayName = "Nagad",
            defaultRatePer1000 = 13.00,
            defaultSendMoneyFee = 5.00
        )
        val ROCKET = MfsProviderConfig(
            id = MfsId.ROCKET,
            displayName = "Rocket",
            defaultRatePer1000 = 16.70,
            defaultSendMoneyFee = 0.00
        )
        val UPAY = MfsProviderConfig(
            id = MfsId.UPAY,
            displayName = "Upay",
            defaultRatePer1000 = 14.00,
            defaultSendMoneyFee = 0.00
        )

        val ALL = listOf(BKASH, NAGAD, ROCKET, UPAY)

        fun fromId(id: MfsId): MfsProviderConfig =
            ALL.firstOrNull { it.id == id } ?: BKASH

        fun fromName(name: String): MfsProviderConfig =
            ALL.firstOrNull { it.displayName.equals(name, ignoreCase = true) } ?: BKASH
    }
}

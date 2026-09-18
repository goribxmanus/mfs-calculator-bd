import { CalculationResult, MfsConfig, MfsId } from './types';

export const MFS_PROVIDERS: Record<MfsId, MfsConfig> = {
  BKASH: {
    id: 'BKASH',
    name: 'bKash',
    defaultRate: 18.5,
    defaultSendFee: 5.0,
    badgeColor: '#D81B60',
  },
  NAGAD: {
    id: 'NAGAD',
    name: 'Nagad',
    defaultRate: 13.0,
    defaultSendFee: 5.0,
    badgeColor: '#E65100',
  },
  ROCKET: {
    id: 'ROCKET',
    name: 'Rocket',
    defaultRate: 16.7,
    defaultSendFee: 0.0,
    badgeColor: '#6A1B9A',
  },
  UPAY: {
    id: 'UPAY',
    name: 'Upay',
    defaultRate: 14.0,
    defaultSendFee: 0.0,
    badgeColor: '#00838F',
  },
};

export const MFS_LIST: MfsConfig[] = [
  MFS_PROVIDERS.BKASH,
  MFS_PROVIDERS.NAGAD,
  MFS_PROVIDERS.ROCKET,
  MFS_PROVIDERS.UPAY,
];

export function formatTaka(amount: number): string {
  return '৳' + amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Authoritative MFS Calculation Engine
 * 1. percentageCharge = amount * rate / 1000
 * 2. netCharge = max(0, percentageCharge - sendMoneyFee)
 * 3. totalCustomerPays = amount + netCharge
 */
export function calculateMfsCharge(
  amount: number,
  mfsName: string,
  ratePer1000: number,
  sendMoneyFee: number
): CalculationResult {
  const safeAmount = Math.max(0, isNaN(amount) ? 0 : amount);

  if (safeAmount === 0) {
    return {
      amount: 0,
      mfsName,
      grossPercentageCharge: 0,
      sendMoneyFee: Number(sendMoneyFee.toFixed(2)),
      netCharge: 0,
      totalCustomerPays: 0,
      formattedAmount: formatTaka(0),
      formattedGrossCharge: formatTaka(0),
      formattedSendMoneyFee: formatTaka(sendMoneyFee),
      formattedNetCharge: formatTaka(0),
      formattedTotal: formatTaka(0),
    };
  }

  // percentageCharge = amount * rate / 1000 (rounded to 2 decimal places)
  const rawGrossCharge = (safeAmount * ratePer1000) / 1000;
  const grossCharge = Math.round(rawGrossCharge * 100) / 100;

  // netCharge = max(0, percentageCharge - sendMoneyFee)
  const rawNetCharge = grossCharge - sendMoneyFee;
  const netCharge = Math.max(0, Math.round(rawNetCharge * 100) / 100);

  // total = amount + netCharge
  const total = Math.round((safeAmount + netCharge) * 100) / 100;

  return {
    amount: safeAmount,
    mfsName,
    grossPercentageCharge: grossCharge,
    sendMoneyFee,
    netCharge,
    totalCustomerPays: total,
    formattedAmount: formatTaka(safeAmount),
    formattedGrossCharge: formatTaka(grossCharge),
    formattedSendMoneyFee: formatTaka(sendMoneyFee),
    formattedNetCharge: formatTaka(netCharge),
    formattedTotal: formatTaka(total),
  };
}

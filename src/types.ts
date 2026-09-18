export type MfsId = 'BKASH' | 'NAGAD' | 'ROCKET' | 'UPAY';

export interface MfsConfig {
  id: MfsId;
  name: string;
  defaultRate: number; // per 1000
  defaultSendFee: number;
  badgeColor: string;
}

export interface CalculationResult {
  amount: number;
  mfsName: string;
  grossPercentageCharge: number;
  sendMoneyFee: number;
  netCharge: number;
  totalCustomerPays: number;
  formattedAmount: string;
  formattedGrossCharge: string;
  formattedSendMoneyFee: string;
  formattedNetCharge: string;
  formattedTotal: string;
}

export interface HistoryItem {
  id: string;
  mfsName: string;
  amount: number;
  grossPercentageCharge: number;
  sendMoneyFee: number;
  netCharge: number;
  totalCustomerPays: number;
  timestamp: number;
}

export type AppLanguage = 'en' | 'bn';
export type ThemeMode = 'light' | 'dark' | 'system';
export type ScreenRoute = 'calculator' | 'history' | 'settings' | 'about_developer';

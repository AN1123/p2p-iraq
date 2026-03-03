// Inlined from packages/shared — no workspace dependency needed for Vercel

export const GOVERNORATES = [
  'بغداد', 'البصرة', 'نينوى', 'أربيل', 'السليمانية',
  'النجف', 'كربلاء', 'الأنبار', 'ديالى', 'صلاح الدين',
  'كركوك', 'واسط', 'ميسان', 'ذي قار', 'المثنى',
  'القادسية', 'بابل', 'دهوك',
]

export const NETWORK_FEES: Record<string, { approxUsd: number; warning?: string }> = {
  TRC20:   { approxUsd: 1 },
  BEP20:   { approxUsd: 0.5, warning: 'BNB مطلوب للغاز' },
  ERC20:   { approxUsd: 15, warning: '⚠️ رسوم عالية جداً — تجنب للمبالغ أقل من 500$' },
  POLYGON: { approxUsd: 0.01, warning: 'أقل دعماً من TRC20' },
}

export const COMMISSION_PCT = 1.0
export const MIN_ORDER_USD = 10
export const MAX_ORDER_USD = 5000

export function calcBuyTotal(amountUsdt: number, rateIqd: number) {
  const baseIqd = Math.round(amountUsdt * rateIqd)
  const commission = Math.round(baseIqd * (COMMISSION_PCT / 100))
  return { baseIqd, commission, total: baseIqd + commission }
}

export function calcSellReceive(amountUsdt: number, rateIqd: number) {
  const baseIqd = Math.round(amountUsdt * rateIqd)
  const commission = Math.round(baseIqd * (COMMISSION_PCT / 100))
  return { baseIqd, commission, receive: baseIqd - commission }
}

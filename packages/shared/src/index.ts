// ─── Types ───────────────────────────────────────────────────────────────────

export type OrderType = 'BUY' | 'SELL'
export type OrderStatus =
  | 'pending'
  | 'payment_instructions_sent'
  | 'proof_submitted'
  | 'proof_approved'
  | 'processing'
  | 'completed'
  | 'cancelled'
  | 'frozen'
  | 'disputed'

export type Network = 'TRC20' | 'ERC20' | 'BEP20' | 'POLYGON'
export type PaymentMethod = 'FIB' | 'ZAINCASH' | 'QICARD'
export type TrustLevel = 'new' | 'trusted' | 'trader' | 'vip'

export interface Order {
  id: string
  orderRef: string        // e.g. BUY-20260303-0042
  type: OrderType
  userId: string
  amountUsdt: number
  amountIqd: number
  network: Network
  paymentMethod: PaymentMethod
  walletAddress?: string  // buyer's wallet
  localAccount?: string   // seller's local payment account
  governorate: string
  commissionPct: number
  commissionIqd: number
  rateIqd: number
  status: OrderStatus
  proofUrl?: string
  escrowTxHash?: string
  releaseTxHash?: string
  createdAt: Date
  expiresAt: Date
}

export interface User {
  id: string
  telegramId: number
  telegramUsername?: string
  fullName?: string
  phone?: string
  governorate?: string
  trustLevel: TrustLevel
  kycStatus: 'none' | 'pending' | 'verified'
  isBanned: boolean
  dailyLimitUsd: number
}

export interface Rate {
  buyRate: number    // IQD per USDT (we sell USDT at this price)
  sellRate: number   // IQD per USDT (we buy USDT at this price)
  spread: number
  updatedAt: Date
}

// ─── Constants ───────────────────────────────────────────────────────────────

export const GOVERNORATES = [
  'بغداد', 'البصرة', 'نينوى', 'أربيل', 'السليمانية',
  'النجف', 'كربلاء', 'الأنبار', 'ديالى', 'صلاح الدين',
  'كركوك', 'واسط', 'ميسان', 'ذي قار', 'المثنى',
  'القادسية', 'بابل', 'دهوك'
]

export const NETWORK_FEES: Record<Network, { approxUsd: number; warning?: string }> = {
  TRC20:   { approxUsd: 1,    warning: undefined },
  BEP20:   { approxUsd: 0.5,  warning: 'BNB مطلوب للغاز' },
  ERC20:   { approxUsd: 15,   warning: '⚠️ رسوم عالية جداً — تجنب للمبالغ أقل من 500$' },
  POLYGON: { approxUsd: 0.01, warning: 'أقل دعماً من TRC20' },
}

export const TRUST_LIMITS: Record<TrustLevel, number> = {
  new:     100,
  trusted: 1000,
  trader:  10000,
  vip:     999999,
}

export const ORDER_EXPIRY_MINUTES = 30
export const COMMISSION_PCT = 1.0
export const MIN_ORDER_USD = 10
export const MAX_ORDER_USD = 5000

// ─── Utils ────────────────────────────────────────────────────────────────────

export function generateOrderRef(type: OrderType, seq: number): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  return `${type}-${date}-${String(seq).padStart(4, '0')}`
}

export function calcCommission(amountIqd: number, pct = COMMISSION_PCT): number {
  return Math.round(amountIqd * (pct / 100))
}

export function calcBuyTotal(amountUsdt: number, rateIqd: number): {
  baseIqd: number
  commission: number
  total: number
} {
  const baseIqd = Math.round(amountUsdt * rateIqd)
  const commission = calcCommission(baseIqd)
  return { baseIqd, commission, total: baseIqd + commission }
}

export function calcSellReceive(amountUsdt: number, rateIqd: number): {
  baseIqd: number
  commission: number
  receive: number
} {
  const baseIqd = Math.round(amountUsdt * rateIqd)
  const commission = calcCommission(baseIqd)
  return { baseIqd, commission, receive: baseIqd - commission }
}

'use client'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { PriceSummary } from './PriceSummary'
import { SuccessView } from './SuccessView'
import { calcBuyTotal, calcSellReceive } from '@/lib/shared'

const NETWORKS = ['TRC20', 'BEP20', 'ERC20']
const PAYMENTS = ['FIB', 'ZainCash', 'Qi Card']

function generateRef() {
  const type = 'ORD'
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const seq  = String(Math.floor(Math.random() * 9000) + 1000)
  return `${type}-${date}-${seq}`
}

type Step = 1 | 2 | 3
type OrderType = 'buy' | 'sell'

interface FormData {
  type: OrderType
  amount: string
  network: string
  payment: string
  wallet: string
  localAccount: string
  governorate: string
  telegram: string
}

const GOVERNORATES = [
  'بغداد', 'البصرة', 'نينوى', 'أربيل', 'السليمانية',
  'النجف', 'كربلاء', 'الأنبار', 'ديالى', 'صلاح الدين',
  'كركوك', 'واسط', 'ميسان', 'ذي قار', 'المثنى',
  'القادسية', 'بابل', 'دهوك',
]

const BUY_RATE  = 1485
const SELL_RATE = 1465

export function RequestForm() {
  const searchParams = useSearchParams()
  const initType = (searchParams.get('type') || 'buy') as OrderType

  const [step, setStep]     = useState<Step>(1)
  const [orderRef, setOrderRef] = useState('')
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [form, setForm]     = useState<FormData>({
    type: initType,
    amount: '',
    network: 'TRC20',
    payment: 'FIB',
    wallet: '',
    localAccount: '',
    governorate: 'بغداد',
    telegram: '',
  })

  const set = (k: keyof FormData, v: string) => {
    setForm(f => ({ ...f, [k]: v }))
    setErrors(e => ({ ...e, [k]: undefined }))
  }

  const amountNum = parseFloat(form.amount) || 0
  const isBuy     = form.type === 'buy'
  const rate      = isBuy ? BUY_RATE : SELL_RATE
  const calc      = isBuy ? calcBuyTotal(amountNum, rate) : calcSellReceive(amountNum, rate)

  const validateStep1 = () => {
    const e: Partial<FormData> = {}
    if (!form.amount || amountNum < 10)    e.amount = 'المبلغ يجب أن يكون 10$ على الأقل'
    if (amountNum > 5000)                  e.amount = 'الحد الأقصى 5000$'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const validateStep2 = () => {
    const e: Partial<FormData> = {}
    if (isBuy && !form.wallet.trim())           e.wallet = 'عنوان المحفظة مطلوب'
    if (!isBuy && !form.localAccount.trim())    e.localAccount = 'رقم الحساب مطلوب'
    if (!form.telegram.trim())                  e.telegram = 'معرّف تيليجرام مطلوب'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const next = () => {
    if (step === 1 && !validateStep1()) return
    if (step === 2 && !validateStep2()) return
    if (step === 3) {
      const ref = generateRef()
      setOrderRef(ref)
      setStep(4 as Step)
      return
    }
    setStep(s => (s + 1) as Step)
  }

  if ((step as number) === 4) {
    return <SuccessView orderRef={orderRef} type={form.type} amount={amountNum} />
  }

  const stepLabels = ['نوع العملية', 'تفاصيل الطلب', 'المراجعة']

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          {stepLabels.map((l, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black transition-all ${
                step > i + 1
                  ? 'gradient-btn text-white'
                  : step === i + 1
                    ? 'bg-primary text-white shadow-glow-primary'
                    : 'dark:bg-white/10 bg-slate-200 dark:text-slate-500 text-slate-400'
              }`}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${
                step === i + 1 ? 'text-primary' : 'dark:text-slate-500 text-slate-400'
              }`}>{l}</span>
              {i < 2 && <div className="flex-1 mx-2 h-0.5 dark:bg-white/10 bg-slate-200 w-8 sm:w-16"/>}
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-3xl p-6 sm:p-8">

        {/* STEP 1: Type + Amount */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black">نوع العملية والمبلغ</h2>

            {/* Type toggle */}
            <div className="grid grid-cols-2 gap-3">
              {(['buy', 'sell'] as OrderType[]).map(t => (
                <button
                  key={t}
                  onClick={() => set('type', t)}
                  className={`py-4 rounded-2xl font-black text-lg transition-all border-2 ${
                    form.type === t
                      ? t === 'buy'
                        ? 'border-success bg-success/20 text-success'
                        : 'border-danger bg-danger/20 text-danger'
                      : 'dark:border-white/10 border-slate-200 dark:text-slate-400 text-slate-500 hover:border-primary/50'
                  }`}
                >
                  {t === 'buy' ? '🟢 شراء' : '🔴 بيع'}
                </button>
              ))}
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-bold mb-2 dark:text-slate-300 text-slate-700">
                المبلغ (USDT) <span className="text-danger">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={form.amount}
                  onChange={e => set('amount', e.target.value)}
                  placeholder="100"
                  min="10" max="5000"
                  className={`w-full rounded-2xl px-4 py-4 text-lg font-bold dark:bg-white/5 bg-slate-100
                    border ${errors.amount ? 'border-danger' : 'dark:border-white/10 border-slate-200'}
                    focus:outline-none focus:border-primary transition-colors`}
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-primary">USDT</span>
              </div>
              {errors.amount && <p className="text-danger text-xs mt-1">{errors.amount}</p>}
              <p className="text-xs dark:text-slate-500 text-slate-400 mt-1">الحد: 10$ – 5,000$</p>
            </div>

            {/* Live preview */}
            {amountNum >= 10 && (
              <PriceSummary isBuy={isBuy} amountNum={amountNum} rate={rate} calc={calc} />
            )}
          </div>
        )}

        {/* STEP 2: Details */}
        {step === 2 && (
          <div className="space-y-5">
            <h2 className="text-2xl font-black">تفاصيل الطلب</h2>

            {/* Network */}
            <div>
              <label className="block text-sm font-bold mb-2 dark:text-slate-300 text-slate-700">شبكة USDT</label>
              <div className="grid grid-cols-3 gap-2">
                {NETWORKS.map(n => (
                  <button
                    key={n}
                    onClick={() => set('network', n)}
                    className={`py-3 rounded-xl text-sm font-bold transition-all border ${
                      form.network === n
                        ? 'border-primary bg-primary/20 text-primary'
                        : 'dark:border-white/10 border-slate-200 dark:text-slate-400 text-slate-600'
                    }`}
                  >
                    {n}
                    {n === 'TRC20' && <div className="text-xs text-success font-normal">موصى به</div>}
                    {n === 'ERC20' && <div className="text-xs text-warning font-normal">رسوم عالية</div>}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment */}
            <div>
              <label className="block text-sm font-bold mb-2 dark:text-slate-300 text-slate-700">
                {isBuy ? 'طريقة دفعك (IQD)' : 'طريقة استلام IQD'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {PAYMENTS.map(p => (
                  <button
                    key={p}
                    onClick={() => set('payment', p)}
                    className={`py-3 rounded-xl text-sm font-bold transition-all border ${
                      form.payment === p
                        ? 'border-primary bg-primary/20 text-primary'
                        : 'dark:border-white/10 border-slate-200 dark:text-slate-400 text-slate-600'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Wallet or local account */}
            {isBuy ? (
              <div>
                <label className="block text-sm font-bold mb-2 dark:text-slate-300 text-slate-700">
                  عنوان محفظة USDT ({form.network}) <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  value={form.wallet}
                  onChange={e => set('wallet', e.target.value)}
                  placeholder="TXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  className={`w-full rounded-2xl px-4 py-4 text-sm font-mono dark:bg-white/5 bg-slate-100
                    border ${errors.wallet ? 'border-danger' : 'dark:border-white/10 border-slate-200'}
                    focus:outline-none focus:border-primary transition-colors`}
                />
                {errors.wallet && <p className="text-danger text-xs mt-1">{errors.wallet}</p>}
              </div>
            ) : (
              <div>
                <label className="block text-sm font-bold mb-2 dark:text-slate-300 text-slate-700">
                  رقم حساب {form.payment} لاستلام IQD <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  value={form.localAccount}
                  onChange={e => set('localAccount', e.target.value)}
                  placeholder="07xxxxxxxxxx"
                  className={`w-full rounded-2xl px-4 py-4 dark:bg-white/5 bg-slate-100
                    border ${errors.localAccount ? 'border-danger' : 'dark:border-white/10 border-slate-200'}
                    focus:outline-none focus:border-primary transition-colors`}
                />
                {errors.localAccount && <p className="text-danger text-xs mt-1">{errors.localAccount}</p>}
              </div>
            )}

            {/* Governorate */}
            <div>
              <label className="block text-sm font-bold mb-2 dark:text-slate-300 text-slate-700">المحافظة</label>
              <select
                value={form.governorate}
                onChange={e => set('governorate', e.target.value)}
                className="w-full rounded-2xl px-4 py-4 dark:bg-white/5 bg-slate-100
                  border dark:border-white/10 border-slate-200
                  focus:outline-none focus:border-primary transition-colors"
              >
                {GOVERNORATES.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>

            {/* Telegram */}
            <div>
              <label className="block text-sm font-bold mb-2 dark:text-slate-300 text-slate-700">
                معرّف تيليجرام <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                value={form.telegram}
                onChange={e => set('telegram', e.target.value)}
                placeholder="@username"
                className={`w-full rounded-2xl px-4 py-4 dark:bg-white/5 bg-slate-100
                  border ${errors.telegram ? 'border-danger' : 'dark:border-white/10 border-slate-200'}
                  focus:outline-none focus:border-primary transition-colors`}
              />
              {errors.telegram && <p className="text-danger text-xs mt-1">{errors.telegram}</p>}
            </div>
          </div>
        )}

        {/* STEP 3: Review */}
        {step === 3 && (
          <div className="space-y-5">
            <h2 className="text-2xl font-black">مراجعة الطلب</h2>
            <div className="space-y-3">
              {[
                { l: 'نوع العملية', v: isBuy ? '🟢 شراء USDT' : '🔴 بيع USDT' },
                { l: 'المبلغ', v: `${form.amount} USDT` },
                { l: 'الشبكة', v: form.network },
                { l: 'طريقة الدفع', v: form.payment },
                isBuy
                  ? { l: 'عنوان المحفظة', v: `${form.wallet.slice(0,8)}...${form.wallet.slice(-6)}` }
                  : { l: 'رقم الحساب', v: form.localAccount },
                { l: 'المحافظة', v: form.governorate },
                { l: 'تيليجرام', v: form.telegram },
              ].map(row => (
                <div key={row.l} className="flex justify-between items-center py-3 border-b dark:border-white/[0.05] border-slate-100">
                  <span className="text-sm dark:text-slate-400 text-slate-500">{row.l}</span>
                  <span className="text-sm font-bold">{row.v}</span>
                </div>
              ))}
            </div>
            <PriceSummary isBuy={isBuy} amountNum={amountNum} rate={rate} calc={calc} />
            <p className="text-xs dark:text-slate-500 text-slate-400 text-center">
              بإرسال الطلب توافق على{' '}
              <a href="/legal/terms" className="text-primary underline">شروط الاستخدام</a>
              {' '}و{' '}
              <a href="/legal/risk" className="text-warning underline">تحذيرات المخاطر</a>
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 mt-8">
          {step > 1 && (
            <button
              onClick={() => setStep(s => (s - 1) as Step)}
              className="flex-1 py-4 rounded-2xl font-bold dark:bg-white/10 bg-slate-100 dark:text-slate-300 text-slate-700 hover:bg-slate-200 dark:hover:bg-white/15 transition-colors"
            >
              ← رجوع
            </button>
          )}
          <button
            onClick={next}
            className="flex-1 py-4 rounded-2xl font-black text-white gradient-btn"
          >
            {step === 3 ? '✅ أرسل الطلب' : 'التالي →'}
          </button>
        </div>
      </div>
    </div>
  )
}

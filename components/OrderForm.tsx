'use client'
import { useState, useEffect } from 'react'
import { calcBuyTotal, calcSellReceive, GOVERNORATES } from '@/lib/shared'

type OrderType = 'BUY' | 'SELL'

export function OrderForm({ type }: { type: OrderType }) {
  const [amount, setAmount] = useState('')
  const [network, setNetwork] = useState('TRC20')
  const [payment, setPayment] = useState('FIB')
  const [buyRate, setBuyRate] = useState(1485)
  const [sellRate, setSellRate] = useState(1465)

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rates`)
      .then(r => r.json())
      .then(d => { setBuyRate(d.buyRate); setSellRate(d.sellRate) })
      .catch(() => {})
  }, [])

  const amountNum = parseFloat(amount) || 0
  const rate = type === 'BUY' ? buyRate : sellRate
  const buyCalc  = calcBuyTotal(amountNum, rate)
  const sellCalc = calcSellReceive(amountNum, rate)
  const totalIqd = isBuy ? buyCalc.total : sellCalc.receive
  const commission = isBuy ? buyCalc.commission : sellCalc.commission

  const botUsername = process.env.NEXT_PUBLIC_BOT_USERNAME || 'YourBot'
  const deepLink = `https://t.me/${botUsername}?start=${type.toLowerCase()}_${amountNum}_${network}`

  const isBuy = type === 'BUY'

  return (
    <div className={`rounded-2xl border p-6 space-y-4 ${isBuy ? 'border-green-500/30 bg-green-500/5' : 'border-red-500/30 bg-red-500/5'}`}>
      <h3 className={`font-bold text-lg ${isBuy ? 'text-green-400' : 'text-red-400'}`}>
        {isBuy ? '🟢 شراء USDT' : '🔴 بيع USDT'}
      </h3>

      <div className="space-y-3">
        {/* Amount */}
        <div>
          <label className="text-sm text-zinc-400 block mb-1">المبلغ (USDT)</label>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="100"
            min="10" max="5000"
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:border-cyan-500 outline-none"
          />
        </div>

        {/* Network */}
        <div>
          <label className="text-sm text-zinc-400 block mb-1">الشبكة</label>
          <select
            value={network}
            onChange={e => setNetwork(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white"
          >
            <option value="TRC20">TRC20 (موصى به)</option>
            <option value="BEP20">BEP20</option>
            <option value="ERC20">ERC20 (رسوم عالية)</option>
          </select>
        </div>

        {/* Payment */}
        <div>
          <label className="text-sm text-zinc-400 block mb-1">طريقة الدفع</label>
          <select
            value={payment}
            onChange={e => setPayment(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white"
          >
            <option value="FIB">FIB</option>
            <option value="ZAINCASH">ZainCash</option>
            <option value="QICARD">Qi Card</option>
          </select>
        </div>

        {/* Calculation preview */}
        {amountNum > 0 && (
          <div className="bg-zinc-900 rounded-lg p-3 text-sm space-y-1">
            <div className="flex justify-between text-zinc-400">
              <span>السعر</span>
              <span>{rate.toLocaleString()} IQD</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>العمولة 1%</span>
              <span>{commission.toLocaleString()} IQD</span>
            </div>
            <div className="flex justify-between font-bold text-white border-t border-zinc-800 pt-1 mt-1">
              <span>{isBuy ? 'تدفع' : 'تستلم'}</span>
              <span>{totalIqd.toLocaleString()} IQD</span>
            </div>
          </div>
        )}

        {/* CTA */}
        <a
          href={deepLink}
          target="_blank"
          className={`block w-full text-center py-3 rounded-xl font-bold transition-opacity ${
            amountNum > 0 ? 'opacity-100' : 'opacity-40 pointer-events-none'
          } ${isBuy ? 'bg-green-500 hover:bg-green-400 text-black' : 'bg-red-500 hover:bg-red-400 text-white'}`}
        >
          {isBuy ? '🟢 ابدأ الشراء عبر تيليجرام' : '🔴 ابدأ البيع عبر تيليجرام'}
        </a>
      </div>
    </div>
  )
}

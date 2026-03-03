'use client'
import { useEffect, useState } from 'react'

interface Rate { buyRate: number; sellRate: number; spread: number; updatedAt: string }

export function RatesDisplay() {
  const [rate, setRate] = useState<Rate | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rates`)
        if (res.ok) setRate(await res.json())
      } catch { /* show placeholder */ }
      setLoading(false)
    }
    load()
    const interval = setInterval(load, 60_000)
    return () => clearInterval(interval)
  }, [])

  if (loading) return <div className="text-center text-zinc-500 py-4">جاري جلب الأسعار...</div>

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-lg">💱 أسعار اليوم</h2>
        {rate && (
          <span className="text-xs text-zinc-500">
            آخر تحديث: {new Date(rate.updatedAt).toLocaleTimeString('ar-IQ')}
          </span>
        )}
      </div>
      {!rate ? (
        <p className="text-zinc-500 text-center py-4">الأسعار غير متاحة حالياً</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center">
            <div className="text-xs text-green-400 mb-1">شراء USDT منا</div>
            <div className="text-2xl font-bold text-green-400">{rate.buyRate.toLocaleString()}</div>
            <div className="text-xs text-zinc-500">IQD لكل دولار</div>
          </div>
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
            <div className="text-xs text-red-400 mb-1">بيع USDT لنا</div>
            <div className="text-2xl font-bold text-red-400">{rate.sellRate.toLocaleString()}</div>
            <div className="text-xs text-zinc-500">IQD لكل دولار</div>
          </div>
        </div>
      )}
    </div>
  )
}

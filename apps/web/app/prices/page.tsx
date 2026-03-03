import { RatesDisplay } from '@/components/RatesDisplay'
import { NetworkWarnings } from '@/components/NetworkWarnings'

const EXAMPLES = [
  { usdt: 100, buy: 1485, sell: 1465 },
  { usdt: 500, buy: 1485, sell: 1465 },
  { usdt: 2000, buy: 1485, sell: 1465 },
]

export default function PricesPage() {
  return (
    <main className="min-h-screen max-w-3xl mx-auto px-4 py-12 space-y-10">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">💱 الأسعار والرسوم</h1>
        <p className="text-zinc-400">شفافية كاملة — بدون رسوم مخفية</p>
      </div>

      <RatesDisplay />

      {/* Examples */}
      <div className="space-y-4">
        <h2 className="font-bold text-xl">أمثلة حسابية</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-zinc-500 text-right border-b border-zinc-800">
                <th className="pb-2 pr-4">المبلغ</th>
                <th className="pb-2 pr-4">تكلفة الشراء</th>
                <th className="pb-2 pr-4">عمولة 1%</th>
                <th className="pb-2">تستلم بالبيع</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {EXAMPLES.map(({ usdt, buy, sell }) => {
                const buyBase = usdt * buy
                const commission = Math.round(buyBase * 0.01)
                const total = buyBase + commission
                const sellReceive = Math.round(usdt * sell * 0.99)
                return (
                  <tr key={usdt} className="text-right">
                    <td className="py-3 pr-4 font-bold text-cyan-400">{usdt} USDT</td>
                    <td className="py-3 pr-4">{total.toLocaleString()} IQD</td>
                    <td className="py-3 pr-4 text-zinc-400">{commission.toLocaleString()} IQD</td>
                    <td className="py-3">{sellReceive.toLocaleString()} IQD</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-zinc-600">* الأسعار تقريبية. السعر الفعلي عند إنشاء الطلب. رسوم الشبكة غير مشمولة.</p>
      </div>

      <NetworkWarnings />
    </main>
  )
}

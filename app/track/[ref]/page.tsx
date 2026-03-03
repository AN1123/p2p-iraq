import { notFound } from 'next/navigation'

const STATUS_LABELS: Record<string, { label: string; color: string; icon: string }> = {
  pending:                    { label: 'في الانتظار', color: 'text-zinc-400', icon: '⏳' },
  payment_instructions_sent:  { label: 'في انتظار دفعك', color: 'text-yellow-400', icon: '💳' },
  proof_submitted:            { label: 'إثبات مُرسَل — قيد المراجعة', color: 'text-blue-400', icon: '🔍' },
  proof_approved:             { label: 'إثبات مقبول', color: 'text-green-400', icon: '✅' },
  processing:                 { label: 'جاري المعالجة', color: 'text-cyan-400', icon: '⚙️' },
  completed:                  { label: 'مكتمل', color: 'text-green-400', icon: '🎉' },
  cancelled:                  { label: 'ملغى', color: 'text-red-400', icon: '❌' },
  frozen:                     { label: 'مجمّد — سيتواصل معك المشرف', color: 'text-blue-400', icon: '❄️' },
  disputed:                   { label: 'نزاع مفتوح', color: 'text-amber-400', icon: '⚠️' },
}

async function getOrder(ref: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${ref}`, {
      next: { revalidate: 10 },
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export default async function TrackPage({ params }: { params: { ref: string } }) {
  const order = await getOrder(params.ref)
  if (!order) return notFound()

  const status = STATUS_LABELS[order.status] || { label: order.status, color: 'text-zinc-400', icon: '❓' }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <div className="text-5xl mb-3">{status.icon}</div>
          <h1 className="text-2xl font-bold mb-1">حالة الطلب</h1>
          <p className={`text-lg font-medium ${status.color}`}>{status.label}</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-3 text-sm">
          <Row label="رقم الطلب" value={<code className="font-mono text-cyan-400">{order.orderRef}</code>} />
          <Row label="النوع" value={order.type === 'BUY' ? '🟢 شراء USDT' : '🔴 بيع USDT'} />
          <Row label="المبلغ" value={`${order.amountUsdt} USDT`} />
          <Row label="الشبكة" value={order.network} />
          <Row label="طريقة الدفع" value={order.paymentMethod} />
          <Row label="تاريخ الطلب" value={new Date(order.createdAt).toLocaleString('ar-IQ')} />
          {order.completedAt && (
            <Row label="تاريخ الإتمام" value={new Date(order.completedAt).toLocaleString('ar-IQ')} />
          )}
          {order.releaseTxHash && (
            <Row
              label="TX Hash"
              value={
                <a
                  href={`https://tronscan.org/#/transaction/${order.releaseTxHash}`}
                  target="_blank"
                  className="text-cyan-400 underline font-mono text-xs break-all"
                >
                  {order.releaseTxHash.slice(0, 16)}...
                </a>
              }
            />
          )}
        </div>

        <a
          href={`https://t.me/${process.env.NEXT_PUBLIC_BOT_USERNAME}`}
          target="_blank"
          className="block w-full text-center py-3 rounded-xl bg-cyan-500 text-black font-bold hover:bg-cyan-400 transition-colors"
        >
          📱 تواصل عبر تيليجرام
        </a>
      </div>
    </main>
  )
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between items-start gap-2">
      <span className="text-zinc-500 shrink-0">{label}</span>
      <span className="text-right text-white">{value}</span>
    </div>
  )
}

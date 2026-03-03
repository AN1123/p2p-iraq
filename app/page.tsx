import { RatesDisplay } from '@/components/RatesDisplay'
import { OrderForm } from '@/components/OrderForm'
import { NetworkWarnings } from '@/components/NetworkWarnings'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b border-zinc-800 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="font-bold text-xl text-cyan-400">💱 USDT Iraq</div>
          <a
            href={`https://t.me/${process.env.NEXT_PUBLIC_BOT_USERNAME}`}
            target="_blank"
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            📱 تيليجرام
          </a>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
        {/* Hero */}
        <div className="text-center space-y-4">
          <div className="inline-block px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
            ✅ خدمة موثوقة
          </div>
          <h1 className="text-4xl font-bold">بيع وشراء USDT في العراق</h1>
          <p className="text-zinc-400 text-lg max-w-lg mx-auto">
            تبادل آمن وسريع عبر FIB · ZainCash · Qi Card
            <br />
            عمولة 1% فقط · تنفيذ خلال 15 دقيقة
          </p>
        </div>

        {/* Live Rates */}
        <RatesDisplay />

        {/* Order Form */}
        <div className="grid md:grid-cols-2 gap-6">
          <OrderForm type="BUY" />
          <OrderForm type="SELL" />
        </div>

        {/* Network Warnings */}
        <NetworkWarnings />

        {/* How it works */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-center">كيف يعمل؟</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { step: '1', title: 'أدخل طلبك', desc: 'حدد المبلغ والشبكة وطريقة الدفع' },
              { step: '2', title: 'انتقل لتيليجرام', desc: 'تحويل تلقائي للبوت لإتمام الصفقة' },
              { step: '3', title: 'تم!', desc: 'استلم USDT خلال 5–15 دقيقة' },
            ].map((s) => (
              <div key={s.step} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-center">
                <div className="w-10 h-10 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center mx-auto mb-3">
                  {s.step}
                </div>
                <div className="font-semibold mb-1">{s.title}</div>
                <div className="text-zinc-400 text-sm">{s.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Disclaimer */}
        <p className="text-center text-xs text-zinc-600">
          ⚠️ هذه المنصة وسيط P2P فقط. ليست نصيحة مالية. التداول على مسؤوليتك.
        </p>
      </div>
    </main>
  )
}

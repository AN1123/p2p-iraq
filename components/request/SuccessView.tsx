import Link from 'next/link'

const BOT_URL = process.env.NEXT_PUBLIC_BOT_USERNAME
  ? `https://t.me/${process.env.NEXT_PUBLIC_BOT_USERNAME}`
  : 'https://t.me/'

interface Props {
  orderRef: string
  type: 'buy' | 'sell'
  amount: number
}

export function SuccessView({ orderRef, type, amount }: Props) {
  const botLink = `${BOT_URL}?start=${orderRef}`

  return (
    <div className="w-full max-w-md mx-auto text-center animate-fade-up">
      {/* Success icon */}
      <div className="w-24 h-24 rounded-full bg-success/20 flex items-center justify-center text-5xl mx-auto mb-6 animate-pulse-glow">
        ✅
      </div>

      <h2 className="text-3xl font-black mb-2">تم إنشاء طلبك!</h2>
      <p className="dark:text-slate-400 text-slate-500 mb-6">
        طلب {type === 'buy' ? 'الشراء' : 'البيع'} — {amount} USDT
      </p>

      {/* Order ref */}
      <div className="glass rounded-2xl p-4 mb-6">
        <p className="text-xs dark:text-slate-500 text-slate-400 mb-1">رقم طلبك</p>
        <p className="text-2xl font-black tracking-widest gradient-text">{orderRef}</p>
        <p className="text-xs dark:text-slate-500 text-slate-400 mt-1">احفظ هذا الرقم — ستحتاجه للمتابعة</p>
      </div>

      {/* CTA */}
      <a
        href={botLink}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-3 w-full py-5 rounded-2xl font-black text-white text-lg gradient-btn mb-4"
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L8.32 14.617l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.828.942z"/>
        </svg>
        أكمل على تيليجرام الآن
      </a>

      {/* Steps */}
      <div className="glass rounded-2xl p-5 text-right space-y-3 mb-6">
        <p className="font-bold text-sm">الخطوات التالية:</p>
        {[
          'افتح بوت تيليجرام بالضغط أعلاه',
          type === 'buy'
            ? 'ادفع المبلغ عبر FIB/ZainCash/Qi Card'
            : 'أرسل USDT لعنوان محفظة الضمان',
          'ارفع إثبات الدفع للبوت',
          'انتظر تأكيد المشرف (5–15 دقيقة)',
        ].map((s, i) => (
          <div key={i} className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full gradient-btn text-white text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5">
              {i + 1}
            </span>
            <span className="text-sm dark:text-slate-400 text-slate-600">{s}</span>
          </div>
        ))}
      </div>

      <Link href="/" className="text-sm text-primary hover:underline">
        ← العودة للرئيسية
      </Link>
    </div>
  )
}

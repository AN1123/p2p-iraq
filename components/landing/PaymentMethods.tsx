const methods = [
  {
    name: 'FIB',
    fullName: 'First Iraqi Bank',
    emoji: '🏦',
    color: 'from-blue-500/20 to-blue-600/10',
    border: 'border-blue-500/30',
    desc: 'تحويل فوري عبر تطبيق FIB لجميع محافظ العراق',
    time: '1–3 دقائق',
  },
  {
    name: 'ZainCash',
    fullName: 'زين كاش',
    emoji: '📱',
    color: 'from-red-500/20 to-red-600/10',
    border: 'border-red-500/30',
    desc: 'محفظة إلكترونية واسعة الانتشار في كل العراق',
    time: '1–5 دقائق',
  },
  {
    name: 'Qi Card',
    fullName: 'بطاقة qi',
    emoji: '💳',
    color: 'from-violet-500/20 to-violet-600/10',
    border: 'border-violet-500/30',
    desc: 'بطاقة الدفع الإلكترونية المدعومة من الحكومة',
    time: '1–5 دقائق',
  },
]

export function PaymentMethods() {
  return (
    <section id="payments" className="py-24 px-4 dark:bg-[#0D0D18] bg-slate-100/50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-sm font-bold text-secondary dark:text-secondary-light bg-secondary/10 px-4 py-2 rounded-full">
            طرق الدفع
          </span>
          <h2 className="text-3xl sm:text-4xl font-black mt-4 mb-3">ادفع بالطريقة اللي تريحك</h2>
          <p className="dark:text-slate-400 text-slate-500 max-w-md mx-auto">
            ندعم أشهر طرق الدفع في العراق — فورية وآمنة
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {methods.map(m => (
            <div
              key={m.name}
              className={`relative rounded-3xl border ${m.border} bg-gradient-to-br ${m.color} p-6
                dark:bg-opacity-100 backdrop-blur-sm group hover:-translate-y-1 transition-transform duration-300`}
            >
              <div className="text-5xl mb-4">{m.emoji}</div>
              <div className="font-black text-2xl mb-1">{m.name}</div>
              <div className="text-sm dark:text-slate-400 text-slate-500 mb-3">{m.fullName}</div>
              <p className="text-sm leading-relaxed dark:text-slate-300 text-slate-700 mb-4">{m.desc}</p>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-success" />
                <span className="text-xs font-semibold text-success">وقت التنفيذ: {m.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

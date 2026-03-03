const features = [
  {
    icon: '🔐',
    title: 'Escrow آمن',
    desc: 'نحتجز USDT بأمان حتى يتأكد دفع الطرفين — لا أحد يخسر.',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    icon: '👁️',
    title: 'تحقق يدوي',
    desc: 'مشرفون معتمدون يراجعون كل صفقة قبل إطلاق الأموال.',
    color: 'text-secondary',
    bg: 'bg-secondary/10',
  },
  {
    icon: '📋',
    title: 'سجل شفاف',
    desc: 'رقم طلب لكل صفقة + سجل تدقيق كامل يمكنك الرجوع إليه.',
    color: 'text-success',
    bg: 'bg-success/10',
  },
  {
    icon: '⚖️',
    title: 'حل النزاعات',
    desc: 'نظام واضح لحل الخلافات مع SLA لا يتجاوز 4 ساعات.',
    color: 'text-warning',
    bg: 'bg-warning/10',
  },
]

export function TrustSection() {
  return (
    <section className="py-24 px-4 dark:bg-[#0D0D18] bg-slate-100/50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-sm font-bold text-primary dark:text-primary-light bg-primary/10 px-4 py-2 rounded-full">
            الأمان أولاً
          </span>
          <h2 className="text-3xl sm:text-4xl font-black mt-4 mb-3">لماذا تثق بنا؟</h2>
          <p className="dark:text-slate-400 text-slate-500 max-w-md mx-auto">
            بنينا المنصة على أساس الأمان والشفافية من اليوم الأول
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {features.map(f => (
            <div
              key={f.title}
              className="group glass rounded-3xl p-6 hover:-translate-y-1 transition-all duration-300 hover:shadow-lg dark:hover:shadow-black/30"
            >
              <div className={`w-14 h-14 ${f.bg} rounded-2xl flex items-center justify-center text-2xl mb-4`}>
                {f.icon}
              </div>
              <h3 className={`font-black text-xl mb-2 ${f.color}`}>{f.title}</h3>
              <p className="dark:text-slate-400 text-slate-600 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Trust bar */}
        <div className="mt-10 glass rounded-3xl p-6 flex flex-wrap justify-center gap-8 text-center">
          {[
            { val: '٠٪', label: 'نسبة الاحتيال' },
            { val: '<١٥د', label: 'متوسط التنفيذ' },
            { val: '٤س', label: 'SLA النزاعات' },
            { val: '١٠٠٪', label: 'شفافية الرسوم' },
          ].map(s => (
            <div key={s.label}>
              <div className="text-3xl font-black gradient-text">{s.val}</div>
              <div className="text-xs dark:text-slate-500 text-slate-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

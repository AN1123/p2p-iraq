const steps = [
  {
    num: '١',
    icon: '📝',
    title: 'أنشئ طلبك',
    desc: 'حدّد نوع العملية (شراء أو بيع)، المبلغ، طريقة الدفع، وعنوان المحفظة.',
  },
  {
    num: '٢',
    icon: '📱',
    title: 'انتقل لتيليجرام',
    desc: 'يتم تحويلك تلقائياً لبوت تيليجرامنا مع رقم طلبك جاهز.',
  },
  {
    num: '٣',
    icon: '💳',
    title: 'أكمل الدفع',
    desc: 'ادفع المبلغ عبر FIB أو ZainCash أو Qi Card وارفع إثبات الدفع.',
  },
  {
    num: '٤',
    icon: '✅',
    title: 'استلم USDT',
    desc: 'يتحقق المشرف ويُطلق USDT لمحفظتك خلال 5–15 دقيقة.',
  },
]

export function HowItWorks() {
  return (
    <section id="how" className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-sm font-bold text-primary dark:text-primary-light bg-primary/10 px-4 py-2 rounded-full">
            سهل وبسيط
          </span>
          <h2 className="text-3xl sm:text-4xl font-black mt-4 mb-3">كيف نشتغل؟</h2>
          <p className="dark:text-slate-400 text-slate-500 max-w-md mx-auto">
            أربع خطوات فقط وصفقتك تكتمل بأمان
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-10 right-[12%] left-[12%] h-0.5 bg-gradient-to-l from-secondary/30 via-primary/50 to-secondary/30" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-4">
            {steps.map((s, i) => (
              <div
                key={i}
                className="relative flex flex-col items-center text-center group"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {/* Step circle */}
                <div className="relative w-20 h-20 rounded-3xl gradient-btn flex items-center justify-center text-3xl mb-5 shadow-glow-primary group-hover:scale-105 transition-transform duration-300">
                  {s.icon}
                  <span className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-secondary text-white text-xs font-black flex items-center justify-center">
                    {s.num}
                  </span>
                </div>
                <h3 className="font-black text-lg mb-2">{s.title}</h3>
                <p className="text-sm dark:text-slate-400 text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

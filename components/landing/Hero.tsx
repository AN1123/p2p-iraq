import Link from 'next/link'

const BOT_URL = process.env.NEXT_PUBLIC_BOT_USERNAME
  ? `https://t.me/${process.env.NEXT_PUBLIC_BOT_USERNAME}`
  : 'https://t.me/'

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-24 pb-16 mesh-bg overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-semibold mb-6 animate-fade-up">
        <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
        <span className="dark:text-slate-300 text-slate-700">خدمة موثوقة — عمولة 1% فقط</span>
      </div>

      {/* Headline */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-center leading-tight mb-6 animate-fade-up delay-100 max-w-3xl">
        تبادل{' '}
        <span className="gradient-text">USDT</span>
        <br />
        بأمان وسرعة في العراق
      </h1>

      {/* Subtitle */}
      <p className="text-lg sm:text-xl dark:text-slate-400 text-slate-600 text-center max-w-xl mb-10 leading-relaxed animate-fade-up delay-200">
        شراء وبيع USDT عبر FIB · ZainCash · Qi Card
        <br />
        بإشراف مشرفين معتمدين وضمان كامل
      </p>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md animate-fade-up delay-300">
        <Link
          href="/request?type=buy"
          className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-white text-base transition-all duration-200
            bg-success hover:bg-green-500 hover:shadow-lg hover:shadow-success/30 hover:-translate-y-0.5"
        >
          <span className="text-lg">🟢</span>
          شراء USDT
        </Link>
        <Link
          href="/request?type=sell"
          className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-white text-base transition-all duration-200
            bg-danger hover:bg-red-500 hover:shadow-lg hover:shadow-danger/30 hover:-translate-y-0.5"
        >
          <span className="text-lg">🔴</span>
          بيع USDT
        </Link>
      </div>

      {/* Telegram CTA */}
      <div className="mt-4 animate-fade-up delay-400 w-full max-w-md">
        <a
          href={BOT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl font-bold text-white text-base gradient-btn animate-pulse-glow"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L8.32 14.617l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.828.942z"/>
          </svg>
          ابدأ المحادثة الآن
        </a>
      </div>

      {/* Stats strip */}
      <div className="mt-16 grid grid-cols-3 gap-4 w-full max-w-lg animate-fade-up delay-500">
        {[
          { value: '١٥ دقيقة', label: 'متوسط وقت التنفيذ' },
          { value: '١٪', label: 'عمولة ثابتة فقط' },
          { value: '٢٤/٧', label: 'دعم متواصل' },
        ].map(s => (
          <div key={s.label} className="text-center glass rounded-2xl py-4 px-2">
            <div className="text-2xl font-black gradient-text">{s.value}</div>
            <div className="text-xs dark:text-slate-400 text-slate-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

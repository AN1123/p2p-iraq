import Link from 'next/link'
import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'

export default function RiskPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10">
            <span className="text-sm font-bold text-warning bg-warning/10 px-4 py-2 rounded-full">⚠️ مهم</span>
            <h1 className="text-4xl font-black mt-4 mb-2">تحذيرات المخاطر</h1>
            <p className="dark:text-slate-400 text-slate-500">اقرأ هذا بعناية قبل البدء</p>
          </div>

          {/* Main warning box */}
          <div className="rounded-3xl border-2 border-warning/40 bg-warning/5 p-6 mb-8">
            <div className="text-4xl mb-3">⚠️</div>
            <p className="font-bold text-lg text-warning mb-2">تحذير عام</p>
            <p className="text-sm leading-relaxed dark:text-slate-300 text-slate-700">
              تداول العملات الرقمية ينطوي على مخاطر عالية جداً تشمل الخسارة الكاملة للمبلغ المستثمر.
              لا تستثمر أموالاً لا تستطيع تحمّل خسارتها. الأداء السابق لا يضمن النتائج المستقبلية.
            </p>
          </div>

          <div className="space-y-5 dark:text-slate-300 text-slate-700">
            {[
              {
                icon: '📉',
                title: 'تقلب الأسعار',
                body: 'يمكن لأسعار العملات الرقمية أن تتغير بنسبة 50-90% في فترة قصيرة. سعر USDT مرتبط بالدولار لكن يمكن أن يتفاوت في أسواق P2P المحلية.',
                color: 'border-danger/30',
              },
              {
                icon: '🔧',
                title: 'مخاطر تقنية',
                body: 'قد تحدث أعطال في الشبكات البلوكتشين، أو انقطاع في تيليجرام، أو أخطاء تقنية تؤخر الصفقات. لا نتحمل مسؤولية التأخيرات الناجمة عن هذه الأسباب.',
                color: 'border-warning/30',
              },
              {
                icon: '⚖️',
                title: 'مخاطر قانونية',
                body: 'وضع العملات الرقمية القانوني في العراق في طور التطور. قد تطرأ تغييرات تنظيمية تؤثر على قدرتك في الاستخدام. ابقَ مطلعاً على القوانين المحلية.',
                color: 'border-primary/30',
              },
              {
                icon: '🎭',
                title: 'مخاطر الاحتيال',
                body: 'لن يطلب منك أي مشرف مبالغ خارج المنصة أو عبر قنوات غير رسمية. تحقق دائماً من الحسابات الرسمية. لا تشارك كلمات مرور محافظك مع أحد.',
                color: 'border-danger/30',
              },
            ].map(r => (
              <div key={r.title} className={`glass rounded-2xl p-6 border ${r.color}`}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{r.icon}</span>
                  <h2 className="font-black text-lg">{r.title}</h2>
                </div>
                <p className="text-sm leading-relaxed">{r.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="dark:text-slate-400 text-slate-500 mb-4 text-sm">
              بالمتابعة واستخدام الخدمة، فأنت تقرّ بفهمك وقبولك لهذه المخاطر.
            </p>
            <Link
              href="/request"
              className="inline-flex items-center gap-2 gradient-btn text-white font-bold px-8 py-4 rounded-2xl"
            >
              فهمت — ابدأ الآن
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

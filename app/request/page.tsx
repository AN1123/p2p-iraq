import { Suspense } from 'react'
import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { RequestForm } from '@/components/request/RequestForm'

export default function RequestPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 px-4 mesh-bg">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-black mb-3">إنشاء طلب جديد</h1>
            <p className="dark:text-slate-400 text-slate-500">
              أكمل الخطوات أدناه وسيتم تحويلك لتيليجرام لإتمام الصفقة
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
            {/* Form */}
            <div className="w-full max-w-xl">
              <Suspense fallback={<div className="text-center py-20 dark:text-slate-400">جاري التحميل...</div>}>
                <RequestForm />
              </Suspense>
            </div>

            {/* Sidebar info */}
            <div className="w-full lg:w-72 space-y-4 lg:sticky lg:top-24">
              <div className="glass rounded-2xl p-5">
                <h3 className="font-black mb-3">⚡ سريع وآمن</h3>
                <ul className="space-y-2 text-sm dark:text-slate-400 text-slate-600">
                  <li>✅ عمولة 1% فقط — لا رسوم مخفية</li>
                  <li>✅ تنفيذ خلال 5–15 دقيقة</li>
                  <li>✅ Escrow يدوي — أموالك محمية</li>
                  <li>✅ مشرفون متاحون 24/7</li>
                </ul>
              </div>

              <div className="glass rounded-2xl p-5 border-warning/30 bg-warning/5">
                <h3 className="font-black text-warning mb-2">⚠️ تنبيه مهم</h3>
                <p className="text-xs dark:text-slate-400 text-slate-600 leading-relaxed">
                  العملات الرقمية عالية المخاطر. لا تستثمر مبالغ لا تستطيع تحمّل خسارتها.
                  هذه المنصة وسيط فقط وليست مستشاراً مالياً.
                </p>
              </div>

              <div className="glass rounded-2xl p-5">
                <h3 className="font-black mb-3">🌐 الشبكات</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-bold text-success">TRC20</span>
                    <span className="dark:text-slate-400 text-slate-500">~1$ · موصى به</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold">BEP20</span>
                    <span className="dark:text-slate-400 text-slate-500">~0.5$</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-warning">ERC20</span>
                    <span className="dark:text-slate-400 text-slate-500">~5-50$ ⚠️</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

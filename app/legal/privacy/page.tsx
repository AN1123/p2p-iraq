import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10">
            <span className="text-sm font-bold text-secondary bg-secondary/10 px-4 py-2 rounded-full">قانوني</span>
            <h1 className="text-4xl font-black mt-4 mb-2">سياسة الخصوصية</h1>
            <p className="dark:text-slate-400 text-slate-500">آخر تحديث: مارس ٢٠٢٦</p>
          </div>

          <div className="space-y-6 dark:text-slate-300 text-slate-700">
            {[
              {
                title: '١. البيانات التي نجمعها',
                body: 'نجمع معرّف تيليجرام، اسم المستخدم، المحافظة، تفاصيل الطلب (المبلغ، الشبكة، طريقة الدفع)، وسجل المحادثات مع البوت. لا نجمع كلمات المرور أو البيانات البنكية الكاملة.',
              },
              {
                title: '٢. كيف نستخدم البيانات',
                body: 'نستخدم البيانات حصراً لمعالجة طلباتك، التحقق من الصفقات، حل النزاعات، وتحسين الخدمة. لا نبيع بياناتك لأي طرف ثالث.',
              },
              {
                title: '٣. تخزين البيانات',
                body: 'تُخزَّن البيانات على خوادم آمنة مشفّرة. سجلات الصفقات تُحفظ لمدة ٣ سنوات كحد أدنى للامتثال القانوني.',
              },
              {
                title: '٤. مشاركة البيانات',
                body: 'لا نشارك بياناتك إلا عند: (أ) وجود أمر قضائي ملزم، (ب) طلب جهات الأمن العراقية وفق القانون، (ج) الضرورة لحل نزاع تكون طرفاً فيه.',
              },
              {
                title: '٥. حقوقك',
                body: 'يحق لك طلب الاطلاع على بياناتك، تصحيحها، أو حذفها (ما لم يكن الحفظ مطلوباً قانونياً). للتواصل: عبر بوت تيليجرام.',
              },
              {
                title: '٦. ملفات الارتباط (Cookies)',
                body: 'الموقع يستخدم localStorage فقط لتذكّر إعداد الثيم (فاتح/داكن). لا نستخدم cookies للتتبع أو الإعلانات.',
              },
            ].map(s => (
              <div key={s.title} className="glass rounded-2xl p-6">
                <h2 className="font-black text-xl mb-3 gradient-text">{s.title}</h2>
                <p className="text-sm leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

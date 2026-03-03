import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10">
            <span className="text-sm font-bold text-primary bg-primary/10 px-4 py-2 rounded-full">قانوني</span>
            <h1 className="text-4xl font-black mt-4 mb-2">شروط الاستخدام</h1>
            <p className="dark:text-slate-400 text-slate-500">آخر تحديث: مارس ٢٠٢٦</p>
          </div>

          <div className="prose max-w-none dark:prose-invert space-y-8 dark:text-slate-300 text-slate-700 leading-relaxed">
            <Section title="١. قبول الشروط">
              باستخدامك لمنصة وسيط أو خدمات البوت، فأنت توافق على هذه الشروط بالكامل. إذا كنت لا توافق، يُرجى عدم استخدام الخدمة.
            </Section>

            <Section title="٢. طبيعة الخدمة">
              وسيط هي منصة وساطة P2P فقط — نسهّل عمليات تبادل USDT بين المستخدمين عبر تيليجرام. لسنا صرافة مرخصة ولا بنكاً ولا مستشاراً مالياً.
            </Section>

            <Section title="٣. المستخدمون المؤهلون">
              يجب أن تكون مقيماً في العراق، تجاوزت ١٨ سنة، وتستخدم حساب تيليجرام حقيقياً باسمك. يُحظر على الأشخاص الخاضعين لعقوبات دولية استخدام الخدمة.
            </Section>

            <Section title="٤. آلية التداول">
              جميع الصفقات تتم عبر بوت تيليجرام بإشراف مشرفين معتمدين. نستخدم نظام Escrow يدوي لحماية الطرفين. العمولة ١٪ على كل صفقة.
            </Section>

            <Section title="٥. حدود المسؤولية">
              لا تتحمل المنصة مسؤولية الخسائر الناتجة عن تقلبات أسعار العملات الرقمية، أخطاء المستخدم في إرسال العناوين، أو انقطاع الاتصال. الحد الأقصى لمسؤوليتنا هو مبلغ العمولة المدفوعة.
            </Section>

            <Section title="٦. الإيقاف والحظر">
              نحتفظ بالحق في إيقاف أي حساب يُشتبه في استخدامه لأغراض احتيالية أو غسيل أموال أو أنشطة غير قانونية، دون إشعار مسبق.
            </Section>

            <Section title="٧. التعديلات">
              قد نعدّل هذه الشروط في أي وقت. استمرارك في استخدام الخدمة يعني موافقتك على الشروط الجديدة.
            </Section>

            <Section title="٨. القانون المطبّق">
              تخضع هذه الشروط للقوانين العراقية النافذة. أي نزاع يُحال للجهات القضائية المختصة في العراق.
            </Section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-2xl p-6">
      <h2 className="font-black text-xl mb-3 gradient-text">{title}</h2>
      <p className="text-sm leading-relaxed">{children}</p>
    </div>
  )
}

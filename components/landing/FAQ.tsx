'use client'
import { useState } from 'react'

const faqs = [
  {
    q: 'كم يستغرق تنفيذ الصفقة؟',
    a: 'بعد إثبات الدفع، يتحقق المشرف ويُطلق USDT خلال 5–15 دقيقة في معظم الأحيان. في حالات الضغط العالي قد يصل إلى 30 دقيقة.',
  },
  {
    q: 'هل أموالي آمنة؟',
    a: 'نعم. نستخدم نظام Escrow يدوي — USDT يُحتجز بمحفظة مخصصة حتى يتأكد الدفع من الطرفين. لا أحد يمكنه الاستيلاء على الأموال.',
  },
  {
    q: 'ما الشبكات المدعومة؟',
    a: 'ندعم TRC20 (الأرخص والأسرع — موصى به)، وBEP20، وERC20 (رسوم عالية — تجنّبه للمبالغ الصغيرة).',
  },
  {
    q: 'ماذا أفعل إذا دفعت ولم أستلم USDT؟',
    a: 'تواصل مع المشرف مباشرة عبر تيليجرام. لديك حق رفع نزاع والحصول على حل خلال 4 ساعات بالحد الأقصى.',
  },
  {
    q: 'هل العمولة 1% على الشراء والبيع معاً؟',
    a: 'نعم، 1% على كل صفقة بغض النظر عن نوعها. تُضاف على الشراء (تدفع أكثر) وتُخصم على البيع (تستلم أقل).',
  },
  {
    q: 'ما الحد الأدنى والأقصى للصفقة؟',
    a: 'الحد الأدنى 10$ والأقصى 5000$ لكل صفقة. للمبالغ الأكبر، تواصل مع المشرفين مباشرة.',
  },
]

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="faq" className="py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-sm font-bold text-secondary dark:text-secondary-light bg-secondary/10 px-4 py-2 rounded-full">
            الأسئلة الشائعة
          </span>
          <h2 className="text-3xl sm:text-4xl font-black mt-4">كل ما تريد معرفته</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((f, i) => (
            <div
              key={i}
              className="glass rounded-2xl overflow-hidden border dark:border-white/[0.06] border-slate-200 transition-all duration-200"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-right hover:dark:bg-white/[0.02] hover:bg-slate-50 transition-colors"
              >
                <span className="font-bold text-base">{f.q}</span>
                <span className={`text-primary transition-transform duration-300 flex-shrink-0 mr-4 ${open === i ? 'rotate-180' : ''}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                  </svg>
                </span>
              </button>
              <div className={`accordion-content ${open === i ? 'open' : ''}`}>
                <div className="px-6 pb-5 dark:text-slate-400 text-slate-600 leading-relaxed text-sm">
                  {f.a}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

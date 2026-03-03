import Link from 'next/link'

export function Footer() {
  return (
    <footer className="dark:bg-[#080810] bg-slate-900 text-slate-400 pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl gradient-btn flex items-center justify-center text-white font-black text-sm">W</div>
              <span className="font-black text-xl gradient-text">وسيط</span>
            </div>
            <p className="text-sm leading-relaxed max-w-sm">
              منصة وساطة موثوقة لتبادل USDT في العراق عبر FIB وZainCash وQi Card.
              التنفيذ عبر تيليجرام بإشراف مشرفين معتمدين.
            </p>
            {/* Trust badges */}
            <div className="flex flex-wrap gap-2 mt-4">
              {['تحقق يدوي ✓', 'Escrow آمن 🔒', 'دعم سريع ⚡'].map(b => (
                <span key={b} className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300">
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm">الخدمات</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/request" className="hover:text-primary transition-colors">إنشاء طلب</Link></li>
              <li><Link href="/#how" className="hover:text-primary transition-colors">كيف نشتغل</Link></li>
              <li><Link href="/#payments" className="hover:text-primary transition-colors">طرق الدفع</Link></li>
              <li><Link href="/#faq" className="hover:text-primary transition-colors">الأسئلة الشائعة</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm">قانوني</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/legal/terms" className="hover:text-primary transition-colors">شروط الاستخدام</Link></li>
              <li><Link href="/legal/privacy" className="hover:text-primary transition-colors">سياسة الخصوصية</Link></li>
              <li><Link href="/legal/risk" className="hover:text-primary transition-colors">تحذيرات المخاطر</Link></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/[0.06] pt-8 space-y-4">
          <p className="text-xs text-slate-500 leading-relaxed">
            ⚠️ <strong className="text-slate-400">تحذير المخاطر:</strong> العملات الرقمية عالية التقلب وتنطوي على مخاطر جوهرية. هذه المنصة وسيط فقط وليست مستشاراً مالياً. لا تستثمر أموالاً لا تستطيع تحمّل خسارتها. الأداء السابق لا يضمن النتائج المستقبلية.
          </p>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-slate-600">
            <p>© {new Date().getFullYear()} وسيط — جميع الحقوق محفوظة</p>
            <p>العراق 🇮🇶</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

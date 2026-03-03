const examples = [
  { usdt: 100,  buy: 1485, sell: 1465 },
  { usdt: 500,  buy: 1485, sell: 1465 },
  { usdt: 2000, buy: 1485, sell: 1465 },
]

export function CommissionSection() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-sm font-bold text-success bg-success/10 px-4 py-2 rounded-full">
            شفافية كاملة
          </span>
          <h2 className="text-3xl sm:text-4xl font-black mt-4 mb-3">عمولة ١٪ فقط — لا رسوم مخفية</h2>
          <p className="dark:text-slate-400 text-slate-500 max-w-md mx-auto">
            كل شيء واضح قبل إتمام الصفقة
          </p>
        </div>

        {/* Visual formula */}
        <div className="glass rounded-3xl p-8 mb-10 text-center">
          <div className="flex flex-wrap items-center justify-center gap-4 text-lg font-bold">
            <div className="dark:bg-white/5 bg-slate-100 rounded-2xl px-5 py-3">
              <div className="text-xs dark:text-slate-400 text-slate-500 mb-1 font-normal">المبلغ</div>
              <div className="gradient-text">X USDT</div>
            </div>
            <span className="text-2xl dark:text-slate-500 text-slate-400">×</span>
            <div className="dark:bg-white/5 bg-slate-100 rounded-2xl px-5 py-3">
              <div className="text-xs dark:text-slate-400 text-slate-500 mb-1 font-normal">سعر اليوم</div>
              <div className="gradient-text">١٤٨٥ IQD</div>
            </div>
            <span className="text-2xl dark:text-slate-500 text-slate-400">+</span>
            <div className="bg-warning/10 border border-warning/30 rounded-2xl px-5 py-3">
              <div className="text-xs text-warning/80 mb-1 font-normal">العمولة</div>
              <div className="text-warning font-black">١٪</div>
            </div>
            <span className="text-2xl dark:text-slate-500 text-slate-400">=</span>
            <div className="bg-success/10 border border-success/30 rounded-2xl px-5 py-3">
              <div className="text-xs text-success/80 mb-1 font-normal">الإجمالي</div>
              <div className="text-success font-black">المبلغ النهائي</div>
            </div>
          </div>
        </div>

        {/* Examples table */}
        <div className="rounded-3xl overflow-hidden border dark:border-white/[0.07] border-slate-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="dark:bg-white/5 bg-slate-50 text-right">
                <th className="px-6 py-4 font-bold dark:text-slate-400 text-slate-500">المبلغ</th>
                <th className="px-6 py-4 font-bold dark:text-slate-400 text-slate-500">تكلفة الشراء (مع عمولة)</th>
                <th className="px-6 py-4 font-bold dark:text-slate-400 text-slate-500">تستلم من البيع</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-white/[0.05] divide-slate-100">
              {examples.map(({ usdt, buy, sell }) => {
                const buyCost    = Math.round(usdt * buy * 1.01).toLocaleString('ar-IQ')
                const sellReturn = Math.round(usdt * sell * 0.99).toLocaleString('ar-IQ')
                return (
                  <tr key={usdt} className="dark:hover:bg-white/[0.02] hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-black text-lg gradient-text">{usdt} USDT</td>
                    <td className="px-6 py-4 font-semibold dark:text-slate-200 text-slate-800">{buyCost} IQD</td>
                    <td className="px-6 py-4 font-semibold text-success">{sellReturn} IQD</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <div className="px-6 py-3 dark:bg-white/[0.02] bg-slate-50 text-xs dark:text-slate-500 text-slate-400">
            * الأسعار تقريبية · السعر الفعلي يُحسب لحظة إنشاء الطلب · رسوم الشبكة غير مشمولة
          </div>
        </div>
      </div>
    </section>
  )
}

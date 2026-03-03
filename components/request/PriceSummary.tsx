interface Props {
  isBuy: boolean
  amountNum: number
  rate: number
  calc: { baseIqd: number; commission: number; total?: number; receive?: number }
}

export function PriceSummary({ isBuy, amountNum, rate, calc }: Props) {
  if (!amountNum) return null
  const final = isBuy ? calc.total ?? 0 : calc.receive ?? 0

  return (
    <div className="rounded-2xl dark:bg-white/[0.03] bg-slate-50 border dark:border-white/[0.07] border-slate-200 p-5 space-y-3">
      <h3 className="font-bold text-sm dark:text-slate-400 text-slate-500">ملخص الطلب</h3>
      <div className="space-y-2 text-sm">
        <Row label="سعر اليوم" value={`${rate.toLocaleString('ar-IQ')} IQD/USDT`} />
        <Row label="المبلغ الأساسي" value={`${calc.baseIqd.toLocaleString('ar-IQ')} IQD`} />
        <Row label="العمولة (١٪)" value={`${calc.commission.toLocaleString('ar-IQ')} IQD`} />
        <div className="border-t dark:border-white/[0.07] border-slate-200 pt-2 flex justify-between font-black">
          <span>{isBuy ? 'إجمالي ما تدفع' : 'إجمالي ما تستلم'}</span>
          <span className={isBuy ? 'text-danger' : 'text-success'}>
            {final.toLocaleString('ar-IQ')} IQD
          </span>
        </div>
      </div>
      <p className="text-xs dark:text-slate-600 text-slate-400">
        * رسوم شبكة USDT غير مشمولة · السعر يُثبَّت لحظة التنفيذ
      </p>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between dark:text-slate-400 text-slate-600">
      <span>{label}</span>
      <span className="font-semibold dark:text-slate-200 text-slate-800">{value}</span>
    </div>
  )
}

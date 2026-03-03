const NETWORKS = [
  { name: 'TRC20', fee: '~1$', time: '1-3 دقائق', recommended: true, warning: null },
  { name: 'BEP20', fee: '~0.5$', time: '1-3 دقائق', recommended: false, warning: 'BNB مطلوب للغاز' },
  { name: 'ERC20', fee: '~5-50$', time: '5-15 دقيقة', recommended: false, warning: 'رسوم مرتفعة جداً — تجنب للمبالغ أقل من 500$' },
]

export function NetworkWarnings() {
  return (
    <div className="space-y-3">
      <h2 className="font-bold text-lg">🌐 مقارنة الشبكات</h2>
      <div className="grid md:grid-cols-3 gap-3">
        {NETWORKS.map((n) => (
          <div
            key={n.name}
            className={`rounded-xl border p-4 ${n.recommended ? 'border-cyan-500/40 bg-cyan-500/5' : 'border-zinc-800 bg-zinc-900'}`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold">{n.name}</span>
              {n.recommended && <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full">موصى به</span>}
            </div>
            <div className="text-sm text-zinc-400 space-y-1">
              <div>💸 رسوم: {n.fee}</div>
              <div>⏱ الوقت: {n.time}</div>
              {n.warning && <div className="text-amber-400">⚠️ {n.warning}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

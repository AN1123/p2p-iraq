import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'USDT Iraq — تبادل USDT موثوق في العراق',
  description: 'منصة P2P لبيع وشراء USDT في العراق. طرق الدفع: FIB، ZainCash، Qi Card.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-zinc-950 text-white antialiased">{children}</body>
    </html>
  )
}

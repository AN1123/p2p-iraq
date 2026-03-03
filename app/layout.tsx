import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/shared/ThemeProvider'

export const metadata: Metadata = {
  title: 'وسيط — تبادل USDT في العراق',
  description: 'منصة وساطة موثوقة لشراء وبيع USDT في العراق عبر FIB وZainCash وQi Card. عمولة 1% فقط.',
  keywords: 'USDT العراق, شراء USDT, بيع USDT, FIB, ZainCash, P2P',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-cairo antialiased">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

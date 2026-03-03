'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ThemeToggle } from './ThemeToggle'

const BOT_URL = process.env.NEXT_PUBLIC_BOT_USERNAME
  ? `https://t.me/${process.env.NEXT_PUBLIC_BOT_USERNAME}`
  : 'https://t.me/'

const links = [
  { label: 'كيف نشتغل', href: '#how' },
  { label: 'طرق الدفع', href: '#payments' },
  { label: 'الأسئلة الشائعة', href: '#faq' },
  { label: 'الشروط', href: '/legal/terms' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'dark:bg-[#0A0A0F]/90 bg-white/90 backdrop-blur-xl shadow-lg dark:shadow-black/40'
        : 'bg-transparent'
    }`}>
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl gradient-btn flex items-center justify-center text-white font-black text-sm">
            W
          </div>
          <span className="font-black text-xl gradient-text">وسيط</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium dark:text-slate-300 text-slate-600 hover:text-primary dark:hover:text-primary-light transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <a
            href={BOT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-2 gradient-btn text-white text-sm font-bold px-4 py-2 rounded-xl"
          >
            <TelegramIcon className="w-4 h-4" />
            تيليجرام
          </a>
          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl dark:bg-white/10 bg-slate-100"
            aria-label="القائمة"
          >
            <span className={`block w-5 transition-all ${open ? 'rotate-45 translate-y-1' : ''}`}>
              <span className={`block h-0.5 bg-current mb-1 transition-all ${open ? 'opacity-0' : ''}`}/>
              <span className="block h-0.5 bg-current mb-1"/>
              <span className={`block h-0.5 bg-current transition-all ${open ? '-rotate-90 -translate-y-2' : ''}`}/>
            </span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden dark:bg-[#12121A] bg-white border-t dark:border-white/[0.07] border-slate-200 px-4 py-4 space-y-3 animate-fade-in">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block text-sm font-medium py-2 dark:text-slate-300 text-slate-600"
            >
              {l.label}
            </Link>
          ))}
          <a
            href={BOT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 gradient-btn text-white font-bold py-3 rounded-xl mt-2"
          >
            <TelegramIcon className="w-5 h-5" />
            ابدأ على تيليجرام
          </a>
        </div>
      )}
    </header>
  )
}

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L8.32 14.617l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.828.942z"/>
    </svg>
  )
}

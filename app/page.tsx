import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { Hero } from '@/components/landing/Hero'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { PaymentMethods } from '@/components/landing/PaymentMethods'
import { CommissionSection } from '@/components/landing/CommissionSection'
import { TrustSection } from '@/components/landing/TrustSection'
import { FAQ } from '@/components/landing/FAQ'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <PaymentMethods />
        <CommissionSection />
        <TrustSection />
        <FAQ />
      </main>
      <Footer />
    </>
  )
}

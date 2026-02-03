import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Services from '@/components/Services'
import StatsSection from '@/components/StatsSection'
import TechStack from '@/components/TechStack'
import Testimonials from '@/components/Testimonials'
import CTASection from '@/components/CTASection'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import ScrollProgress from '@/components/ScrollProgress'
import BackToTop from '@/components/BackToTop'

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Header />
      <main>
        <Hero />
        <StatsSection />
        <Services />
        <TechStack />
        <Testimonials />
        <CTASection
          title="Ready to Build the Future?"
          description="Join industry leaders who trust Qodestak for their blockchain infrastructure and Web3 development needs."
          primaryButton={{
            text: "Start Your Project",
            href: "#contact"
          }}
          secondaryButton={{
            text: "View Our Work",
            href: "/portfolio"
          }}
        />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </>
  )
}

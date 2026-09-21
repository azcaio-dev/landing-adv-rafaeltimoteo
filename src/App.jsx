import { MotionConfig } from 'framer-motion'
import Header from './components/Header'
import Hero from './components/Hero'
import PracticeAreas from './components/PracticeAreas'
import Institutional from './components/Institutional'
import ExperienceScene from './components/ExperienceScene'
import About from './components/About'
import Process from './components/Process'
import TrustSection from './components/TrustSection'
import CTA from './components/CTA'
import Footer from './components/Footer'

export default function App() {
  return (
    // reducedMotion="user": respeita prefers-reduced-motion (desliga animações de movimento)
    <MotionConfig reducedMotion="user">
      <a href="#conteudo" className="skip-link">
        Ir para o conteúdo
      </a>
      <Header />
      <main id="conteudo">
        <Hero />
        <PracticeAreas />
        <Institutional />
        <ExperienceScene />
        <About />
        <Process />
        <TrustSection />
        <CTA />
      </main>
      <Footer />
    </MotionConfig>
  )
}

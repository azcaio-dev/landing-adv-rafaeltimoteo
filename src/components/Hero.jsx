import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Hero3D from './Hero3D'
import Button from './ui/Button'
import { SITE, WHATSAPP_URL } from '../config/site'
import { EASE } from './ui/Reveal'

const container = { hidden: {}, show: { transition: { staggerChildren: 0.16, delayChildren: 0.25 } } }
const fade = { hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0, transition: { duration: 1.3, ease: EASE } } }
const lineIn = { hidden: { y: '108%' }, show: { y: '0%', transition: { duration: 1.6, ease: EASE } } }

export default function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const copyY = useTransform(scrollYProgress, [0, 1], ['0%', '-7%'])
  const artY = useTransform(scrollYProgress, [0, 1], ['0%', '9%'])

  return (
    <section id="inicio" ref={ref} aria-labelledby="hero-title" className="hero">
      <div className="hero-glow" aria-hidden="true" />

      <div className="container-x">
        <div className="grid items-center gap-8 lg:grid-cols-[1.12fr_0.88fr] lg:gap-16">
          <motion.div
            style={{ y: copyY }}
            className="text-center lg:text-left"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <motion.p variants={fade} className="eyebrow">
              {SITE.tagline}
            </motion.p>

            <h1 id="hero-title" className="hero-name">
              <span className="sr-only">Dr. </span>
              <span className="hero-name__line">
                <motion.span variants={lineIn} className="block">
                  Rafael
                </motion.span>
              </span>
              <span className="hero-name__line hero-name__line--indent">
                <motion.span variants={lineIn} className="block">
                  Timoteo
                </motion.span>
              </span>
            </h1>

            <motion.p variants={fade} className="lead mx-auto mt-8 lg:mx-0" style={{ maxWidth: '34rem' }}>
              Atuação jurídica estratégica, personalizada e comprometida com cada caso.
            </motion.p>

            <motion.div
              variants={fade}
              className="mt-10 flex flex-col items-stretch gap-4 sm:flex-row sm:justify-center lg:justify-start"
            >
              <Button href={WHATSAPP_URL} external>
                Falar com o advogado
              </Button>
              <Button href="#atuacao" variant="ghost">
                Conhecer a atuação
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            style={{ y: artY }}
            className="hero-art"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.8, delay: 0.3, ease: EASE }}
          >
            <Hero3D variant="hero" />
          </motion.div>
        </div>
      </div>

      <a href="#atuacao" className="scroll-cue" aria-label="Rolar para a seção Atuação">
        <span aria-hidden="true">Role</span>
        <i aria-hidden="true" />
      </a>
    </section>
  )
}

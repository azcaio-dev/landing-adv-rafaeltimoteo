import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import SectionIndex from './ui/SectionIndex'
import { Reveal, Stagger, StaggerItem } from './ui/Reveal'

const STEPS = [
  { n: '01', title: 'Primeiro contato', text: 'O cliente apresenta sua situação e suas principais dúvidas.' },
  { n: '02', title: 'Análise', text: 'As informações relevantes são analisadas para compreender o contexto apresentado.' },
  { n: '03', title: 'Orientação', text: 'São apresentadas as possibilidades jurídicas aplicáveis ao caso.' },
  { n: '04', title: 'Acompanhamento', text: 'O atendimento segue de acordo com as necessidades e estratégias definidas.' },
]

function Step({ step, index, progress }) {
  const start = index / STEPS.length
  const lit = useTransform(progress, [start - 0.06, start + 0.04], [0.3, 1])
  return (
    <StaggerItem as="li" className="relative list-none pl-10 lg:pl-0 lg:pt-12">
      <motion.span
        aria-hidden="true"
        style={{ opacity: lit }}
        className="absolute left-0 top-[0.35rem] lg:top-0"
      >
        <span className="timeline-dot" />
      </motion.span>
      <span className="font-display text-[2.4rem] leading-none gold-text">{step.n}</span>
      <h3 className="mt-4 font-display text-[1.45rem] font-medium uppercase tracking-[0.09em] text-ivory">
        {step.title}
      </h3>
      <p className="mt-3 max-w-[32ch] text-[0.96rem] leading-[1.75] text-ash">{step.text}</p>
    </StaggerItem>
  )
}

export default function Process() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 78%', 'end 55%'] })

  return (
    <section id="processo" aria-labelledby="processo-title" className="relative">
      <div className="hairline" aria-hidden="true" />
      <div className="container-x section-pad">
        <Reveal>
          <SectionIndex number="03" label="Como funciona" />
          <h2 id="processo-title" className="h2 mt-6 max-w-[20ch]">
            Do primeiro contato à orientação jurídica.
          </h2>
        </Reveal>

        <div ref={ref} className="relative mt-16 lg:mt-24">
          {/* linha vertical (mobile/tablet) */}
          <div aria-hidden="true" className="absolute bottom-0 left-[6px] top-2 w-px bg-gold/20 lg:hidden">
            <motion.div style={{ scaleY: scrollYProgress, transformOrigin: 'top' }} className="h-full w-full bg-gold" />
          </div>
          {/* linha horizontal (desktop) */}
          <div aria-hidden="true" className="absolute left-0 right-0 top-[6px] hidden h-px bg-gold/20 lg:block">
            <motion.div style={{ scaleX: scrollYProgress, transformOrigin: 'left' }} className="h-full w-full bg-gold" />
          </div>

          <Stagger as="ol" className="m-0 grid gap-12 p-0 lg:grid-cols-4 lg:gap-10">
            {STEPS.map((s, i) => (
              <Step key={s.n} step={s} index={i} progress={scrollYProgress} />
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  )
}

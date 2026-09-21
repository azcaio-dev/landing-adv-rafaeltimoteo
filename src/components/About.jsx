import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { IMAGES, PROFILE, PLACEHOLDER, SITE } from '../config/site'
import SectionIndex from './ui/SectionIndex'
import { Reveal } from './ui/Reveal'

function Meta({ label, value }) {
  return (
    <div className="border-t border-gold/20 py-4">
      <dt className="text-[0.66rem] uppercase tracking-[0.26em] text-gold-light">{label}</dt>
      <dd className={`mt-1.5 text-[0.98rem] ${value ? 'text-ivory' : 'placeholder-text'}`}>
        {value || PLACEHOLDER}
      </dd>
    </div>
  )
}

export default function About() {
  const wrap = useRef(null)
  const { scrollYProgress } = useScroll({ target: wrap, offset: ['start end', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], ['-3.5%', '3.5%'])

  return (
    <section id="sobre" aria-labelledby="sobre-title" className="section-clip section-pad relative">
      <div className="container-x">
        <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <Reveal className="mx-auto w-full max-w-[560px] lg:max-w-none">
            <div className="portrait-frame" ref={wrap}>
              <div className="portrait-glow" aria-hidden="true" />
              <div className="portrait">
                <motion.div style={{ y: imgY }} className="absolute inset-[-5%]">
                  <img
                    src={IMAGES.profissional}
                    width={1125}
                    height={1398}
                    alt="Dr. Rafael Timoteo, advogado, trabalhando em seu escritório"
                    loading="lazy"
                    decoding="async"
                    style={{ objectPosition: '35% 30%' }}
                  />
                </motion.div>
                <div className="portrait__shade" aria-hidden="true" />
              </div>
            </div>
          </Reveal>

          <div>
            <Reveal>
              <SectionIndex number="02" label="Sobre o advogado" />
              <h2 id="sobre-title" className="h2 mt-6">
                Experiência, estratégia e atendimento personalizado.
              </h2>
            </Reveal>

            <Reveal delay={0.12} className="mt-9">
              <p className="font-display text-[1.9rem] leading-tight text-ivory">{SITE.name}</p>
              <p className="lead mt-4">
                Rafael Timoteo atua na advocacia com foco em atendimento personalizado, buscando
                compreender cada situação de forma individual e oferecer orientação jurídica adequada
                às necessidades apresentadas.
              </p>
            </Reveal>

            <Reveal delay={0.2} as="dl" className="mt-10 grid gap-x-8 sm:grid-cols-2">
              <Meta label="Atuação" value="Advogado" />
              <Meta label="OAB/UF" value={PROFILE.oab} />
              <Meta label="Especializações" value={PROFILE.especializacoes} />
              <Meta label="Formação" value={PROFILE.formacao} />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

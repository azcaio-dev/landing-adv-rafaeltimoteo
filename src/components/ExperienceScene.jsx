import { lazy, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Scale } from 'lucide-react'
import SceneShell from './three/SceneShell'

const ExperienceCanvas = lazy(() => import('./three/ExperienceCanvas'))

/**
 * Seção cinematográfica: a câmera 3D se move conforme o scroll NATIVO
 * (sem scroll hijacking — só lemos o progresso). Objetos surgem, a luz esquenta.
 */
export default function ExperienceScene() {
  const track = useRef(null)
  const { scrollYProgress } = useScroll({ target: track, offset: ['start 0.7', 'end end'] })

  const titleOpacity = useTransform(scrollYProgress, [0.08, 0.3], [0, 1])
  const titleY = useTransform(scrollYProgress, [0.08, 0.3], [34, 0])
  const textOpacity = useTransform(scrollYProgress, [0.28, 0.5], [0, 1])
  const textY = useTransform(scrollYProgress, [0.28, 0.5], [24, 0])
  const lineScale = useTransform(scrollYProgress, [0.05, 0.6], [0, 1])

  return (
    <section ref={track} aria-labelledby="estrategia-title" className="scene-track">
      <div className="scene-stage">
        <SceneShell
          rootMargin="0px"
          fallback={
            <div className="grid h-full w-full place-items-center lg:translate-x-[22%]" aria-hidden="true">
              <Scale size={230} strokeWidth={0.5} className="text-gold/60" />
            </div>
          }
        >
          {(props) => <ExperienceCanvas progress={scrollYProgress} {...props} />}
        </SceneShell>

        <div className="scene-stage__vignette" aria-hidden="true" />

        <div className="container-x pointer-events-none absolute inset-0 flex items-end pb-14 md:pb-20 lg:items-center lg:pb-0">
          <div className="max-w-[34rem]">
            <motion.div
              aria-hidden="true"
              style={{ scaleX: lineScale, transformOrigin: 'left' }}
              className="mb-8 h-px w-24 bg-gold"
            />
            <motion.h2
              id="estrategia-title"
              style={{ opacity: titleOpacity, y: titleY }}
              className="font-display text-[clamp(2.1rem,5.4vw,4.1rem)] font-normal uppercase leading-[1.04] tracking-[0.02em] text-ivory"
            >
              Cada caso exige uma estratégia.
            </motion.h2>
            <motion.p style={{ opacity: textOpacity, y: textY }} className="lead mt-6">
              Análise, orientação e acompanhamento jurídico com atenção aos detalhes de cada situação.
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  )
}

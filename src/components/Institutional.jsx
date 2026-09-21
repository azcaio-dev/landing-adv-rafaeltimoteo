import { IMAGES, PROFILE, PLACEHOLDER, SITE, WHATSAPP_URL } from '../config/site'
import { Reveal } from './ui/Reveal'
import Button from './ui/Button'

/** Faixa de autoridade com o retrato de terno (rafael-terno.png). */
export default function Institutional() {
  return (
    <section aria-labelledby="institucional-title" className="section-clip relative pb-20 lg:pb-32">
      <div className="hairline" aria-hidden="true" />
      <div className="container-x pt-20 lg:pt-28">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-6 lg:pr-10">
            <Reveal>
              <h2 id="institucional-title" className="h2">
                Compromisso com cada caso, do primeiro contato ao acompanhamento.
              </h2>
              <p className="lead mt-7">
                Atendimento personalizado, com atenção ao contexto e às necessidades apresentadas por
                cada pessoa.
              </p>
            </Reveal>

            <Reveal delay={0.15} className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-6">
              <div>
                <p className="font-display text-[1.7rem] leading-tight text-ivory">{SITE.name}</p>
                <p className="mt-1 text-[0.72rem] uppercase tracking-[0.26em] text-gold-light">
                  Advogado{' '}
                  <span className={PROFILE.oab ? '' : 'placeholder-text normal-case tracking-normal'}>
                    · {PROFILE.oab || `OAB/UF ${PLACEHOLDER}`}
                  </span>
                </p>
              </div>
              <Button href={WHATSAPP_URL} external variant="ghost" size="sm">
                Falar com o advogado
              </Button>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="relative mx-auto w-full max-w-[520px] lg:col-span-6 lg:max-w-none">
            <div
              className="pointer-events-none absolute -inset-[10%] -z-10"
              aria-hidden="true"
              style={{ background: 'radial-gradient(50% 50% at 55% 45%, rgba(184,148,90,.14), transparent 70%)' }}
            />
            <div className="portrait-fade lg:ml-auto lg:max-w-[560px]">
              <img
                src={IMAGES.terno}
                width={1123}
                height={1401}
                alt="Dr. Rafael Timoteo, advogado, em retrato de terno no escritório"
                loading="lazy"
                decoding="async"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

import Logo from './Logo'
import Button from './ui/Button'
import SectionIndex from './ui/SectionIndex'
import { Reveal } from './ui/Reveal'
import { WHATSAPP_URL } from '../config/site'

export default function CTA() {
  return (
    <section id="contato" aria-labelledby="contato-title" className="section-clip relative">
      <div className="hairline" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{ background: 'radial-gradient(50% 60% at 50% 55%, rgba(184,148,90,.12), transparent 70%)' }}
      />
      <div className="container-x section-pad relative">
        <div className="mx-auto flex max-w-[44rem] flex-col items-center text-center">
          <Reveal>
            <Logo variant="cta" />
          </Reveal>

          <Reveal delay={0.1} className="mt-14 flex flex-col items-center">
            <SectionIndex number="04" label="Contato" className="justify-center" />
            <h2 id="contato-title" className="h2 mt-6">
              Precisa de orientação jurídica?
            </h2>
            <p className="lead mx-auto mt-6">
              Entre em contato para conversar sobre sua situação e entender os próximos passos.
            </p>
          </Reveal>

          <Reveal delay={0.2} className="mt-10 flex w-full flex-col items-stretch gap-5 sm:items-center">
            <Button href={WHATSAPP_URL} external className="sm:w-auto">
              Falar pelo WhatsApp
            </Button>
            <p className="m-0 text-[0.78rem] uppercase tracking-[0.24em] text-ash">
              Atendimento mediante agendamento.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
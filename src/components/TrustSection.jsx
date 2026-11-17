import WordReveal from './ui/WordReveal'
import { Reveal } from './ui/Reveal'

export default function TrustSection() {
  return (
    <section aria-label="Princípios de atuação" className="section-clip relative py-[clamp(4.5rem,13vw,12rem)]">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{ background: 'radial-gradient(50% 60% at 50% 50%, rgba(17,17,17,1), rgba(8,8,8,0) 75%)' }}
      />
      <div className="container-x relative text-center">
        <Reveal aria-hidden="true" className="mx-auto mb-10 flex items-center justify-center gap-4">
          <span className="rule-fade rule-fade--in" />
          <span className="block h-[7px] w-[7px] rotate-45 border border-gold-light" />
          <span className="rule-fade rule-fade--out" />
        </Reveal>
        <WordReveal
          lines={['PRECISÃO NA ANÁLISE.', 'ESTRATÉGIA NA ATUAÇÃO.']}
          className="font-display text-[clamp(2.3rem,7.2vw,6rem)] font-light uppercase leading-[1.08] tracking-[0.02em] text-ivory"
        />
      </div>
    </section>
  )
}

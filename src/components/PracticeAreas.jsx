import { Briefcase, FileText, Gavel, Landmark, Scale } from 'lucide-react'
import PracticeCard from './PracticeCard'
import SectionIndex from './ui/SectionIndex'
import { Reveal, Stagger } from './ui/Reveal'

const AREAS = [
  {
    number: '01',
    title: 'Direito Criminal',
    text: 'Orientação jurídica em situações que envolvem a esfera criminal, com análise atenta ao contexto apresentado.',
    Icon: Gavel,
    span: 'lg:col-span-2',
  },
  {
    number: '02',
    title: 'Direito Penal',
    text: 'Análise de questões penais, considerando as particularidades de cada situação.',
    Icon: Scale,
    span: 'lg:col-span-2',
  },
  {
    number: '03',
    title: 'Processo Penal',
    text: 'Orientação e acompanhamento sobre as etapas e o andamento do processo penal.',
    Icon: FileText,
    span: 'lg:col-span-2',
  },
  {
    number: '04',
    title: 'Direito Trabalhista',
    text: 'Orientação jurídica em questões relacionadas às relações de trabalho.',
    Icon: Briefcase,
    span: 'lg:col-span-3',
  },
  {
    number: '05',
    title: 'Direito Civil',
    text: 'Orientação jurídica em questões do âmbito civil, com atenção às necessidades de cada situação.',
    Icon: Landmark,
    span: 'md:col-span-2 lg:col-span-3',
  },
]

export default function PracticeAreas() {
  return (
    <section id="atuacao" aria-labelledby="atuacao-title" className="section-pad relative">
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
          <Reveal>
            <SectionIndex number="01" label="Atuação jurídica" />
            <h2 id="atuacao-title" className="h2 mt-6">
              Estratégia jurídica para situações que exigem precisão.
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="lead">
              O atendimento é personalizado: cada situação demanda análise individual, e a orientação
              parte do que o caso realmente exige.
            </p>
          </Reveal>
        </div>

        <Stagger as="ul" className="mt-14 grid gap-4 p-0 md:grid-cols-2 lg:mt-20 lg:grid-cols-6 lg:gap-5">
          {AREAS.map(({ span, ...area }) => (
            <PracticeCard key={area.number} className={span} {...area} />
          ))}
        </Stagger>
      </div>
    </section>
  )
}

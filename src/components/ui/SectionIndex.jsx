/** Marcador editorial de seção: "01 — ATUAÇÃO" */
export default function SectionIndex({ number, label, className = '' }) {
  return (
    <p className={`section-index ${className}`}>
      <b>{number}</b>
      <i aria-hidden="true" />
      <span>{label}</span>
    </p>
  )
}

import { StaggerItem } from './ui/Reveal'

export default function PracticeCard({ number, title, text, Icon, className = '' }) {
  return (
    <StaggerItem as="li" className={`list-none ${className}`}>
      <article className="card">
        <div className="flex items-start justify-between">
          <span className="card__num gold-text" aria-hidden="true">
            {number}
          </span>
          <Icon size={30} strokeWidth={1.1} className="text-gold-light" aria-hidden="true" />
        </div>
        <h3 className="card__title">{title}</h3>
        <p className="card__text">{text}</p>
      </article>
    </StaggerItem>
  )
}

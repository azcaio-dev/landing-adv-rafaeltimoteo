import { IMAGES, SITE } from '../config/site'

/**
 * Logo oficial (logo.png) inteira e sem filtros. Uma faixa clara fica só atrás do
 * subtítulo (que na logo é quase preto e sumiria no fundo escuro do site) — ver .logo-plate.
 * variant: 'header' | 'header-sm' | 'footer' | 'cta'
 */
export default function Logo({ variant = 'header', href, priority = false, className = '' }) {
  const plate = (
    <span className={`logo-plate logo-plate--${variant} ${className}`}>
      <img
        className="logo-plate__img"
        src={IMAGES.logo}
        width={658}
        height={379}
        alt={`${SITE.name} — ${SITE.tagline}`}
        decoding="async"
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        draggable="false"
      />
    </span>
  )
  return href ? (
    <a href={href} className="logo-link">
      {plate}
    </a>
  ) : (
    plate
  )
}
import { ArrowUpRight } from 'lucide-react'

/** Botão/link. `external` abre em nova aba e mostra a seta. */
export default function Button({
  href,
  variant = 'primary',
  size,
  external = false,
  className = '',
  children,
  ...rest
}) {
  const cls = ['btn', variant === 'primary' ? 'btn-primary' : 'btn-ghost', size === 'sm' ? 'btn-sm' : '', className]
    .filter(Boolean)
    .join(' ')
  const extra = external ? { target: '_blank', rel: 'noopener noreferrer' } : {}
  return (
    <a href={href} className={cls} {...extra} {...rest}>
      <span>{children}</span>
      {external && <ArrowUpRight size={16} strokeWidth={1.75} aria-hidden="true" />}
      {external && <span className="sr-only"> (abre em nova aba)</span>}
    </a>
  )
}

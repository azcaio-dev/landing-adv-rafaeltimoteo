import { MessageCircle } from 'lucide-react'
import Logo from './Logo'
import { INSTAGRAM_URL, NAV_LINKS, PROFILE, PLACEHOLDER, SITE, WHATSAPP_URL } from '../config/site'

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  )
}

export default function Footer() {
  return (
    <footer className="relative border-t border-gold/20 bg-ink pb-10 pt-16 lg:pt-20">
      <div className="container-x">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.3fr_0.7fr_1fr] lg:gap-16">
          <div>
            <Logo variant="footer" href="#inicio" />
          </div>

          <nav aria-label="Rodapé">
            <p className="mb-5 text-[0.66rem] uppercase tracking-[0.3em] text-gold-light">Navegação</p>
            <ul className="m-0 flex list-none flex-col gap-3 p-0">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="footer-link">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="mb-5 text-[0.66rem] uppercase tracking-[0.3em] text-gold-light">Contato</p>
            <ul className="m-0 flex list-none flex-col gap-3 p-0">
              <li>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="footer-link inline-flex items-center gap-3">
                  <MessageCircle size={18} strokeWidth={1.5} aria-hidden="true" />
                  WhatsApp
                  <span className="sr-only"> (abre em nova aba)</span>
                </a>
              </li>
              <li>
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="footer-link inline-flex items-center gap-3">
                  <InstagramIcon />@{SITE.instagramHandle}
                  <span className="sr-only"> (abre em nova aba)</span>
                </a>
              </li>
              <li className="mt-2 text-[0.92rem] text-ash">
                <span className="text-[0.66rem] uppercase tracking-[0.26em] text-gold-light">OAB/UF </span>
                <span className={PROFILE.oab ? '' : 'placeholder-text'}>{PROFILE.oab || PLACEHOLDER}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="hairline mt-14" aria-hidden="true" />
        <div className="mt-7 flex flex-col gap-3 text-[0.78rem] leading-relaxed text-ash/80 md:flex-row md:items-start md:justify-between">
          <p className="m-0">
            © {SITE.year} {SITE.name}. Todos os direitos reservados.
          </p>
          <p className="m-0 max-w-[58ch] md:text-right">
            As informações deste site têm caráter meramente informativo e não constituem aconselhamento jurídico.
          </p>
        </div>
      </div>
    </footer>
  )
}
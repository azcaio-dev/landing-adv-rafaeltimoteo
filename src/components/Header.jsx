import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import Logo from './Logo'
import Button from './ui/Button'
import { NAV_LINKS, WHATSAPP_URL } from '../config/site'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // Ao ampliar a janela para desktop, fecha o menu mobile
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const onChange = (e) => e.matches && setOpen(false)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return (
    <header className="site-header" data-scrolled={scrolled || open}>
      <div className="container-x site-header__inner">
        <Logo variant={scrolled ? 'header-sm' : 'header'} href="#inicio" priority />

        <nav aria-label="Principal" className="hidden items-center gap-10 lg:flex">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="nav-link">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden lg:block">
            <Button href={WHATSAPP_URL} external size="sm">
              Falar com o advogado
            </Button>
          </div>
          <div className="lg:hidden">
            <button
              type="button"
              className="menu-btn"
              aria-expanded={open}
              aria-controls="menu-mobile"
              aria-label={open ? 'Fechar menu' : 'Abrir menu'}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-mobile"
            className="menu-panel"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <nav aria-label="Menu mobile">
              {NAV_LINKS.map((l) => (
                <a key={l.href} href={l.href} className="menu-link" onClick={() => setOpen(false)}>
                  {l.label}
                </a>
              ))}
            </nav>
            <Button href={WHATSAPP_URL} external className="mt-7 w-full" onClick={() => setOpen(false)}>
              Falar com o advogado
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

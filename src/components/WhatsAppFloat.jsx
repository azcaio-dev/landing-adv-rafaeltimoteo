import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import { WHATSAPP_URL } from '../config/site'

/**
 * Atalho fixo para o WhatsApp no celular/tablet.
 * Aparece depois da primeira tela e some quando a seção de contato (que já tem o botão) está visível.
 */
export default function WhatsAppFloat() {
  const [pastHero, setPastHero] = useState(false)
  const [atContact, setAtContact] = useState(false)

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.7)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const el = document.getElementById('contato')
    if (!el || !('IntersectionObserver' in window)) return undefined
    const io = new IntersectionObserver(([e]) => setAtContact(e.isIntersecting), { threshold: 0.25 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const visible = pastHero && !atContact

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="wa-float"
          aria-label="Falar pelo WhatsApp (abre em nova aba)"
          initial={{ opacity: 0, y: 16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.9 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <MessageCircle size={24} strokeWidth={1.6} aria-hidden="true" />
        </motion.a>
      )}
    </AnimatePresence>
  )
}

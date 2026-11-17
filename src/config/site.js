// ─────────────────────────────────────────────────────────────────────────────
// Conteúdo editável do site. Tudo o que é dado do advogado fica aqui.
// Campos vazios ('') aparecem na página como "[preencher]" — nada é inventado.
// ─────────────────────────────────────────────────────────────────────────────

export const SITE = {
  name: 'Dr. Rafael Timoteo',
  shortName: 'Rafael Timoteo',
  tagline: 'Consultoria e Assessoria Jurídica',
  year: 2026,

  whatsappNumber: '5581996610981',
  whatsappMessage: 'Olá, Dr. Rafael. Gostaria de falar sobre uma orientação jurídica.',
  instagramHandle: 'rafaeltimoteo_adv',
}

/** Dados profissionais ainda não informados. Preencha aqui quando tiver. */
export const PROFILE = {
  oab: '', // ex.: 'OAB/PE 00.000'
  especializacoes: '', // ex.: 'Direito Penal e Processo Penal'
  formacao: '', // ex.: 'Bacharel em Direito — Instituição'
}

export const PLACEHOLDER = '[preencher]'

/**
 * Campo de PROFILE vazio: no site publicado ele NÃO aparece (nada de "[preencher]" na tela do cliente).
 * No `npm run dev` continua visível, para você lembrar do que falta preencher.
 */
export const SHOW_PLACEHOLDERS = Boolean(import.meta.env?.DEV)
export const shouldShow = (value) => Boolean(value) || SHOW_PLACEHOLDERS

export const WHATSAPP_URL = `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(
  SITE.whatsappMessage,
)}`
export const INSTAGRAM_URL = `https://www.instagram.com/${SITE.instagramHandle}/`

export const NAV_LINKS = [
  { label: 'Início', href: '#inicio' },
  { label: 'Atuação', href: '#atuacao' },
  { label: 'Sobre', href: '#sobre' },
  { label: 'Contato', href: '#contato' },
]

export const IMAGES = {
  logo: '/images/logo.png',
  // WebP (~80–110 KB cada). Os PNGs originais continuam em /public/images como backup.
  profissional: '/images/rafael-profissional.webp',
  terno: '/images/rafael-terno.webp',
}

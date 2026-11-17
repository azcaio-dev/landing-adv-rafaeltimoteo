import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { PROFILE } from './src/config/site.js'

// ⚠️ TROQUE pelo domínio final antes de publicar (sem barra no fim).
// Usado nas tags og:url / og:image / twitter:image do index.html.
const PRODUCTION_URL = 'https://SEU-DOMINIO.com.br'

export default defineConfig(({ command }) => {
  // npm run dev → localhost; npm run build → domínio final
  const siteUrl = command === 'serve' ? 'http://localhost:5173' : PRODUCTION_URL

  // Checagem antes de publicar: avisa no terminal o que ainda falta (não impede o build).
  if (command === 'build') {
    const pendencias = []
    if (PRODUCTION_URL.includes('SEU-DOMINIO')) pendencias.push('PRODUCTION_URL (vite.config.js) ainda é o domínio de exemplo')
    if (!PROFILE.oab) pendencias.push('PROFILE.oab (src/config/site.js) está vazio — número da OAB não aparecerá no site')
    if (!PROFILE.especializacoes) pendencias.push('PROFILE.especializacoes vazio — o campo fica oculto')
    if (!PROFILE.formacao) pendencias.push('PROFILE.formacao vazio — o campo fica oculto')
    if (pendencias.length) {
      console.warn('\n⚠️  Antes de publicar:\n' + pendencias.map((p) => `   • ${p}`).join('\n') + '\n')
    }
  }

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'site-url',
        transformIndexHtml: (html) => html.replaceAll('__SITE_URL__', siteUrl),
      },
    ],
    build: {
      // O código 3D é carregado com React.lazy, então já vira chunk separado.
      chunkSizeWarningLimit: 1400,
    },
  }
})
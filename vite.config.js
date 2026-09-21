import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// ⚠️ TROQUE pelo domínio final antes de publicar (sem barra no fim).
// Usado nas tags og:url / og:image / twitter:image do index.html.
const PRODUCTION_URL = 'https://SEU-DOMINIO.com.br'

export default defineConfig(({ command }) => {
  // npm run dev → localhost; npm run build → domínio final
  const siteUrl = command === 'serve' ? 'http://localhost:5173' : PRODUCTION_URL

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
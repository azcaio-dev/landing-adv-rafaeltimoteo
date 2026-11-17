# Dr. Rafael Timoteo — Landing page

React + Vite + Tailwind CSS v4 + Three.js (React Three Fiber / drei) + Framer Motion + Lucide.

## Rodar

Requer **Node 20.19+** (ou 22.12+).

```bash
npm install
npm run dev        # desenvolvimento → http://localhost:5173
npm run build      # gera ./dist
npm run preview    # serve o build local para conferir
```

## Deploy na Vercel

Importe o repositório na Vercel. O preset **Vite** é detectado sozinho
(build: `npm run build`, saída: `dist`). Não precisa de configuração extra.

Depois de definir o domínio, troque `SEU-DOMINIO.com.br` em `index.html`
(`og:url` e `og:image` precisam ser URLs absolutas para a prévia no WhatsApp/Instagram).

## Onde editar

| O quê | Onde |
|---|---|
| WhatsApp, mensagem, Instagram, nome, ano | `src/config/site.js` → `SITE` |
| **OAB/UF, especializações, formação** (hoje aparecem como `[preencher]`) | `src/config/site.js` → `PROFILE` |
| Textos das áreas de atuação | `src/components/PracticeAreas.jsx` |
| Etapas do "Como funciona" | `src/components/Process.jsx` |
| Cores / tipografia / botões / cartões | `src/styles.css` e `src/index.css` (`@theme`) |
| Desenho do brasão (3D **e** fallback) | `src/lib/emblem.js` |

Campo de `PROFILE` vazio fica oculto no site publicado; ao preencher, ele aparece sozinho.

## Estrutura

```
src/
  config/site.js            conteúdo editável
  lib/emblem.js             geometria do brasão (dados puros)
  lib/emblemThree.js        converte a geometria em malhas 3D
  hooks/                    useQuality (perfis de 3D), useWebGL
  components/
    Header, Hero, Hero3D, PracticeAreas, PracticeCard, Institutional,
    ExperienceScene, About, Process, TrustSection, CTA, Footer, Logo
    ui/                     Reveal/Stagger, Button, SectionIndex, WordReveal
    three/                  SceneShell, EmblemCanvas, ExperienceCanvas, EmblemFallback
public/images/              logo.png · rafael-profissional.png · rafael-terno.png (originais, intactos)
```

## Sobre o 3D e a performance

- Todo o código 3D é carregado com `React.lazy` (chunk separado) e só monta perto da viewport;
  pausa o render fora dela.
- Três perfis (`src/hooks/useQuality.js`): celular, tablet e desktop — mudam DPR, partículas,
  nº de folhas e resolução do ambiente.
- Sem WebGL, ou se o contexto falhar/for perdido, permanece o brasão SVG estático (mesma geometria).
- `prefers-reduced-motion`: sem rotação, sem partículas em movimento, sem movimento de câmera.
- Sem modelos externos e sem HDR baixado da internet: iluminação por *Lightformers* procedurais.

## Imagens

As duas fotos são servidas em **WebP** (`rafael-profissional.webp` ~80 KB e `rafael-terno.webp` ~110 KB,
antes ~2 MB cada em PNG). Os PNGs originais continuam em `public/images/` só como backup — pode
apagá-los do repositório se quiser. A logo segue em PNG (tem transparência) e é usada sem alterações.

`public/og-image.png` (prévia do WhatsApp/Instagram, 1200×630) e `public/favicon.svg` são gerados a partir
da própria logo/brasão. Ao trocar a imagem de prévia, aumente o `?v=2` em `index.html`.

## Antes de publicar

`npm run build` avisa no terminal o que ainda falta. Em resumo:

1. Trocar `PRODUCTION_URL` em `vite.config.js` pelo domínio final.
2. Preencher `PROFILE` em `src/config/site.js` (OAB, especializações, formação).
   Campo vazio **não aparece** no site publicado (no `npm run dev` aparece como `[preencher]`).

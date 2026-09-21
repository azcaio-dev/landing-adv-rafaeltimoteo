import { lazy } from 'react'
import SceneShell from './three/SceneShell'
import EmblemFallback from './three/EmblemFallback'

// three + R3F + drei ficam em chunk separado, carregado só depois da primeira pintura
const EmblemCanvas = lazy(() => import('./three/EmblemCanvas'))

/** Brasão 3D dourado (hero e CTA). Com fallback SVG estático. */
export default function Hero3D({ variant = 'hero', className = '' }) {
  return (
    <SceneShell className={className} fallback={<EmblemFallback />}>
      {(props) => <EmblemCanvas variant={variant} {...props} />}
    </SceneShell>
  )
}

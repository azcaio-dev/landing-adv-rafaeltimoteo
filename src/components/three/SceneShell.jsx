import { Component, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { useWebGL } from '../../hooks/useWebGL'

/** Se qualquer coisa do 3D lançar erro, só avisa o pai: o fallback já está na tela. */
class SceneBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(error) {
    console.warn('[3D] Falha na cena, mantendo versão estática:', error?.message || error)
    this.props.onError?.()
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}

/**
 * Casca das cenas 3D.
 *  - O `fallback` (versão estática) fica SEMPRE renderizado por baixo → nunca há tela vazia.
 *  - O Canvas só é montado quando a área chega perto da viewport e pausa fora dela.
 *  - Sem WebGL, ou se o contexto falhar/for perdido, permanece só o fallback.
 *  - Quando o 3D fica pronto, há um cross-fade suave fallback → canvas.
 *
 * `children` é uma função: ({ active, onReady, onFail }) => <Canvas .../>
 */
export default function SceneShell({ fallback, children, className = '', rootMargin = '240px' }) {
  const ref = useRef(null)
  const webgl = useWebGL()
  const [mounted, setMounted] = useState(false)
  const [active, setActive] = useState(false)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || !webgl) return undefined
    if (!('IntersectionObserver' in window)) {
      setMounted(true)
      setActive(true)
      return undefined
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setMounted(true)
        setActive(entry.isIntersecting)
      },
      { rootMargin },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [webgl, rootMargin])

  const onReady = useCallback(() => setReady(true), [])
  const onFail = useCallback(() => {
    setFailed(true)
    setReady(false)
  }, [])

  const show3D = webgl && !failed && mounted

  return (
    <div ref={ref} className={`scene-shell ${className}`} data-ready={ready}>
      <div className="scene-shell__fallback" aria-hidden="true">
        {fallback}
      </div>
      {show3D && (
        <div className="scene-shell__canvas" aria-hidden="true">
          <SceneBoundary onError={onFail}>
            <Suspense fallback={null}>{children({ active, onReady, onFail })}</Suspense>
          </SceneBoundary>
        </div>
      )}
    </div>
  )
}

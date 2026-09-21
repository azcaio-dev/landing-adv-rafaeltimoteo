import { useEffect, useState } from 'react'

/**
 * Perfis de qualidade do 3D.
 *  low  → celular          (<768px)
 *  mid  → tablet / máquinas modestas
 *  high → desktop
 */
export const QUALITY = {
  low: { dpr: 1.25, particles: 14, leaves: 7, curve: 14, antialias: false, envRes: 128 },
  mid: { dpr: 1.5, particles: 30, leaves: 9, curve: 20, antialias: true, envRes: 192 },
  high: { dpr: 2, particles: 56, leaves: 12, curve: 28, antialias: true, envRes: 256 },
}

export function getTier() {
  if (typeof window === 'undefined') return 'high'
  const w = window.innerWidth
  if (w < 768) return 'low'
  if (w < 1024) return 'mid'
  const modest =
    (navigator.deviceMemory && navigator.deviceMemory <= 4) ||
    (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4)
  return modest ? 'mid' : 'high'
}

export function useQuality() {
  const [tier, setTier] = useState(getTier)

  useEffect(() => {
    let raf = 0
    const onResize = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const next = getTier()
        setTier((cur) => (cur === next ? cur : next))
      })
    }
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return { tier, ...QUALITY[tier] }
}

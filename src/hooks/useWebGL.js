import { useState } from 'react'

/** Testa se o navegador consegue criar um contexto WebGL. */
export function detectWebGL() {
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
    if (!gl) return false
    gl.getExtension('WEBGL_lose_context')?.loseContext()
    return true
  } catch {
    return false
  }
}

export function useWebGL() {
  const [supported] = useState(() => (typeof document === 'undefined' ? false : detectWebGL()))
  return supported
}

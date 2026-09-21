import { useId, useMemo } from 'react'
import {
  SHIELD, shieldCmds, MONOGRAM, LEAF, STAR, starCmds, laurelNodes, cmdsToSvg,
} from '../../lib/emblem'

/**
 * Versão estática do brasão (SVG) — usada como fallback sem WebGL, enquanto o 3D
 * carrega e como base do cross-fade. Usa exatamente a mesma geometria do 3D.
 */
export default function EmblemFallback({ className = '' }) {
  const uid = useId().replace(/:/g, '')
  const d = useMemo(() => {
    const rim = cmdsToSvg(shieldCmds(SHIELD.rim)) + cmdsToSvg(shieldCmds(SHIELD.panel))
    return {
      rim,
      panel: cmdsToSvg(shieldCmds(SHIELD.panel)),
      frame: cmdsToSvg(shieldCmds(SHIELD.frame)) + cmdsToSvg(shieldCmds(SHIELD.frameHole)),
      letters: MONOGRAM.map(
        (s) => cmdsToSvg(s.outer) + s.holes.map((h) => cmdsToSvg(h)).join(''),
      ),
      leaves: laurelNodes(12).map((n) => cmdsToSvg(LEAF, n.x, n.y, n.scale, n.angle)),
      star: cmdsToSvg(starCmds(STAR.cx, STAR.cy, STAR.R, STAR.r)),
    }
  }, [])

  const gold = `url(#g-${uid})`
  const light = `url(#l-${uid})`

  return (
    <svg
      className={`emblem-fallback ${className}`}
      viewBox="-1.75 -1.3 3.5 3.3"
      role="img"
      aria-label="Brasão com as iniciais RT"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id={`g-${uid}`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#80633A" />
          <stop offset="0.5" stopColor="#B8945A" />
          <stop offset="1" stopColor="#D8BC83" />
        </linearGradient>
        <linearGradient id={`l-${uid}`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#B8945A" />
          <stop offset="1" stopColor="#E9D3A2" />
        </linearGradient>
        <radialGradient id={`p-${uid}`} cx="0.5" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#5a4426" />
          <stop offset="1" stopColor="#33260f" />
        </radialGradient>
      </defs>
      <g className="emblem-fallback__float">
        <g transform="scale(1 -1)">
          <g fill={gold} fillRule="evenodd">
            <path d={d.rim} />
            {d.leaves.map((p, i) => (
              <path key={i} d={p} />
            ))}
          </g>
          <path d={d.panel} fill={`url(#p-${uid})`} />
          <g fill={light} fillRule="evenodd">
            <path d={d.frame} />
            {d.letters.map((p, i) => (
              <path key={i} d={p} />
            ))}
            <path d={d.star} />
          </g>
        </g>
      </g>
    </svg>
  )
}

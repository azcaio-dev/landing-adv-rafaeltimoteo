// ─────────────────────────────────────────────────────────────────────────────
// Geometria do brasão (inspirado na logo do Dr. Rafael Timoteo).
//
// Tudo aqui é DADO PURO (comandos de path) — sem dependência de Three.js.
// O mesmo desenho alimenta o 3D (lib/emblemThree.js) e o fallback SVG
// (components/three/EmblemFallback.jsx), então os dois ficam sempre idênticos.
//
// Comandos: ['M',x,y] ['L',x,y] ['Q',cx,cy,x,y] ['C',c1x,c1y,c2x,c2y,x,y] ['Z']
// Sistema de coordenadas: y para cima, unidade ≈ altura do brasão / 2.5
// ─────────────────────────────────────────────────────────────────────────────

/** Escudo heráldico parametrizado (topo levemente côncavo, lados retos, ponta suave). */
export function shieldCmds({ hw, top, bottom }) {
  const H = top - bottom
  const yS = top - 0.42 * H
  return [
    ['M', -hw, top],
    ['Q', 0, top - 0.08, hw, top],
    ['L', hw, yS],
    ['C', hw, yS - 0.24 * H, hw * 0.46, bottom + 0.13 * H, 0, bottom],
    ['C', -hw * 0.46, bottom + 0.13 * H, -hw, yS - 0.24 * H, -hw, yS],
    ['L', -hw, top],
    ['Z'],
  ]
}

export const SHIELD = {
  rim: { hw: 0.96, top: 1.08, bottom: -1.44 },
  panel: { hw: 0.8, top: 0.93, bottom: -1.24 },
  panelBleed: { hw: 0.815, top: 0.945, bottom: -1.255 }, // levemente maior: fica sob a borda
  frame: { hw: 0.69, top: 0.82, bottom: -1.11 },
  frameHole: { hw: 0.655, top: 0.785, bottom: -1.075 },
}

// ── Monograma "RT" (serifa de laje, construído com formas simples) ───────────
const xf = (cmds, s, dx, dy) =>
  cmds.map(([op, ...n]) => [op, ...n.map((v, i) => (i % 2 === 0 ? v * s + dx : v * s + dy))])

const poly = (pts) => [
  ['M', ...pts[0]],
  ...pts.slice(1).map((p) => ['L', ...p]),
  ['Z'],
]

const T_SHAPES = [
  {
    outer: poly([
      [-0.31, 0.8], [0.31, 0.8], [0.31, 0.62], [0.25, 0.62], [0.25, 0.7],
      [0.065, 0.7], [0.065, 0.1], [0.16, 0.1], [0.16, 0], [-0.16, 0],
      [-0.16, 0.1], [-0.065, 0.1], [-0.065, 0.7], [-0.25, 0.7], [-0.25, 0.62],
      [-0.31, 0.62],
    ]),
    holes: [],
  },
]

const R_SHAPES = [
  // haste com serifas
  {
    outer: poly([
      [-0.3, 0.8], [-0.06, 0.8], [-0.06, 0.1], [0.02, 0.1], [0.02, 0], [-0.3, 0],
      [-0.3, 0.1], [-0.19, 0.1], [-0.19, 0.72], [-0.3, 0.72],
    ]),
    holes: [],
  },
  // bojo (com contra-forma)
  {
    outer: [
      ['M', -0.1, 0.8],
      ['L', 0.08, 0.8],
      ['C', 0.28, 0.8, 0.36, 0.68, 0.36, 0.58],
      ['C', 0.36, 0.46, 0.28, 0.36, 0.08, 0.36],
      ['L', -0.1, 0.36],
      ['Z'],
    ],
    holes: [
      [
        ['M', -0.06, 0.71],
        ['L', 0.06, 0.71],
        ['C', 0.19, 0.71, 0.25, 0.65, 0.25, 0.58],
        ['C', 0.25, 0.51, 0.19, 0.45, 0.06, 0.45],
        ['L', -0.06, 0.45],
        ['Z'],
      ],
    ],
  },
  // perna
  {
    outer: poly([
      [0.02, 0.42], [0.17, 0.42], [0.4, 0.08], [0.5, 0.08], [0.5, 0], [0.22, 0],
      [0.22, 0.08], [0.28, 0.08],
    ]),
    holes: [],
  },
]

const MONO_SCALE = 0.78
const MONO_Y = 0.0
const place = (shapes, dx) =>
  shapes.map((s) => ({
    outer: xf(s.outer, MONO_SCALE, dx, MONO_Y),
    holes: s.holes.map((h) => xf(h, MONO_SCALE, dx, MONO_Y)),
  }))

// Ornamento sob o monograma: fio dourado com losango central.
const ORNAMENT = [
  { outer: poly([[-0.4, -0.155], [-0.075, -0.155], [-0.075, -0.135], [-0.4, -0.135]]), holes: [] },
  { outer: poly([[0.075, -0.155], [0.4, -0.155], [0.4, -0.135], [0.075, -0.135]]), holes: [] },
  { outer: poly([[0, -0.2], [0.05, -0.145], [0, -0.09], [-0.05, -0.145]]), holes: [] },
]

/**
 * Formas do monograma já posicionadas (R à esquerda, T à direita) + ornamento.
 * Cada item é uma forma independente (outer + holes): renderize uma <path> por item
 * (as peças do R se sobrepõem de propósito, então NÃO junte tudo num só path evenodd).
 */
export const MONOGRAM = [...place(R_SHAPES, -0.33), ...place(T_SHAPES, 0.37), ...ORNAMENT]

// ── Louros ───────────────────────────────────────────────────────────────────
/** Folha em forma de amêndoa, apontando para +x. */
export const LEAF = [
  ['M', 0, 0],
  ['C', 0.09, 0.115, 0.23, 0.115, 0.33, 0],
  ['C', 0.23, -0.115, 0.09, -0.115, 0, 0],
  ['Z'],
]

/** Posição/rotação de cada folha das duas ramas (direita + espelho à esquerda). */
export function laurelNodes(count) {
  const cx = 0, cy = -0.1, rx = 1.36, ry = 1.5
  const a0 = -1.12, a1 = 0.46
  const right = []
  for (let i = 0; i < count; i++) {
    const t = count === 1 ? 0 : i / (count - 1)
    const a = a0 + (a1 - a0) * t
    const px = cx + rx * Math.cos(a)
    const py = cy + ry * Math.sin(a)
    const tx = -rx * Math.sin(a)
    const ty = ry * Math.cos(a)
    const len = Math.hypot(tx, ty)
    const nx = -ty / len
    const ny = tx / len
    const ang = Math.atan2(ty, tx)
    const scale = 1.0 - 0.32 * t
    for (const side of [1, -1]) {
      right.push({
        x: px + nx * 0.03 * side,
        y: py + ny * 0.03 * side,
        angle: ang + 0.68 * side,
        scale,
        roll: 0.45 * side,
      })
    }
  }
  const left = right.map((n) => ({ ...n, x: -n.x, angle: Math.PI - n.angle, roll: -n.roll }))
  return [...right, ...left]
}

/** Estrela de 5 pontas. */
export function starCmds(cx, cy, R, r) {
  const pts = []
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 === 0 ? R : r
    const a = Math.PI / 2 + (i * Math.PI) / 5
    pts.push([cx + rad * Math.cos(a), cy + rad * Math.sin(a)])
  }
  return poly(pts)
}

export const STAR = { cx: 0, cy: -1.7, R: 0.11, r: 0.045 }

/** Converte comandos em string de path SVG (sem inverter o eixo Y). */
export function cmdsToSvg(cmds, tx = 0, ty = 0, s = 1, rot = 0) {
  const c = Math.cos(rot)
  const sn = Math.sin(rot)
  const P = (x, y) => {
    const X = (x * c - y * sn) * s + tx
    const Y = (x * sn + y * c) * s + ty
    return `${+X.toFixed(4)} ${+Y.toFixed(4)}`
  }
  return cmds
    .map(([op, ...n]) => {
      if (op === 'Z') return 'Z'
      const pairs = []
      for (let i = 0; i < n.length; i += 2) pairs.push(P(n[i], n[i + 1]))
      return `${op}${pairs.join(' ')}`
    })
    .join('')
}

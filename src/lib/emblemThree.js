import * as THREE from 'three'
import { SHIELD, shieldCmds, MONOGRAM, LEAF, STAR, starCmds } from './emblem'

/** Converte comandos de path (lib/emblem.js) em THREE.Shape / THREE.Path. */
function toPath(cmds, PathClass) {
  const p = new PathClass()
  for (const [op, ...n] of cmds) {
    if (op === 'M') p.moveTo(n[0], n[1])
    else if (op === 'L') p.lineTo(n[0], n[1])
    else if (op === 'Q') p.quadraticCurveTo(n[0], n[1], n[2], n[3])
    else if (op === 'C') p.bezierCurveTo(n[0], n[1], n[2], n[3], n[4], n[5])
    // 'Z': o ExtrudeGeometry fecha o contorno sozinho
  }
  return p
}

function toShape(outer, holes = []) {
  const shape = toPath(outer, THREE.Shape)
  holes.forEach((h) => shape.holes.push(toPath(h, THREE.Path)))
  return shape
}

function extrude(shape, { depth, bevel = 0, curve = 24, z0 = 0, bevelSegments = 3 }) {
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    steps: 1,
    curveSegments: curve,
    bevelEnabled: bevel > 0,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelOffset: 0,
    bevelSegments,
  })
  geometry.translate(0, 0, z0)
  return geometry
}

/**
 * Monta todas as geometrias do brasão. Camadas (z crescente = para a câmera):
 *  rim    → moldura grossa do escudo (com vão interno)
 *  panel  → painel escuro rebaixado dentro da moldura
 *  frame  → fio fino dourado sobre o painel
 *  letters→ monograma RT + ornamento (uma geometria por forma)
 *  leaf   → folha de louro (instanciada)
 *  star   → estrela abaixo do escudo
 */
export function buildEmblemGeometry({ curve = 24 } = {}) {
  const rim = extrude(toShape(shieldCmds(SHIELD.rim), [shieldCmds(SHIELD.panel)]), {
    depth: 0.18, bevel: 0.03, curve, z0: -0.09,
  })
  const panel = extrude(toShape(shieldCmds(SHIELD.panelBleed)), {
    depth: 0.11, curve, z0: -0.09,
  })
  const frame = extrude(
    toShape(shieldCmds(SHIELD.frame), [shieldCmds(SHIELD.frameHole)]),
    { depth: 0.03, bevel: 0.005, curve, z0: 0.02, bevelSegments: 2 },
  )
  const letters = MONOGRAM.map((s) =>
    extrude(toShape(s.outer, s.holes), { depth: 0.08, bevel: 0.006, curve, z0: 0.02, bevelSegments: 2 }),
  )
  const leaf = extrude(toShape(LEAF), { depth: 0.03, bevel: 0.008, curve: 10, z0: -0.015, bevelSegments: 2 })
  const star = extrude(toShape(starCmds(STAR.cx, STAR.cy, STAR.R, STAR.r)), {
    depth: 0.04, bevel: 0.006, curve: 4, z0: -0.02, bevelSegments: 2,
  })
  return { rim, panel, frame, letters, leaf, star }
}

export function disposeEmblemGeometry(g) {
  if (!g) return
  ;[g.rim, g.panel, g.frame, g.leaf, g.star, ...g.letters].forEach((x) => x.dispose())
}

/** Materiais dourados compartilhados (paleta da marca). */
export function buildGoldMaterials() {
  return {
    gold: new THREE.MeshPhysicalMaterial({
      color: '#B8945A', metalness: 1, roughness: 0.3, clearcoat: 0.25, clearcoatRoughness: 0.4,
    }),
    light: new THREE.MeshPhysicalMaterial({ color: '#D8BC83', metalness: 1, roughness: 0.22 }),
    bronze: new THREE.MeshPhysicalMaterial({ color: '#4a3820', metalness: 0.85, roughness: 0.55 }),
    goldDouble: new THREE.MeshPhysicalMaterial({
      color: '#B8945A', metalness: 1, roughness: 0.3, side: THREE.DoubleSide,
    }),
    dark: new THREE.MeshStandardMaterial({ color: '#15130f', metalness: 0.6, roughness: 0.45 }),
  }
}

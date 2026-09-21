import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Lightformer, Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import { useReducedMotion } from 'framer-motion'
import { useQuality } from '../../hooks/useQuality'
import { laurelNodes } from '../../lib/emblem'
import { buildEmblemGeometry, buildGoldMaterials, disposeEmblemGeometry } from '../../lib/emblemThree'

const { damp } = THREE.MathUtils

/** Posição do mouse normalizada (-1..1) na janela — só onde há mouse de verdade. */
function usePointerRef(enabled) {
  const ref = useRef({ x: 0, y: 0 })
  useEffect(() => {
    if (!enabled) return undefined
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined
    const onMove = (e) => {
      ref.current.x = (e.clientX / window.innerWidth) * 2 - 1
      ref.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [enabled])
  return ref
}

function Emblem({ q, reduced, variant }) {
  const group = useRef(null)
  const sweep = useRef(null)
  const leafRef = useRef(null)
  const clock = useRef(0)
  const isHero = variant === 'hero'
  const pointer = usePointerRef(!reduced && isHero && q.tier !== 'low')

  const geo = useMemo(() => buildEmblemGeometry({ curve: q.curve }), [q.curve])
  const nodes = useMemo(() => laurelNodes(q.leaves), [q.leaves])
  const mats = useMemo(() => buildGoldMaterials(), [])

  useEffect(
    () => () => {
      disposeEmblemGeometry(geo)
    },
    [geo],
  )
  useEffect(
    () => () => {
      Object.values(mats).forEach((m) => m.dispose())
    },
    [mats],
  )

  // Posiciona cada folha de louro (InstancedMesh: 1 draw call para todas)
  useLayoutEffect(() => {
    const mesh = leafRef.current
    if (!mesh) return
    const d = new THREE.Object3D()
    d.rotation.order = 'ZYX' // gira a folha no plano e depois "rola" no próprio eixo
    nodes.forEach((n, i) => {
      d.position.set(n.x, n.y, 0)
      d.rotation.set(n.roll, 0, n.angle)
      d.scale.setScalar(n.scale)
      d.updateMatrix()
      mesh.setMatrixAt(i, d.matrix)
    })
    mesh.instanceMatrix.needsUpdate = true
  }, [nodes])

  useFrame((_, delta) => {
    const g = group.current
    if (!g) return
    clock.current += Math.min(delta, 0.1)
    const t = clock.current
    const slow = isHero ? 1 : 0.7

    // Rotação muito lenta: oscila ±25° (a frente com o monograma nunca some) + resposta suave ao mouse
    const targetY = reduced ? -0.18 : Math.sin(t * 0.16 * slow) * 0.44 + pointer.current.x * 0.26
    const targetX = reduced ? 0 : Math.sin(t * 0.11 * slow + 1) * 0.05 - pointer.current.y * 0.14
    g.rotation.y = damp(g.rotation.y, targetY, 2.2, delta)
    g.rotation.x = damp(g.rotation.x, targetX, 2.2, delta)
    g.position.y = 0.34 + (reduced ? 0 : Math.sin(t * 0.5) * 0.05)

    // Feixe de luz que atravessa o objeto
    if (sweep.current) sweep.current.position.x = reduced ? 1.2 : Math.sin(t * 0.42) * 2.7
  })

  return (
    <>
      <ambientLight intensity={0.14} />
      <directionalLight position={[3, 4, 5]} intensity={1.5} color="#fff1d6" />
      <directionalLight position={[-4, -1, 3]} intensity={0.45} color="#b8945a" />
      <pointLight ref={sweep} position={[0, 0.6, 2.7]} intensity={22} distance={9} decay={2} color="#ffe2a8" />

      <Environment resolution={q.envRes} frames={1}>
        <Lightformer form="rect" intensity={2.2} color="#fff2d8" position={[0, 3.6, 3]} scale={[8, 2, 1]} />
        <Lightformer form="rect" intensity={1.2} color="#d8bc83" position={[-5, 0, 2]} scale={[6, 3, 1]} />
        <Lightformer form="rect" intensity={0.8} color="#ffffff" position={[5, 1, -1]} scale={[6, 2, 1]} />
        <Lightformer form="ring" intensity={1.4} color="#ffe6b0" position={[0, -1, 4]} scale={3} />
      </Environment>

      <group ref={group} rotation={[0, -0.18, 0]}>
        <mesh geometry={geo.rim} material={mats.gold} />
        <mesh geometry={geo.panel} material={mats.bronze} />
        <mesh geometry={geo.frame} material={mats.light} />
        {geo.letters.map((g, i) => (
          <mesh key={i} geometry={g} material={mats.light} />
        ))}
        <instancedMesh
          key={nodes.length}
          ref={leafRef}
          args={[geo.leaf, mats.gold, nodes.length]}
          frustumCulled={false}
        />
        <mesh geometry={geo.star} material={mats.light} />
      </group>

      <Sparkles
        count={isHero ? q.particles : Math.round(q.particles * 0.6)}
        scale={[5.2, 5.6, 2.6]}
        size={2.2}
        speed={reduced ? 0 : 0.18}
        opacity={0.55}
        color="#D8BC83"
        noise={0.6}
      />
    </>
  )
}

export default function EmblemCanvas({ variant = 'hero', active, onReady, onFail }) {
  const q = useQuality()
  const reduced = !!useReducedMotion()

  return (
    <Canvas
      dpr={[1, q.dpr]}
      frameloop={active ? 'always' : 'never'}
      camera={{ position: [0, 0, 8.6], fov: 30, near: 0.1, far: 40 }}
      gl={{ antialias: q.antialias, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0)
        gl.domElement.addEventListener('webglcontextlost', (e) => {
          e.preventDefault()
          onFail?.()
        })
        // espera 2 quadros para o cross-fade não mostrar um canvas vazio
        requestAnimationFrame(() => requestAnimationFrame(() => onReady?.()))
      }}
    >
      <Emblem q={q} reduced={reduced} variant={variant} />
    </Canvas>
  )
}

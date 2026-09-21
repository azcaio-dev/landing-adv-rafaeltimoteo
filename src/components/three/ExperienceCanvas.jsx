import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import * as THREE from 'three'
import { useReducedMotion } from 'framer-motion'
import { useQuality } from '../../hooks/useQuality'
import { buildGoldMaterials } from '../../lib/emblemThree'

const { smoothstep, damp, lerp } = THREE.MathUtils

const V = (r, y) => new THREE.Vector2(r, y)

/** Geometrias da balança — tudo procedural, sem modelos externos. */
function buildScaleGeometry() {
  const post = new THREE.LatheGeometry(
    [
      V(0, 0), V(0.36, 0), V(0.36, 0.08), V(0.28, 0.14), V(0.28, 0.26), V(0.16, 0.34),
      V(0.1, 0.55), V(0.078, 1.2), V(0.078, 1.9), V(0.1, 2.2), V(0.16, 2.32),
      V(0.12, 2.4), V(0.14, 2.5), V(0, 2.5),
    ],
    44,
  )
  const pan = new THREE.LatheGeometry(
    [
      V(0, -0.07), V(0.25, -0.06), V(0.45, -0.02), V(0.58, 0.07), V(0.585, 0.09),
      V(0.565, 0.09), V(0.44, 0.0), V(0.25, -0.035), V(0, -0.045),
    ],
    48,
  )
  const beam = new THREE.CylinderGeometry(0.028, 0.028, 2.7, 20)
  beam.rotateZ(Math.PI / 2)

  // três correntes finas (linhas) do braço até a borda do prato
  const pts = []
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2 + Math.PI / 2
    pts.push(0, 0, 0, Math.cos(a) * 0.56, -1, Math.sin(a) * 0.56)
  }
  const chains = new THREE.BufferGeometry()
  chains.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3))

  return {
    post,
    pan,
    beam,
    chains,
    pivot: new THREE.SphereGeometry(0.11, 24, 18),
    finial: new THREE.SphereGeometry(0.06, 20, 14),
    plinth: new THREE.CylinderGeometry(1.05, 1.12, 0.14, 64),
    ring: new THREE.TorusGeometry(1.05, 0.012, 8, 96),
    sheet: new THREE.BoxGeometry(0.9, 1.25, 0.012),
    cone: new THREE.ConeGeometry(1.7, 5.2, 40, 1, true),
  }
}

const COOL = new THREE.Color('#dfe6ff')
const WARM = new THREE.Color('#ffdba0')

function Scene({ progress, reduced, q }) {
  const size = useThree((s) => s.size)
  const wide = size.width / size.height > 1.05

  const plinth = useRef(null)
  const post = useRef(null)
  const beam = useRef(null)
  const panL = useRef(null)
  const panR = useRef(null)
  const sheets = useRef(null)
  const key = useRef(null)
  const p = useRef(reduced ? 1 : 0)
  const clock = useRef(0)

  const geo = useMemo(buildScaleGeometry, [])
  const mats = useMemo(() => {
    const base = buildGoldMaterials()
    return {
      ...base,
      line: new THREE.LineBasicMaterial({ color: '#B8945A', transparent: true, opacity: 0.7 }),
      paper: new THREE.MeshStandardMaterial({ color: '#e7e0d0', roughness: 0.85, metalness: 0 }),
      beam: new THREE.MeshBasicMaterial({
        color: '#d8bc83', transparent: true, opacity: 0.045, side: THREE.DoubleSide,
        depthWrite: false, blending: THREE.AdditiveBlending,
      }),
    }
  }, [])

  useEffect(
    () => () => {
      Object.values(geo).forEach((g) => g.dispose())
      Object.values(mats).forEach((m) => m.dispose())
    },
    [geo, mats],
  )

  useFrame((state, delta) => {
    clock.current += Math.min(delta, 0.1)
    const t = clock.current
    const target = reduced ? 1 : progress.get()
    p.current = damp(p.current, target, 4, delta)
    const v = p.current
    const s = (a, b) => smoothstep(v, a, b)

    // objetos surgem gradualmente
    plinth.current?.scale.setScalar(Math.max(s(0, 0.14), 0.001))
    if (post.current) post.current.scale.y = Math.max(s(0.02, 0.3), 0.001)
    beam.current?.scale.setScalar(Math.max(s(0.2, 0.5), 0.001))
    sheets.current?.scale.setScalar(Math.max(s(0.35, 0.7), 0.001))

    // a balança começa desequilibrada (análise) e se estabiliza (orientação)
    const settle = s(0.5, 0.72)
    const a = (1 - settle) * 0.17 + Math.sin(t * 0.4) * 0.02 * settle
    if (beam.current) beam.current.rotation.z = reduced ? 0 : a
    if (panL.current) panL.current.rotation.z = reduced ? 0 : -a
    if (panR.current) panR.current.rotation.z = reduced ? 0 : -a

    if (sheets.current && !reduced) {
      sheets.current.children.forEach((m, i) => {
        m.position.y = (i === 0 ? 0.3 : -0.45) + Math.sin(t * 0.5 + i * 2) * 0.06
      })
    }

    // câmera: aproxima e orbita levemente conforme o scroll
    const cam = state.camera
    const theta = reduced ? 0.18 : lerp(-0.32, 0.3, v)
    const r = reduced ? 8.2 : lerp(10.5, 7.9, v)
    cam.position.set(Math.sin(theta) * r, lerp(0.9, 0.25, v), Math.cos(theta) * r)
    cam.lookAt(0, 0, 0)

    // iluminação esfria → esquenta discretamente
    if (key.current) {
      key.current.color.lerpColors(COOL, WARM, s(0.1, 0.9))
      key.current.intensity = lerp(35, 80, v)
    }
  })

  return (
    <>
      <ambientLight intensity={0.12} />
      <spotLight ref={key} position={[2.5, 6, 4]} angle={0.55} penumbra={1} intensity={40} decay={2} distance={30} />
      <directionalLight position={[-4, 2, 3]} intensity={0.45} color="#9fb4ff" />
      <pointLight position={[-3, -1, -4]} intensity={20} color="#b8945a" />

      <Environment resolution={q.envRes} frames={1}>
        <Lightformer form="rect" intensity={1.8} color="#fff2d8" position={[0, 4, 3]} scale={[9, 2, 1]} />
        <Lightformer form="rect" intensity={1.0} color="#d8bc83" position={[-5, 0, 2]} scale={[6, 3, 1]} />
        <Lightformer form="rect" intensity={0.7} color="#ffffff" position={[5, 1, -1]} scale={[6, 2, 1]} />
      </Environment>

      <group position={[wide ? 1.7 : 0, wide ? -0.1 : 0.75, 0]} scale={wide ? 1 : 0.8}>
        <group ref={plinth} position={[0, -1.55, 0]}>
          <mesh geometry={geo.plinth} material={mats.dark} />
          <mesh geometry={geo.ring} material={mats.gold} position={[0, 0.07, 0]} rotation={[Math.PI / 2, 0, 0]} />
        </group>

        <group ref={post} position={[0, -1.5, 0]}>
          <mesh geometry={geo.post} material={mats.gold} />
        </group>

        <group ref={beam} position={[0, 1.0, 0]}>
          <mesh geometry={geo.beam} material={mats.light} />
          <mesh geometry={geo.pivot} material={mats.gold} />
          <mesh geometry={geo.finial} material={mats.light} position={[-1.35, 0, 0]} />
          <mesh geometry={geo.finial} material={mats.light} position={[1.35, 0, 0]} />
          <group ref={panL} position={[-1.35, 0, 0]}>
            <lineSegments geometry={geo.chains} material={mats.line} />
            <mesh geometry={geo.pan} material={mats.goldDouble} position={[0, -1, 0]} />
          </group>
          <group ref={panR} position={[1.35, 0, 0]}>
            <lineSegments geometry={geo.chains} material={mats.line} />
            <mesh geometry={geo.pan} material={mats.goldDouble} position={[0, -1, 0]} />
          </group>
        </group>

        {q.tier !== 'low' && (
          <group ref={sheets} position={[-2.6, 0, 0.4]}>
            <mesh geometry={geo.sheet} material={mats.paper} position={[0, 0.3, 0]} rotation={[0.1, 0.55, 0.12]} />
            <mesh geometry={geo.sheet} material={mats.paper} position={[-0.6, -0.45, -0.9]} rotation={[-0.1, 0.75, -0.2]} />
          </group>
        )}

        <mesh geometry={geo.cone} material={mats.beam} position={[0, 0.6, 0]} />
      </group>
    </>
  )
}

export default function ExperienceCanvas({ progress, active, onReady, onFail }) {
  const q = useQuality()
  const reduced = !!useReducedMotion()

  return (
    <Canvas
      dpr={[1, Math.min(q.dpr, 1.75)]}
      frameloop={active ? 'always' : 'never'}
      camera={{ position: [0, 0.9, 10.5], fov: 32, near: 0.1, far: 50 }}
      gl={{ antialias: q.antialias, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0)
        gl.domElement.addEventListener('webglcontextlost', (e) => {
          e.preventDefault()
          onFail?.()
        })
        requestAnimationFrame(() => requestAnimationFrame(() => onReady?.()))
      }}
    >
      <Scene progress={progress} reduced={reduced} q={q} />
    </Canvas>
  )
}

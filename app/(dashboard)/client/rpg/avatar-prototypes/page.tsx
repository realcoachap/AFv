'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import NavBar from '@/app/components/NavBar'

// ============================================================================
// PROTOTYPE 1: MeshPhysicalMaterial - Enhanced Capsules
// ============================================================================
function createPhysicalMaterial() {
  return new THREE.MeshPhysicalMaterial({
    color: 0xffdbac,
    roughness: 0.3,
    metalness: 0.1,
    clearcoat: 0.4,
    clearcoatRoughness: 0.2,
    reflectivity: 0.5,
    ior: 1.45,
    sheen: 0.2,
    sheenColor: 0xffaa88,
  })
}

function createBasicMaterial() {
  return new THREE.MeshStandardMaterial({
    color: 0xffdbac,
    roughness: 0.5,
    metalness: 0.1,
  })
}

// ============================================================================
// PROTOTYPE 2: Metaball Muscles (Simplified)
// ============================================================================
function createMetaballMuscle(group: THREE.Group, position: THREE.Vector3, scale: number, color: number) {
  // Create a "blob" from multiple overlapping spheres
  const blobGroup = new THREE.Group()
  blobGroup.position.copy(position)
  
  const material = new THREE.MeshPhysicalMaterial({
    color: color,
    roughness: 0.4,
    metalness: 0.0,
    clearcoat: 0.3,
    transmission: 0.1,
    thickness: 0.5,
  })
  
  // Core sphere
  const core = new THREE.Mesh(
    new THREE.SphereGeometry(0.5 * scale, 32, 32),
    material
  )
  blobGroup.add(core)
  
  // Satellite spheres for organic shape
  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2
    const radius = 0.3 * scale
    const sat = new THREE.Mesh(
      new THREE.SphereGeometry(0.25 * scale, 24, 24),
      material
    )
    sat.position.set(
      Math.cos(angle) * radius,
      Math.sin(angle) * radius * 0.5,
      Math.sin(angle) * radius * 0.3
    )
    blobGroup.add(sat)
  }
  
  group.add(blobGroup)
  return blobGroup
}

// ============================================================================
// PROTOTYPE 3: Stylized Anatomy Figure
// ============================================================================
function createAnatomyFigure(group: THREE.Group, material: THREE.Material) {
  const figure = new THREE.Group()
  
  // Head
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.35, 32, 32), material)
  head.position.y = 1.6
  figure.add(head)
  
  // Torso (tapered)
  const chest = new THREE.Mesh(
    new THREE.CylinderGeometry(0.5, 0.4, 0.5, 32),
    material
  )
  chest.position.y = 1.1
  chest.scale.z = 0.6
  figure.add(chest)
  
  const abs = new THREE.Mesh(
    new THREE.CylinderGeometry(0.4, 0.35, 0.4, 32),
    material
  )
  abs.position.y = 0.7
  abs.scale.z = 0.55
  figure.add(abs)
  
  // Shoulders
  const shoulderL = new THREE.Mesh(new THREE.SphereGeometry(0.25, 24, 24), material)
  shoulderL.position.set(-0.55, 1.25, 0)
  figure.add(shoulderL)
  
  const shoulderR = new THREE.Mesh(new THREE.SphereGeometry(0.25, 24, 24), material)
  shoulderR.position.set(0.55, 1.25, 0)
  figure.add(shoulderR)
  
  // Arms with bicep/tricep definition
  function createArm(isLeft: boolean) {
    const arm = new THREE.Group()
    const xOffset = isLeft ? -0.75 : 0.75
    arm.position.set(xOffset, 1.1, 0)
    
    // Upper arm
    const upperArm = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.12, 0.5, 8, 16),
      material
    )
    upperArm.position.y = -0.25
    arm.add(upperArm)
    
    // Bicep bulge
    const bicep = new THREE.Mesh(
      new THREE.SphereGeometry(0.18, 24, 24),
      material
    )
    bicep.position.set(isLeft ? 0.08 : -0.08, -0.15, 0.1)
    arm.add(bicep)
    
    // Forearm
    const forearm = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.1, 0.5, 8, 16),
      material
    )
    forearm.position.y = -0.75
    arm.add(forearm)
    
    return arm
  }
  
  figure.add(createArm(true))
  figure.add(createArm(false))
  
  // Legs
  function createLeg(isLeft: boolean) {
    const leg = new THREE.Group()
    const xOffset = isLeft ? -0.2 : 0.2
    leg.position.set(xOffset, 0.4, 0)
    
    // Thigh
    const thigh = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.18, 0.6, 8, 16),
      material
    )
    thigh.position.y = -0.3
    leg.add(thigh)
    
    // Calf
    const calf = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.14, 0.6, 8, 16),
      material
    )
    calf.position.y = -0.95
    leg.add(calf)
    
    return leg
  }
  
  figure.add(createLeg(true))
  figure.add(createLeg(false))
  
  group.add(figure)
  return figure
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function AvatarPrototypesPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const [activePrototype, setActivePrototype] = useState<'basic' | 'physical' | 'metaball' | 'anatomy'>('basic')
  const [muscleScale, setMuscleScale] = useState(1)
  const prototypeGroupRef = useRef<THREE.Group | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x1a2332)
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(45, 800 / 500, 0.1, 100)
    camera.position.set(0, 1, 4)

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true })
    renderer.setSize(800, 500)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.0

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.target.set(0, 0.8, 0)

    // Lighting setup for realism
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
    scene.add(ambientLight)

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.5)
    mainLight.position.set(3, 5, 3)
    mainLight.castShadow = true
    mainLight.shadow.mapSize.width = 2048
    mainLight.shadow.mapSize.height = 2048
    scene.add(mainLight)

    const rimLight = new THREE.SpotLight(0x88ccff, 2)
    rimLight.position.set(-3, 4, -2)
    rimLight.lookAt(0, 0.8, 0)
    scene.add(rimLight)

    const fillLight = new THREE.DirectionalLight(0xffaa77, 0.5)
    fillLight.position.set(-2, 2, 2)
    scene.add(fillLight)

    // Floor
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10),
      new THREE.MeshStandardMaterial({ 
        color: 0x2a3342,
        roughness: 0.8,
        metalness: 0.2
      })
    )
    floor.rotation.x = -Math.PI / 2
    floor.receiveShadow = true
    scene.add(floor)

    // Prototype container
    const prototypeGroup = new THREE.Group()
    scene.add(prototypeGroup)
    prototypeGroupRef.current = prototypeGroup

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      renderer.dispose()
    }
  }, [])

  // Update prototype when selection changes
  useEffect(() => {
    if (!prototypeGroupRef.current || !sceneRef.current) return

    // Clear existing
    while (prototypeGroupRef.current.children.length > 0) {
      prototypeGroupRef.current.remove(prototypeGroupRef.current.children[0])
    }

    const group = prototypeGroupRef.current

    switch (activePrototype) {
      case 'basic':
        // Current implementation - basic capsules
        createAnatomyFigure(group, createBasicMaterial())
        break

      case 'physical':
        // Enhanced with MeshPhysicalMaterial
        createAnatomyFigure(group, createPhysicalMaterial())
        break

      case 'metaball':
        // Organic blob muscles
        createMetaballMuscle(group, new THREE.Vector3(-0.5, 0.8, 0), muscleScale, 0xff8866)
        createMetaballMuscle(group, new THREE.Vector3(0.5, 0.8, 0), muscleScale, 0xff8866)
        createMetaballMuscle(group, new THREE.Vector3(0, 1.1, 0), muscleScale * 0.8, 0xffaa88)
        // Head
        const head = new THREE.Mesh(
          new THREE.SphereGeometry(0.3, 32, 32),
          createPhysicalMaterial()
        )
        head.position.y = 1.6
        group.add(head)
        break

      case 'anatomy':
        // Detailed anatomy figure with scalable muscles
        const mat = createPhysicalMaterial()
        
        // Body base
        const torso = new THREE.Mesh(
          new THREE.CylinderGeometry(0.45 * muscleScale, 0.35, 0.8, 32),
          mat
        )
        torso.position.y = 1.0
        torso.scale.z = 0.5
        group.add(torso)
        
        // Scalable biceps
        const bicepL = new THREE.Mesh(
          new THREE.SphereGeometry(0.2 * muscleScale, 32, 32),
          mat
        )
        bicepL.position.set(-0.6, 1.0, 0.1)
        group.add(bicepL)
        
        const bicepR = new THREE.Mesh(
          new THREE.SphereGeometry(0.2 * muscleScale, 32, 32),
          mat
        )
        bicepR.position.set(0.6, 1.0, 0.1)
        group.add(bicepR)
        
        // Arms
        const armL = new THREE.Mesh(
          new THREE.CapsuleGeometry(0.1, 0.6, 8, 16),
          mat
        )
        armL.position.set(-0.6, 0.6, 0)
        group.add(armL)
        
        const armR = new THREE.Mesh(
          new THREE.CapsuleGeometry(0.1, 0.6, 8, 16),
          mat
        )
        armR.position.set(0.6, 0.6, 0)
        group.add(armR)
        
        // Head
        const headMesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.3, 32, 32),
          mat
        )
        headMesh.position.y = 1.6
        group.add(headMesh)
        break
    }
  }, [activePrototype, muscleScale])

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar role="client" backLink="/client/rpg" backText="← Back to RPG" />

      <main className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          🧪 Avatar Prototype Lab
        </h1>
        <p className="text-gray-600 mb-6">
          Testing three approaches to realistic procedural avatars
        </p>

        {/* Prototype Selector */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { id: 'basic', label: '1. Current (Basic)', color: 'bg-gray-500' },
            { id: 'physical', label: '2. MeshPhysical', color: 'bg-blue-500' },
            { id: 'metaball', label: '3. Metaball', color: 'bg-purple-500' },
            { id: 'anatomy', label: '4. Scalable Anatomy', color: 'bg-green-500' },
          ].map((proto) => (
            <button
              key={proto.id}
              onClick={() => setActivePrototype(proto.id as any)}
              className={`p-4 rounded-lg text-white font-medium transition-all ${
                activePrototype === proto.id 
                  ? `${proto.color} ring-4 ring-offset-2 ring-gray-300` 
                  : `${proto.color} opacity-70 hover:opacity-100`
              }`}
            >
              {proto.label}
            </button>
          ))}
        </div>

        {/* 3D Canvas */}
        <div className="bg-gray-900 rounded-xl overflow-hidden shadow-2xl mb-6">
          <canvas ref={canvasRef} className="w-full h-[500px]" />
        </div>

        {/* Muscle Scale Control (for applicable prototypes) */}
        {(activePrototype === 'metaball' || activePrototype === 'anatomy') && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Muscle Scale: {muscleScale.toFixed(1)}x
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={muscleScale}
              onChange={(e) => setMuscleScale(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <p className="text-sm text-gray-500 mt-2">
              Drag to see muscles grow/shrink in real-time!
            </p>
          </div>
        )}

        {/* Explanation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Prototype 1 */}
          <div className={`p-6 rounded-lg border-2 ${activePrototype === 'basic' ? 'border-gray-500 bg-gray-50' : 'border-gray-200'}`}>
            <h3 className="text-lg font-bold text-gray-800 mb-2">1. Current: Basic Capsules</h3>
            <p className="text-gray-600 text-sm mb-3">
              Standard MeshStandardMaterial. Plastic-like appearance.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>✅ Fast rendering</li>
              <li>❌ Looks artificial</li>
              <li>❌ No skin-like properties</li>
            </ul>
          </div>

          {/* Prototype 2 */}
          <div className={`p-6 rounded-lg border-2 ${activePrototype === 'physical' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
            <h3 className="text-lg font-bold text-gray-800 mb-2">2. MeshPhysicalMaterial</h3>
            <p className="text-gray-600 text-sm mb-3">
              Advanced material with clearcoat, sheen, and realistic light response.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>✅ Waxy/skin-like appearance</li>
              <li>✅ Subtle surface shine</li>
              <li>⚠️ Slightly more GPU cost</li>
            </ul>
          </div>

          {/* Prototype 3 */}
          <div className={`p-6 rounded-lg border-2 ${activePrototype === 'metaball' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'}`}>
            <h3 className="text-lg font-bold text-gray-800 mb-2">3. Metaball Muscles</h3>
            <p className="text-gray-600 text-sm mb-3">
              Organic blob shapes formed from overlapping spheres. No hard edges.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>✅ Truly organic shapes</li>
              <li>✅ Smooth muscle definition</li>
              <li>⚠️ More geometry to render</li>
              <li>⚠️ Harder to rig/animate</li>
            </ul>
          </div>

          {/* Prototype 4 */}
          <div className={`p-6 rounded-lg border-2 ${activePrototype === 'anatomy' ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
            <h3 className="text-lg font-bold text-gray-800 mb-2">4. Scalable Anatomy</h3>
            <p className="text-gray-600 text-sm mb-3">
              Purpose-built anatomy with scalable muscle groups. Best of both worlds.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>✅ Realistic proportions</li>
              <li>✅ Controllable muscle scaling</li>
              <li>✅ Works with RPG stats</li>
              <li>✅ Efficient rendering</li>
            </ul>
          </div>
        </div>

        {/* Recommendation */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
          <h2 className="text-xl font-bold mb-3">🎯 My Recommendation</h2>
          <p className="mb-4">
            Go with <strong>Option 4: Scalable Anatomy</strong> using MeshPhysicalMaterial.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white/20 rounded-lg p-3">
              <p className="font-bold mb-1">Visual Quality</p>
              <p>Realistic skin-like appearance with clearcoat shine</p>
            </div>
            <div className="bg-white/20 rounded-lg p-3">
              <p className="font-bold mb-1">Evolution</p>
              <p>Individual muscle groups scale with user stats</p>
            </div>
            <div className="bg-white/20 rounded-lg p-3">
              <p className="font-bold mb-1">Performance</p>
              <p>Optimized geometry, mobile-friendly</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

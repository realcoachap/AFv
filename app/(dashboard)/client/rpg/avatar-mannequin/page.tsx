'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import NavBar from '@/app/components/NavBar'

// Create a mannequin-like figure using Three.js primitives
function createMannequinFigure() {
  const figure = new THREE.Group()

  // Material - wood/mannequin style
  const material = new THREE.MeshPhysicalMaterial({
    color: 0xdeb887, // Wood color
    roughness: 0.6,
    metalness: 0.1,
    clearcoat: 0.2,
  })

  const jointMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x8b7355, // Darker wood for joints
    roughness: 0.7,
    metalness: 0.2,
  })

  // Head
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.12, 32, 32), material)
  head.position.y = 1.75
  head.castShadow = true
  figure.add(head)

  // Neck
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.1, 16), material)
  neck.position.y = 1.65
  neck.castShadow = true
  figure.add(neck)

  // Torso group (for scaling)
  const torso = new THREE.Group()
  torso.position.y = 1.3
  
  // Chest
  const chest = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.15, 0.35, 32),
    material
  )
  chest.position.y = 0.15
  chest.scale.z = 0.6
  chest.castShadow = true
  torso.add(chest)
  
  // Abs
  const abs = new THREE.Mesh(
    new THREE.CylinderGeometry(0.15, 0.12, 0.3, 32),
    material
  )
  abs.position.y = -0.175
  abs.scale.z = 0.55
  abs.castShadow = true
  torso.add(abs)
  
  figure.add(torso)
  figure.userData.torso = torso

  // Shoulders
  const shoulderL = new THREE.Mesh(new THREE.SphereGeometry(0.08, 24, 24), jointMaterial)
  shoulderL.position.set(-0.22, 1.5, 0)
  shoulderL.castShadow = true
  figure.add(shoulderL)
  figure.userData.shoulderL = shoulderL

  const shoulderR = new THREE.Mesh(new THREE.SphereGeometry(0.08, 24, 24), jointMaterial)
  shoulderR.position.set(0.22, 1.5, 0)
  shoulderR.castShadow = true
  figure.add(shoulderR)
  figure.userData.shoulderR = shoulderR

  // Arms
  function createArm(isLeft: boolean) {
    const armGroup = new THREE.Group()
    const xOffset = isLeft ? -0.22 : 0.22
    armGroup.position.set(xOffset, 1.5, 0)

    // Upper arm
    const upperArm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.055, 0.05, 0.35, 16),
      material
    )
    upperArm.position.y = -0.175
    upperArm.castShadow = true
    armGroup.add(upperArm)
    armGroup.userData.upperArm = upperArm

    // Elbow joint
    const elbow = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 16), jointMaterial)
    elbow.position.y = -0.375
    armGroup.add(elbow)

    // Forearm group (for posing)
    const forearmGroup = new THREE.Group()
    forearmGroup.position.y = -0.375

    // Forearm
    const forearm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.04, 0.35, 16),
      material
    )
    forearm.position.y = -0.175
    forearm.castShadow = true
    forearmGroup.add(forearm)
    forearmGroup.userData.forearm = forearm

    // Hand
    const hand = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 16), material)
    hand.position.y = -0.4
    hand.scale.y = 1.5
    forearmGroup.add(hand)

    armGroup.add(forearmGroup)
    armGroup.userData.forearmGroup = forearmGroup

    return armGroup
  }

  const armL = createArm(true)
  const armR = createArm(false)
  figure.add(armL)
  figure.add(armR)
  figure.userData.armL = armL
  figure.userData.armR = armR

  // Hips
  const hips = new THREE.Mesh(
    new THREE.CylinderGeometry(0.13, 0.12, 0.15, 32),
    material
  )
  hips.position.y = 0.95
  hips.scale.z = 0.7
  hips.castShadow = true
  figure.add(hips)
  figure.userData.hips = hips

  // Legs
  function createLeg(isLeft: boolean) {
    const legGroup = new THREE.Group()
    const xOffset = isLeft ? -0.1 : 0.1
    legGroup.position.set(xOffset, 0.875, 0)

    // Thigh
    const thigh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.07, 0.055, 0.45, 16),
      material
    )
    thigh.position.y = -0.225
    thigh.castShadow = true
    legGroup.add(thigh)
    legGroup.userData.thigh = thigh

    // Knee
    const knee = new THREE.Mesh(new THREE.SphereGeometry(0.065, 16, 16), jointMaterial)
    knee.position.y = -0.475
    legGroup.add(knee)

    // Lower leg group
    const lowerLegGroup = new THREE.Group()
    lowerLegGroup.position.y = -0.475

    // Calf
    const calf = new THREE.Mesh(
      new THREE.CylinderGeometry(0.055, 0.04, 0.45, 16),
      material
    )
    calf.position.y = -0.225
    calf.castShadow = true
    lowerLegGroup.add(calf)
    lowerLegGroup.userData.calf = calf

    // Foot
    const foot = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 0.08, 0.15),
      material
    )
    foot.position.set(0, -0.49, 0.035)
    foot.castShadow = true
    lowerLegGroup.add(foot)

    legGroup.add(lowerLegGroup)
    legGroup.userData.lowerLegGroup = lowerLegGroup

    return legGroup
  }

  const legL = createLeg(true)
  const legR = createLeg(false)
  figure.add(legL)
  figure.add(legR)
  figure.userData.legL = legL
  figure.userData.legR = legR

  return figure
}

export default function MannequinPrototypePage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [muscleLevel, setMuscleLevel] = useState(50)
  const [height, setHeight] = useState(50)
  const [weight, setWeight] = useState(50)
  const [pose, setPose] = useState('stand')
  const figureRef = useRef<THREE.Group | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x1a2332)
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(45, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 100)
    camera.position.set(0, 1.5, 4)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    containerRef.current.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.target.set(0, 1, 0)
    controls.minDistance = 2
    controls.maxDistance = 8

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
    scene.add(ambientLight)

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.2)
    mainLight.position.set(3, 5, 3)
    mainLight.castShadow = true
    mainLight.shadow.mapSize.width = 2048
    mainLight.shadow.mapSize.height = 2048
    scene.add(mainLight)

    const rimLight = new THREE.SpotLight(0x88ccff, 1.5)
    rimLight.position.set(-3, 4, -2)
    rimLight.lookAt(0, 1, 0)
    scene.add(rimLight)

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

    // Create figure
    const figure = createMannequinFigure()
    figureRef.current = figure
    scene.add(figure)

    // Apply initial scale
    updateBodyScale()

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)
      controls.update()
      
      // Breathing animation
      if (figureRef.current) {
        const time = Date.now() * 0.001
        const userData = figureRef.current.userData
        if (userData.torso) {
          userData.torso.rotation.x = Math.sin(time) * 0.02
          userData.torso.scale.x = 1 + Math.sin(time * 2) * 0.005
        }
      }
      
      renderer.render(scene, camera)
    }
    animate()

    // Resize handler
    const handleResize = () => {
      if (!containerRef.current) return
      const width = containerRef.current.clientWidth
      const height = containerRef.current.clientHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      renderer.dispose()
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement)
      }
    }
  }, [])

  // Update body scale
  const updateBodyScale = () => {
    if (!figureRef.current) return

    const f = figureRef.current
    const userData = f.userData
    
    const muscleFactor = 0.7 + (muscleLevel / 100) * 0.6 // 0.7 to 1.3
    const heightFactor = 0.85 + (height / 100) * 0.3 // 0.85 to 1.15
    const weightFactor = 0.8 + (weight / 100) * 0.4 // 0.8 to 1.2

    // Overall scale
    f.scale.set(heightFactor, heightFactor, heightFactor)

    // Upper arms
    if (userData.armL?.userData?.upperArm) {
      userData.armL.userData.upperArm.scale.set(muscleFactor, 1, muscleFactor)
    }
    if (userData.armR?.userData?.upperArm) {
      userData.armR.userData.upperArm.scale.set(muscleFactor, 1, muscleFactor)
    }

    // Forearms
    if (userData.armL?.userData?.forearmGroup?.userData?.forearm) {
      userData.armL.userData.forearmGroup.userData.forearm.scale.set(
        0.8 + (muscleFactor - 0.7) * 0.5, 1, 0.8 + (muscleFactor - 0.7) * 0.5
      )
    }
    if (userData.armR?.userData?.forearmGroup?.userData?.forearm) {
      userData.armR.userData.forearmGroup.userData.forearm.scale.set(
        0.8 + (muscleFactor - 0.7) * 0.5, 1, 0.8 + (muscleFactor - 0.7) * 0.5
      )
    }

    // Thighs (muscle + weight)
    const thighScale = 0.9 + (muscleFactor - 0.7) * 0.3 + (weightFactor - 0.8) * 0.25
    if (userData.legL?.userData?.thigh) {
      userData.legL.userData.thigh.scale.set(thighScale, 1, thighScale)
    }
    if (userData.legR?.userData?.thigh) {
      userData.legR.userData.thigh.scale.set(thighScale, 1, thighScale)
    }

    // Calves
    const calfScale = 0.85 + (muscleFactor - 0.7) * 0.5
    if (userData.legL?.userData?.lowerLegGroup?.userData?.calf) {
      userData.legL.userData.lowerLegGroup.userData.calf.scale.set(calfScale, 1, calfScale)
    }
    if (userData.legR?.userData?.lowerLegGroup?.userData?.calf) {
      userData.legR.userData.lowerLegGroup.userData.calf.scale.set(calfScale, 1, calfScale)
    }

    // Chest/shoulders
    const chestScale = 0.9 + (muscleFactor - 0.7) * 0.4
    if (userData.torso) {
      userData.torso.scale.set(chestScale, 1, 0.6 + (weightFactor - 0.8) * 0.2)
    }

    // Shoulders
    const shoulderScale = 0.8 + (muscleFactor - 0.7) * 0.3
    if (userData.shoulderL) userData.shoulderL.scale.setScalar(shoulderScale)
    if (userData.shoulderR) userData.shoulderR.scale.setScalar(shoulderScale)

    // Neck
    const neckScale = 0.9 + (muscleFactor - 0.7) * 0.2
    // Neck is child of figure, scale it
    const neck = f.children.find((c: any) => c.geometry?.type === 'CylinderGeometry' && c.position.y === 1.65)
    if (neck) neck.scale.set(neckScale, 1, neckScale)

    // Weight affects hips
    if (userData.hips) {
      userData.hips.scale.set(0.9 + (weightFactor - 0.8) * 0.2, 1, 0.7 + (weightFactor - 0.8) * 0.3)
    }
  }

  useEffect(() => {
    updateBodyScale()
  }, [muscleLevel, height, weight])

  // Change pose
  useEffect(() => {
    if (!figureRef.current) return
    const f = figureRef.current

    switch (pose) {
      case 'stand':
        f.rotation.y = 0
        if (f.userData.armL) {
          f.userData.armL.rotation.z = 0.1
          f.userData.armL.userData.forearmGroup.rotation.z = 0
        }
        if (f.userData.armR) {
          f.userData.armR.rotation.z = -0.1
          f.userData.armR.userData.forearmGroup.rotation.z = 0
        }
        if (f.userData.legL) f.userData.legL.rotation.x = 0
        if (f.userData.legR) f.userData.legR.rotation.x = 0
        break

      case 'flex':
        f.rotation.y = 0.3
        if (f.userData.armL) {
          f.userData.armL.rotation.z = 2.2
          f.userData.armL.userData.forearmGroup.rotation.z = 1.5
        }
        if (f.userData.armR) {
          f.userData.armR.rotation.z = -2.2
          f.userData.armR.userData.forearmGroup.rotation.z = -1.5
        }
        break

      case 'walk':
        if (f.userData.legL) f.userData.legL.rotation.x = 0.3
        if (f.userData.legR) f.userData.legR.rotation.x = -0.2
        if (f.userData.armL) f.userData.armL.rotation.x = -0.2
        if (f.userData.armR) f.userData.armR.rotation.x = 0.3
        break
    }
  }, [pose])

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar role="client" backLink="/client/rpg" backText="← Back to RPG" />

      <main className="max-w-6xl mx-auto p-4 sm:p-6">
        <div className="mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            🏋️ Mannequin Prototype
          </h1>
          <p className="text-gray-600">
            Full-body avatar with scalable muscle groups
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* 3D Viewport */}
          <div className="lg:col-span-2">
            <div 
              ref={containerRef}
              className="bg-gray-900 rounded-xl overflow-hidden shadow-2xl aspect-[4/3]"
            />
          </div>

          {/* Controls */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow p-4">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                💪 Muscle Level: {muscleLevel}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={muscleLevel}
                onChange={(e) => setMuscleLevel(parseInt(e.target.value))}
                className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                📏 Height: {height}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={height}
                onChange={(e) => setHeight(parseInt(e.target.value))}
                className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                ⚖️ Weight: {weight}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={weight}
                onChange={(e) => setWeight(parseInt(e.target.value))}
                className="w-full h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                🎭 Pose
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['stand', 'flex', 'walk'].map((p) => (
                  <button
                    key={p}
                    onClick={() => setPose(p)}
                    className={`px-3 py-2 rounded text-sm font-medium capitalize transition-colors ${
                      pose === p 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg p-4 text-white">
              <h3 className="font-bold mb-2">📊 Body Stats</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Muscle Mass:</span>
                  <span className="font-mono">{muscleLevel}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Height:</span>
                  <span className="font-mono">{(160 + height * 0.4).toFixed(0)}cm</span>
                </div>
                <div className="flex justify-between">
                  <span>Body Type:</span>
                  <span className="font-mono">
                    {muscleLevel > 70 ? 'Athletic' : muscleLevel > 40 ? 'Toned' : 'Lean'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-bold text-gray-800 mb-2">✅ Pros</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>Pure Three.js (no deps)</li>
              <li>Individual muscle scaling</li>
              <li>Posable skeleton</li>
              <li>60fps on mobile</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-bold text-gray-800 mb-2">⚠️ Cons</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>Stylized (not realistic)</li>
              <li>No clothing system</li>
              <li>No facial features</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-bold text-gray-800 mb-2">🎯 Verdict</h3>
            <p className="text-sm text-gray-600">
              Custom-built evolution system. Full control over every body part. 
              Great foundation for RPG progression.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

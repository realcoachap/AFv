'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import NavBar from '@/app/components/NavBar'

// Import mannequin.js
import { createMannequin, setStep, postureAnimation, setPosture } from 'mannequin-js'

export default function MannequinPrototypePage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [muscleLevel, setMuscleLevel] = useState(50) // 0-100
  const [height, setHeight] = useState(50) // 0-100
  const [weight, setWeight] = useState(50) // 0-100
  const [pose, setPose] = useState('stand')
  const mannequinRef = useRef<any>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
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
    rendererRef.current = renderer

    // Controls
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

    // Create mannequin
    const mannequin = createMannequin()
    mannequinRef.current = mannequin
    scene.add(mannequin)

    // Apply initial scale
    updateBodyScale()

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)
      controls.update()
      
      // Subtle breathing animation
      if (mannequinRef.current) {
        const time = Date.now() * 0.001
        mannequinRef.current.torso.rotation.x = Math.sin(time) * 0.02
      }
      
      renderer.render(scene, camera)
    }
    animate()

    // Handle resize
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

  // Update body scale based on sliders
  const updateBodyScale = () => {
    if (!mannequinRef.current) return

    const m = mannequinRef.current
    const muscleFactor = muscleLevel / 50 // 0.5 to 2.0
    const heightFactor = 0.8 + (height / 100) * 0.4 // 0.8 to 1.2
    const weightFactor = 0.7 + (weight / 100) * 0.6 // 0.7 to 1.3

    // Scale entire figure by height
    m.scale.set(heightFactor, heightFactor, heightFactor)

    // Muscle scaling (non-uniform on limbs)
    // Upper arms
    m.armL.scale.set(1 + (muscleFactor - 1) * 0.5, 1, 1 + (muscleFactor - 1) * 0.5)
    m.armR.scale.set(1 + (muscleFactor - 1) * 0.5, 1, 1 + (muscleFactor - 1) * 0.5)

    // Forearms
    m.forearmL.scale.set(1 + (muscleFactor - 1) * 0.3, 1, 1 + (muscleFactor - 1) * 0.3)
    m.forearmR.scale.set(1 + (muscleFactor - 1) * 0.3, 1, 1 + (muscleFactor - 1) * 0.3)

    // Thighs (affected by both muscle and weight)
    const thighScale = 1 + (muscleFactor - 1) * 0.3 + (weightFactor - 1) * 0.2
    m.legL.scale.set(thighScale, 1, thighScale)
    m.legR.scale.set(thighScale, 1, thighScale)

    // Calves
    const calfScale = 1 + (muscleFactor - 1) * 0.4
    m.legL.lowerLeg.scale.set(calfScale, 1, calfScale)
    m.legR.lowerLeg.scale.set(calfScale, 1, calfScale)

    // Torso (chest/shoulders affected by muscle)
    const chestScale = 1 + (muscleFactor - 1) * 0.4
    m.torso.scale.set(chestScale, 1, chestScale * 0.8)

    // Neck
    m.neck.scale.set(1 + (muscleFactor - 1) * 0.2, 1, 1 + (muscleFactor - 1) * 0.2)

    // Weight affects overall body volume slightly
    const bodyScale = 1 + (weightFactor - 1) * 0.1
    m.scale.multiplyScalar(bodyScale)
  }

  // Update when sliders change
  useEffect(() => {
    updateBodyScale()
  }, [muscleLevel, height, weight])

  // Change pose
  useEffect(() => {
    if (!mannequinRef.current) return

    const m = mannequinRef.current

    switch (pose) {
      case 'stand':
        setPosture(m, {
          body: { rotation: [0, 0, 0] },
          armL: { rotation: [0, 0, -0.1] },
          armR: { rotation: [0, 0, 0.1] },
          legL: { rotation: [0, 0, 0] },
          legR: { rotation: [0, 0, 0] }
        })
        break
      case 'flex':
        setPosture(m, {
          body: { rotation: [0, 0, 0] },
          armL: { rotation: [0, 0, -2.5] },
          armR: { rotation: [0, 0, 2.5] },
          forearmL: { rotation: [0, 0.5, 0] },
          forearmR: { rotation: [0, -0.5, 0] }
        })
        break
      case 'walk':
        setPosture(m, {
          body: { rotation: [0, 0, 0] },
          legL: { rotation: [0.5, 0, 0] },
          legR: { rotation: [-0.3, 0, 0] },
          armL: { rotation: [-0.3, 0, -0.1] },
          armR: { rotation: [0.5, 0, 0.1] }
        })
        break
    }
  }, [pose])

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar role="client" backLink="/client/rpg" backText="← Back to RPG" />

      <main className="max-w-6xl mx-auto p-4 sm:p-6">
        <div className="mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            🏋️ Mannequin.js Prototype
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
            {/* Muscle Level */}
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
              <p className="text-xs text-gray-500 mt-1">
                Affects arms, chest, legs
              </p>
            </div>

            {/* Height */}
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
              <p className="text-xs text-gray-500 mt-1">
                Overall body scale
              </p>
            </div>

            {/* Weight */}
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
              <p className="text-xs text-gray-500 mt-1">
                Body volume
              </p>
            </div>

            {/* Pose Selector */}
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

            {/* Stats Display */}
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

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-bold text-gray-800 mb-2">✅ Pros</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>Pure JavaScript</li>
              <li>Lightweight (~30KB)</li>
              <li>Scalable body parts</li>
              <li>Posable skeleton</li>
              <li>No external models</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-bold text-gray-800 mb-2">⚠️ Cons</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>Stylized look (not realistic)</li>
              <li>Limited clothing system</li>
              <li>No facial features</li>
              <li>Manual texture work needed</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-bold text-gray-800 mb-2">🎯 Verdict</h3>
            <p className="text-sm text-gray-600">
              Good for stylized RPG avatars with clear body progression. 
              Easy to integrate, but limited visual quality.
            </p>
            <div className="mt-2 flex gap-2">
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">FREE</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">Open Source</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

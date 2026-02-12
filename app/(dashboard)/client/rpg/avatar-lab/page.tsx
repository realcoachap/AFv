'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/frei'
import { EffectComposer, Bloom, SSAO } from '@react-three/postprocessing'
import NavBar from '@/app/components/NavBar'

// ============================================
// TEST SUBJECT: Enhanced Avatar with Features
// ============================================
function TestAvatar({ 
  strength, 
  enableTextures, 
  enableAdvancedLighting,
  animationStyle 
}: { 
  strength: number
  enableTextures: boolean
  enableAdvancedLighting: boolean
  animationStyle: 'idle' | 'breathe' | 'flex' 
}) {
  const groupRef = useRef<THREE.Group>(null)
  const muscleScale = 0.8 + (strength / 100) * 0.35

  // Generate procedural skin texture
  const skinTexture = useMemo(() => {
    if (!enableTextures) return null
    
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext('2d')!
    
    // Base skin color
    ctx.fillStyle = '#c68642'
    ctx.fillRect(0, 0, 512, 512)
    
    // Add noise/pores
    for (let i = 0; i < 5000; i++) {
      const x = Math.random() * 512
      const y = Math.random() * 512
      const size = Math.random() * 1.5
      const opacity = Math.random() * 0.1
      ctx.fillStyle = `rgba(100, 50, 20, ${opacity})`
      ctx.fillRect(x, y, size, size)
    }
    
    // Add subtle variation
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * 512
      const y = Math.random() * 512
      const radius = 20 + Math.random() * 40
      const opacity = Math.random() * 0.05
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
      gradient.addColorStop(0, `rgba(200, 150, 100, ${opacity})`)
      gradient.addColorStop(1, 'transparent')
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()
    }
    
    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    return texture
  }, [enableTextures])

  // Generate normal map for muscle definition
  const normalMap = useMemo(() => {
    if (!enableTextures) return null
    
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const ctx = canvas.getContext('2d')!
    
    // Base normal color (flat)
    ctx.fillStyle = '#8080ff'
    ctx.fillRect(0, 0, 256, 256)
    
    // Add muscle definition lines
    ctx.strokeStyle = '#9090ff'
    ctx.lineWidth = 2
    for (let i = 0; i < 20; i++) {
      ctx.beginPath()
      ctx.moveTo(Math.random() * 256, Math.random() * 256)
      ctx.lineTo(Math.random() * 256, Math.random() * 256)
      ctx.stroke()
    }
    
    return new THREE.CanvasTexture(canvas)
  }, [enableTextures])

  // Animation
  useFrame((state) => {
    if (!groupRef.current) return
    
    const time = state.clock.elapsedTime
    
    switch (animationStyle) {
      case 'breathe':
        groupRef.current.position.y = Math.sin(time * 2) * 0.02
        groupRef.current.scale.y = 1 + Math.sin(time * 2) * 0.01
        break
      case 'flex':
        groupRef.current.rotation.y = Math.sin(time * 0.5) * 0.2
        break
      case 'idle':
        groupRef.current.position.y = Math.sin(time * 0.5) * 0.005
        break
    }
  })

  // Skin material with optional textures
  const skinMaterial = useMemo(() => {
    const mat = new THREE.MeshPhysicalMaterial({
      color: '#c68642',
      roughness: 0.35,
      metalness: 0.0,
      clearcoat: 0.3,
      clearcoatRoughness: 0.25,
      sheen: 0.25,
      sheenColor: new THREE.Color(0xffe4c4),
      ior: 1.45,
    })
    
    if (skinTexture) {
      mat.map = skinTexture
    }
    if (normalMap) {
      mat.normalMap = normalMap
      mat.normalScale = new THREE.Vector2(0.5, 0.5)
    }
    
    return mat
  }, [skinTexture, normalMap])

  const shirtMaterial = new THREE.MeshPhysicalMaterial({
    color: '#1e3a5f',
    roughness: 0.6,
    metalness: 0.1,
    clearcoat: 0.2,
  })

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      {/* Head */}
      <mesh position={[0, 2.2, 0]} castShadow>
        <capsuleGeometry args={[0.26, 0.35, 8, 16]} />
        <primitive object={skinMaterial} attach="material" />
      </mesh>

      {/* Torso */}
      <group position={[0, 1.6, 0]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.28 * muscleScale, 0.5, 8, 16]} />
          <primitive object={shirtMaterial} attach="material" />
        </mesh>
        
        {/* Chest muscles */}
        {strength > 30 && (
          <>
            <mesh position={[-0.12, 0.15, 0.2]} castShadow>
              <sphereGeometry args={[0.1 * muscleScale, 12, 12]} />
              <primitive object={skinMaterial} attach="material" />
            </mesh>
            <mesh position={[0.12, 0.15, 0.2]} castShadow>
              <sphereGeometry args={[0.1 * muscleScale, 12, 12]} />
              <primitive object={skinMaterial} attach="material" />
            </mesh>
          </>
        )}
      </group>

      {/* Arms */}
      <group position={[-0.4, 1.7, 0]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.09 * muscleScale, 0.5, 8, 16]} />
          <primitive object={skinMaterial} attach="material" />
        </mesh>
      </group>
      <group position={[0.4, 1.7, 0]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.09 * muscleScale, 0.5, 8, 16]} />
          <primitive object={skinMaterial} attach="material" />
        </mesh>
      </group>

      {/* Legs */}
      <group position={[-0.15, 0.8, 0]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.12 * muscleScale, 0.7, 8, 16]} />
          <primitive object={skinMaterial} attach="material" />
        </mesh>
      </group>
      <group position={[0.15, 0.8, 0]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.12 * muscleScale, 0.7, 8, 16]} />
          <primitive object={skinMaterial} attach="material" />
        </mesh>
      </group>
    </group>
  )
}

// ============================================
// LIGHTING RIGS
// ============================================
function StudioLighting({ type }: { type: 'basic' | 'cinematic' | 'dramatic' }) {
  const { scene } = useThree()
  
  useEffect(() => {
    // Clear existing lights
    scene.children.filter(c => c instanceof THREE.Light).forEach(l => scene.remove(l))
    
    switch (type) {
      case 'basic':
        scene.add(new THREE.AmbientLight(0xffffff, 0.5))
        const main = new THREE.DirectionalLight(0xffffff, 1)
        main.position.set(3, 5, 3)
        main.castShadow = true
        scene.add(main)
        break
        
      case 'cinematic':
        // Key light
        const key = new THREE.SpotLight(0xfff0dd, 2)
        key.position.set(4, 6, 4)
        key.angle = Math.PI / 6
        key.penumbra = 0.3
        key.castShadow = true
        scene.add(key)
        
        // Fill light
        const fill = new THREE.DirectionalLight(0xddeeff, 0.5)
        fill.position.set(-3, 2, 3)
        scene.add(fill)
        
        // Rim light
        const rim = new THREE.SpotLight(0x88ccff, 1.5)
        rim.position.set(0, 4, -4)
        rim.lookAt(0, 0, 0)
        scene.add(rim)
        
        // Ambient
        scene.add(new THREE.AmbientLight(0x404040, 0.3))
        break
        
      case 'dramatic':
        // Strong key from side
        const dramaticKey = new THREE.SpotLight(0xffaa77, 3)
        dramaticKey.position.set(5, 3, 2)
        dramaticKey.angle = Math.PI / 8
        dramaticKey.penumbra = 0.2
        dramaticKey.castShadow = true
        scene.add(dramaticKey)
        
        // Blue fill
        const blueFill = new THREE.DirectionalLight(0x4466ff, 0.3)
        blueFill.position.set(-3, 1, 3)
        scene.add(blueFill)
        
        // Minimal ambient
        scene.add(new THREE.AmbientLight(0x202020, 0.2))
        break
    }
  }, [type, scene])
  
  return null
}

// ============================================
// MAIN PAGE
// ============================================
export default function AvatarEnhancementLab() {
  const [strength, setStrength] = useState(50)
  const [enableTextures, setEnableTextures] = useState(false)
  const [enableAdvancedLighting, setEnableAdvancedLighting] = useState(false)
  const [lightingType, setLightingType] = useState<'basic' | 'cinematic' | 'dramatic'>('basic')
  const [animationStyle, setAnimationStyle] = useState<'idle' | 'breathe' | 'flex'>('breathe')
  const [enablePostProcessing, setEnablePostProcessing] = useState(true)

  return (
    <div className="min-h-screen bg-gray-900">
      <NavBar role="client" backLink="/client/rpg" backText="← Back" />
      
      <main className="max-w-7xl mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">🧪 Avatar Enhancement Lab</h1>
          <p className="text-gray-400">Test features before integrating into main avatars</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 3D Viewport */}
          <div className="lg:col-span-2 bg-black rounded-xl overflow-hidden" style={{ height: '600px' }}>
            <Canvas
              shadows
              camera={{ position: [0, 0, 5], fov: 35 }}
              gl={{ 
                antialias: true, 
                alpha: true,
                toneMapping: THREE.ACESFilmicToneMapping,
              }}
            >
              <StudioLighting type={lightingType} />
              
              {enableAdvancedLighting && (
                <Environment preset="studio" />
              )}
              
              <TestAvatar 
                strength={strength}
                enableTextures={enableTextures}
                enableAdvancedLighting={enableAdvancedLighting}
                animationStyle={animationStyle}
              />
              
              {/* Ground */}
              <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[10, 10]} />
                <meshStandardMaterial color="#1a1a2e" roughness={0.8} />
              </mesh>
              
              {enablePostProcessing && (
                <EffectComposer>
                  <Bloom intensity={0.3} luminanceThreshold={0.7} />
                  <SSAO samples={16} radius={0.4} intensity={15} />
                </EffectComposer>
              )}
              
              <OrbitControls 
                enablePan={false} 
                minDistance={3} 
                maxDistance={8}
                autoRotate
                autoRotateSpeed={0.5}
              />
            </Canvas>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            {/* Strength */}
            <div className="bg-gray-800 rounded-lg p-4">
              <label className="block text-sm font-bold text-white mb-2">
                💪 Muscle Level: {strength}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={strength}
                onChange={(e) => setStrength(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Textures */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-sm font-bold text-white mb-3">🎨 Textures</h3>
              <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableTextures}
                  onChange={(e) => setEnableTextures(e.target.checked)}
                  className="w-4 h-4"
                />
                Enable Procedural Skin Textures
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Generates pores & skin variation via Canvas API
              </p>
            </div>

            {/* Lighting */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-sm font-bold text-white mb-3">💡 Lighting</h3>
              <div className="space-y-2">
                {(['basic', 'cinematic', 'dramatic'] as const).map((type) => (
                  <label key={type} className="flex items-center gap-2 text-gray-300 cursor-pointer">
                    <input
                      type="radio"
                      name="lighting"
                      checked={lightingType === type}
                      onChange={() => setLightingType(type)}
                      className="w-4 h-4"
                    />
                    <span className="capitalize">{type}</span>
                  </label>
                ))}
              </div>
              <label className="flex items-center gap-2 text-gray-300 cursor-pointer mt-3">
                <input
                  type="checkbox"
                  checked={enableAdvancedLighting}
                  onChange={(e) => setEnableAdvancedLighting(e.target.checked)}
                  className="w-4 h-4"
                />
                Environment Map
              </label>
            </div>

            {/* Animation */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-sm font-bold text-white mb-3">🏃 Animation</h3>
              <div className="grid grid-cols-3 gap-2">
                {(['idle', 'breathe', 'flex'] as const).map((style) => (
                  <button
                    key={style}
                    onClick={() => setAnimationStyle(style)}
                    className={`px-3 py-2 rounded text-sm capitalize transition-colors ${
                      animationStyle === style
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* Post-Processing */}
            <div className="bg-gray-800 rounded-lg p-4">
              <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enablePostProcessing}
                  onChange={(e) => setEnablePostProcessing(e.target.checked)}
                  className="w-4 h-4"
                />
                Enable Post-Processing (Bloom + SSAO)
              </label>
            </div>

            {/* Status */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg p-4 text-white">
              <h3 className="font-bold mb-2">📊 Current Config</h3>
              <div className="text-sm space-y-1">
                <p>Muscle: {strength}%</p>
                <p>Textures: {enableTextures ? '✅ ON' : '❌ OFF'}</p>
                <p>Lighting: {lightingType}</p>
                <p>Animation: {animationStyle}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

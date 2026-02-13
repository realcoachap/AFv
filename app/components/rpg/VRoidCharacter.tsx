'use client'

/**
 * VRoid Character Component
 * Loads and displays VRoid/VRM characters in Three.js
 * Supports animations and customization
 */

import { useRef, useEffect, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations, OrbitControls, Environment, ContactShadows, Center } from '@react-three/drei'
import * as THREE from 'three'

interface VRoidCharacterProps {
  // Model URL (.glb or .vrm converted to .glb)
  modelUrl: string
  
  // Animation
  animationUrl?: string  // Optional separate animation file
  animationName?: string
  autoRotate?: boolean
  
  // Appearance
  scale?: number
  position?: [number, number, number]
  rotation?: [number, number, number]
  
  // Lighting
  envPreset?: 'studio' | 'city' | 'sunset' | 'dawn' | 'forest' | 'warehouse'
  
  // Interactive
  enableOrbit?: boolean
  
  // Stats display
  showStats?: boolean
  level?: number
  characterName?: string
}

// Mobile detection hook
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  return isMobile
}

// The 3D character component
function CharacterModel({
  modelUrl,
  animationUrl,
  animationName = 'Idle',
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  autoRotate = false
}: Omit<VRoidCharacterProps, 'envPreset' | 'enableOrbit' | 'showStats' | 'level' | 'characterName'>) {
  const groupRef = useRef<THREE.Group>(null)
  const { scene, animations } = useGLTF(modelUrl)
  const { actions } = useAnimations(animations, groupRef)
  
  // Clone scene only once and memoize it
  const clonedScene = useMemo(() => {
    const clone = scene.clone()
    return clone
  }, [scene])
  
  // Cleanup cloned scene on unmount
  useEffect(() => {
    return () => {
      // Dispose of all geometries and materials in the cloned scene
      clonedScene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          if (object.geometry) {
            object.geometry.dispose()
          }
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach((material) => material.dispose())
            } else {
              object.material.dispose()
            }
          }
        }
      })
    }
  }, [clonedScene])
  
  // Play animation
  useEffect(() => {
    if (actions[animationName]) {
      actions[animationName].play()
    }
    return () => {
      if (actions[animationName]) {
        actions[animationName].stop()
      }
    }
  }, [actions, animationName])
  
  // Auto rotation
  useFrame((state) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3
    }
  })
  
  return (
    <group 
      ref={groupRef}
      position={position}
      rotation={rotation}
      scale={[scale, scale, scale]}
    >
      <primitive object={clonedScene} />
    </group>
  )
}

// Main export component
export default function VRoidCharacter({
  modelUrl,
  animationUrl,
  animationName = 'Idle',
  autoRotate = true,
  scale = 1,
  position = [0, -1, 0],
  rotation = [0, 0, 0],
  envPreset = 'studio',
  enableOrbit = true,
  showStats = true,
  level = 1,
  characterName = 'Athlete'
}: VRoidCharacterProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const isMobile = useIsMobile()
  
  // Preload model
  useEffect(() => {
    useGLTF.preload(modelUrl)
  }, [modelUrl])
  
  // Reduce shadow resolution on mobile
  const shadowMapSize = isMobile ? 512 : 1024
  
  return (
    <div className="relative w-full h-full">
      <Canvas
        shadows
        camera={{ position: [0, 1, 3], fov: 45 }}
        gl={{ 
          antialias: !isMobile, 
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0
        }}
        onCreated={() => setIsLoading(false)}
      >
        <Environment preset={envPreset} />
        
        {/* Lighting - reduced on mobile */}
        <ambientLight intensity={isMobile ? 0.6 : 0.4} />
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={isMobile ? 0.7 : 1} 
          castShadow 
          shadow-mapSize={[shadowMapSize, shadowMapSize]}
        />
        <directionalLight position={[-5, 2, 5]} intensity={isMobile ? 0.3 : 0.5} />
        <directionalLight position={[0, 5, -5]} intensity={isMobile ? 0.2 : 0.3} />
        <Center>
          <CharacterModel
            modelUrl={modelUrl}
            animationUrl={animationUrl}
            animationName={animationName}
            scale={scale}
            position={position}
            rotation={rotation}
            autoRotate={autoRotate}
          />
        </Center>
        
        <ContactShadows
          position={[0, -1.5, 0]}
          opacity={isMobile ? 0.3 : 0.5}
          scale={8}
          blur={isMobile ? 1.5 : 2}
          far={3}
          resolution={isMobile ? 128 : 256}
        />
        
        {enableOrbit && (
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            minDistance={2}
            maxDistance={6}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 1.8}
            autoRotate={autoRotate}
            autoRotateSpeed={isMobile ? 0.3 : 0.5}
          />
        )}
      </Canvas>
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 z-10">
          <div className="text-center">
            <div className="w-12 h-12 border-3 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white">Loading VRoid Character...</p>
          </div>
        </div>
      )}
      
      {/* Error overlay */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/90 z-10">
          <div className="text-center text-red-400 p-4">
            <p className="font-bold mb-2">Failed to load character</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}
      
      {/* Stats overlay */}
      {showStats && (
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <div className="bg-black/70 backdrop-blur-md rounded-xl p-4 border border-purple-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-bold text-lg">{characterName}</p>
                <p className="text-purple-400 text-sm">VRoid Character</p>
              </div>
              
              <div className="text-right">
                <p className="text-2xl font-bold text-white">Lvl {level}</p>
                <div className="flex items-center gap-1 text-yellow-400 text-sm">
                  <span>★★★☆☆</span>
                </div>
              </div>
            </div>
            
            <div className="mt-3 flex gap-2">
              <span className="px-2 py-1 bg-blue-600/30 text-blue-400 rounded text-xs">💪 Strength: High</span>
              <span className="px-2 py-1 bg-green-600/30 text-green-400 rounded text-xs">🏃 Endurance: Elite</span>
              <span className="px-2 py-1 bg-purple-600/30 text-purple-400 rounded text-xs">🎯 Discipline: 85</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Preset character configurations
export const VRoidPresets = {
  athleticMale: {
    scale: 0.9,
    position: [0, -1, 0] as [number, number, number],
    characterName: 'Athletic Trainer',
    level: 25
  },
  athleticFemale: {
    scale: 0.85,
    position: [0, -0.95, 0] as [number, number, number],
    characterName: 'Elite Athlete',
    level: 30
  },
  beginner: {
    scale: 0.9,
    position: [0, -1, 0] as [number, number, number],
    characterName: 'New Member',
    level: 1
  }
}

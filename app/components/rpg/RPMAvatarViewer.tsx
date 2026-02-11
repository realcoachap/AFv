'use client'

/**
 * Ready Player Me Avatar Viewer
 * Loads and displays RPM .glb avatars in Three.js
 */

import { useRef, useState, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { 
  useGLTF, 
  OrbitControls, 
  Environment, 
  ContactShadows,
  Center
} from '@react-three/drei'
import * as THREE from 'three'

interface RPMAvatarViewerProps {
  avatarUrl: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  autoRotate?: boolean
  showStats?: boolean
}

// Component to load and display the RPM avatar
function RPMAvatar({ url }: { url: string }) {
  const groupRef = useRef<THREE.Group>(null)
  
  // Load the GLB model
  const { scene } = useGLTF(url)
  
  // Clone the scene so we can modify it
  const avatarScene = scene.clone()
  
  // Apply some optimizations
  avatarScene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.castShadow = true
      child.receiveShadow = true
    }
  })
  
  // Idle animation
  useFrame((state) => {
    if (groupRef.current) {
      // Subtle breathing animation
      const breathe = Math.sin(state.clock.elapsedTime * 0.8) * 0.01
      groupRef.current.position.y = breathe
      
      // Slow rotation
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.05
    }
  })
  
  return (
    <group ref={groupRef}>
      <primitive object={avatarScene} scale={1.5} />
    </group>
  )
}

// Loading fallback
function LoadingAvatar() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400">Loading Avatar...</p>
      </div>
    </div>
  )
}

export default function RPMAvatarViewer({ 
  avatarUrl, 
  size = 'lg',
  autoRotate = true,
  showStats = true
}: RPMAvatarViewerProps) {
  const sizes = {
    sm: { width: 240, height: 340 },
    md: { width: 300, height: 440 },
    lg: { width: 380, height: 560 },
    xl: { width: 440, height: 640 },
  }
  
  const { width, height } = sizes[size]
  
  return (
    <div style={{ width, height }} className="relative bg-gray-800 rounded-2xl overflow-hidden">
      <Canvas
        shadows
        camera={{ position: [0, 0.5, 4], fov: 35 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0
        }}
      >
        <Environment preset="studio" />
        
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={1} 
          castShadow 
          shadow-mapSize={[1024, 1024]}
        />
        
        <directionalLight position={[-5, 2, 5]} intensity={0.5} />
        
        <directionalLight position={[0, 5, -5]} intensity={0.3} />
        
        {/* Avatar */}
        <Center>
          <Suspense fallback={null}>
            <RPMAvatar url={avatarUrl} />
          </Suspense>
        </Center>
        
        {/* Ground */}
        <ContactShadows
          position={[0, -1.5, 0]}
          opacity={0.4}
          scale={10}
          blur={2}
          far={3}
        />
        
        {/* Controls */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 2.5}
          maxPolarAngle={Math.PI / 1.8}
          autoRotate={autoRotate}
          autoRotateSpeed={0.5}
        />
      </Canvas>
      
      {/* Loading Overlay */}
      <Suspense fallback={<div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 z-10">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white">Loading Avatar...</p>
        </div>
      </div>} />
      
      {showStats && (
        <div className="absolute bottom-3 left-3 right-3 z-10">
          <div className="bg-black/70 backdrop-blur-md rounded-lg p-3 border border-gray-700/50">
            <div className="flex items-center justify-between">
              <span className="text-white font-bold">Ready Player Me</span>
              <span className="text-green-400 text-sm">✓ Loaded</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Preload function for better performance
export function preloadAvatar(url: string) {
  useGLTF.preload(url)
}

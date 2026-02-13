'use client'

/**
 * ThreeTest - Minimal Three.js Test Component
 * Tests if basic Three.js + React Three Fiber setup works
 */

import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei'
import { EffectComposer, Bloom, SSAO } from '@react-three/postprocessing'
import * as THREE from 'three'

// Simple rotating cube component
function RotatingCube() {
  const meshRef = useRef<THREE.Mesh>(null)

  // Rotate the cube on each frame
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.5
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3
    }
  })

  return (
    <mesh ref={meshRef} castShadow>
      <boxGeometry args={[1.5, 1.5, 1.5]} />
      <meshStandardMaterial color="#ff3333" roughness={0.3} metalness={0.1} />
    </mesh>
  )
}

// Simple lighting setup
function SimpleLighting() {
  return (
    <>
      <directionalLight position={[5, 5, 5]} intensity={500} castShadow />
      <ambientLight intensity={0.5} />
    </>
  )
}

// Main test component
export default function ThreeTest() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-[400px] h-[400px] bg-gray-900 flex items-center justify-center text-white">Loading Three.js...</div>
  }

  return (
    <div className="w-[400px] h-[400px] relative">
      <Canvas
        shadows
        camera={{ position: [3, 3, 5], fov: 45 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0
        }}
      >
        <SimpleLighting />
        <Environment preset="studio" />
        
        <RotatingCube />
        
        <ContactShadows
          position={[0, -1, 0]}
          opacity={0.5}
          scale={10}
          blur={2}
        />
        
        {/* Post-processing test */}
        <EffectComposer>
          <Bloom 
            intensity={0.5}
            luminanceThreshold={0.8}
            luminanceSmoothing={0.4}
          />
        </EffectComposer>
        
        <OrbitControls enableZoom={true} />
      </Canvas>
      
      <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
        Three.js Test - Red Cube
      </div>
    </div>
  )
}

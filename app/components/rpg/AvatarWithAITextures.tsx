'use client'

/**
 * Avatar with AI-Generated Textures
 * Applies AI-generated face textures to the procedural mesh
 */

import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows, Center } from '@react-three/drei'
import * as THREE from 'three'

interface AvatarWithAITexturesProps {
  // AI Generated textures
  diffuseTextureUrl: string
  normalTextureUrl?: string
  roughnessTextureUrl?: string
  
  // Stats for body shape
  strength: number
  endurance: number
  level: number
  
  // Display options
  size?: 'sm' | 'md' | 'lg' | 'xl'
  autoRotate?: boolean
}

// The actual 3D avatar component
function AvatarMesh({ 
  diffuseTextureUrl,
  normalTextureUrl,
  roughnessTextureUrl,
  strength,
  endurance
}: {
  diffuseTextureUrl: string
  normalTextureUrl?: string
  roughnessTextureUrl?: string
  strength: number
  endurance: number
}) {
  const groupRef = useRef<THREE.Group>(null)
  const { scene } = useThree()
  
  // Load textures
  const textures = useMemo(() => {
    const loader = new THREE.TextureLoader()
    
    return {
      diffuse: loader.load(diffuseTextureUrl),
      normal: normalTextureUrl ? loader.load(normalTextureUrl) : null,
      roughness: roughnessTextureUrl ? loader.load(roughnessTextureUrl) : null,
    }
  }, [diffuseTextureUrl, normalTextureUrl, roughnessTextureUrl])
  
  // Configure textures
  useEffect(() => {
    Object.values(textures).forEach(tex => {
      if (tex) {
        tex.wrapS = THREE.RepeatWrapping
        tex.wrapT = THREE.RepeatWrapping
        tex.repeat.set(1, 1)
      }
    })
  }, [textures])
  
  // Body metrics based on stats
  const metrics = useMemo(() => {
    const muscle = strength / 100
    const lean = endurance / 100
    
    return {
      scale: 0.9 + muscle * 0.25,
      width: 0.85 + muscle * 0.2,
    }
  }, [strength, endurance])
  
  // Animation
  useFrame((state) => {
    if (groupRef.current) {
      const breathe = Math.sin(state.clock.elapsedTime * 0.8) * 0.006
      groupRef.current.position.y = -0.8 + breathe
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.03
    }
  })
  
  // AI-enhanced skin material
  const skinMaterial = useMemo(() => {
    const mat = new THREE.MeshPhysicalMaterial({
      map: textures.diffuse,
      normalMap: textures.normal || undefined,
      roughnessMap: textures.roughness || undefined,
      
      // Enhanced properties for realistic skin
      roughness: 0.4,
      metalness: 0,
      clearcoat: 0.3,
      clearcoatRoughness: 0.2,
      
      // Subsurface scattering for skin translucency
      transmission: 0.1,
      thickness: 0.5,
      
      // Sheen for soft skin reflection
      sheen: 0.3,
      sheenColor: new THREE.Color(0xffdbac),
      sheenRoughness: 0.5,
    })
    
    return mat
  }, [textures])
  
  return (
    <group ref={groupRef} scale={[metrics.width, metrics.scale, metrics.width]}>
      {/* HEAD with AI texture */}
      <group position={[0, 2.1, 0]}>
        {/* Main head geometry */}
        <mesh castShadow>
          <capsuleGeometry args={[0.26, 0.35, 8, 16]} />
          <primitive object={skinMaterial} attach="material" />
        </mesh>
        
        {/* Jaw */}
        <mesh position={[0, -0.22, 0.08]} castShadow>
          <sphereGeometry args={[0.2, 16, 16]} />
          <primitive object={skinMaterial} attach="material" />
        </mesh>
        
        {/* Eyes */}
        <Eye position={[-0.09, 0.02, 0.22]} />
        <Eye position={[0.09, 0.02, 0.22]} />
        
        {/* Nose */}
        <mesh position={[0, -0.05, 0.28]} castShadow>
          <sphereGeometry args={[0.055, 12, 12]} />
          <primitive object={skinMaterial} attach="material" />
        </mesh>
        
        {/* Mouth */}
        <mesh position={[0, -0.18, 0.22]}>
          <boxGeometry args={[0.12, 0.025, 0.02]} />
          <meshStandardMaterial color="#c97e7e" />
        </mesh>
      </group>
      
      {/* BODY */}
      <group position={[0, 1.15, 0]}>
        {/* Torso */}
        <mesh castShadow>
          <capsuleGeometry args={[0.28, 0.45, 8, 16]} />
          <meshStandardMaterial color="#1e3a5f" roughness={0.7} />
        </mesh>
        
        {/* Abs area - uses skin material */}
        <mesh position={[0, -0.35, 0]} castShadow>
          <capsuleGeometry args={[0.22, 0.35, 8, 16]} />
          <primitive object={skinMaterial} attach="material" />
        </mesh>
      </group>
      
      {/* ARMS */}
      <Arm side="left" strength={strength} skinMaterial={skinMaterial} />
      <Arm side="right" strength={strength} skinMaterial={skinMaterial} />
      
      {/* LEGS */}
      <Leg side="left" strength={strength} />
      <Leg side="right" strength={strength} />
    </group>
  )
}

// Eye component
function Eye({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>
      <mesh position={[0, 0, 0.035]}>
        <circleGeometry args={[0.024, 12]} />
        <meshStandardMaterial color="#4a3728" />
      </mesh>
      <mesh position={[0, 0, 0.042]}>
        <circleGeometry args={[0.012, 8]} />
        <meshBasicMaterial color="#000" />
      </mesh>
    </group>
  )
}

// Arm component
function Arm({ side, strength, skinMaterial }: { side: 'left' | 'right'; strength: number; skinMaterial: THREE.Material }) {
  const xOffset = side === 'left' ? -0.38 : 0.38
  const muscleScale = 0.8 + (strength / 100) * 0.3
  
  return (
    <group position={[xOffset, 1.35, 0]}>
      <mesh castShadow>
        <sphereGeometry args={[0.16 * muscleScale, 16, 16]} />
        <meshStandardMaterial color="#1e3a5f" roughness={0.7} />
      </mesh>
      
      <mesh position={[0, -0.32, 0]} castShadow>
        <capsuleGeometry args={[0.09 * muscleScale, 0.45, 8, 16]} />
        <primitive object={skinMaterial} attach="material" />
      </mesh>
      
      <mesh position={[0, -0.95, 0]} castShadow>
        <capsuleGeometry args={[0.07 * muscleScale, 0.45, 8, 16]} />
        <primitive object={skinMaterial} attach="material" />
      </mesh>
    </group>
  )
}

// Leg component
function Leg({ side, strength }: { side: 'left' | 'right'; strength: number }) {
  const xOffset = side === 'left' ? -0.16 : 0.16
  const muscleScale = 0.85 + (strength / 100) * 0.25
  
  return (
    <group position={[xOffset, 0.3, 0]}>
      <mesh position={[0, -0.25, 0]} castShadow>
        <capsuleGeometry args={[0.14 * muscleScale, 0.55, 8, 16]} />
        <meshStandardMaterial color="#c68642" roughness={0.5} />
      </mesh>
      
      <mesh position={[0, -1.0, -0.02]} castShadow>
        <capsuleGeometry args={[0.1 * muscleScale, 0.5, 8, 16]} />
        <meshStandardMaterial color="#c68642" roughness={0.5} />
      </mesh>
    </group>
  )
}

// Main export component
export default function AvatarWithAITextures({
  diffuseTextureUrl,
  normalTextureUrl,
  roughnessTextureUrl,
  strength,
  endurance,
  level,
  size = 'lg',
  autoRotate = true
}: AvatarWithAITexturesProps) {
  const sizes = {
    sm: { width: 280, height: 400 },
    md: { width: 340, height: 480 },
    lg: { width: 400, height: 560 },
    xl: { width: 480, height: 640 },
  }
  
  const { width, height } = sizes[size]
  
  return (
    <div style={{ width, height }} className="relative bg-gray-800 rounded-2xl overflow-hidden">
      <Canvas
        shadows
        camera={{ position: [0, 0.2, 5.5], fov: 30 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0
        }}
      >
        <Environment preset="studio" />
        
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={1} 
          castShadow 
          shadow-mapSize={[1024, 1024]}
        />
        <directionalLight position={[-5, 2, 5]} intensity={0.5} />
        <directionalLight position={[0, 5, -5]} intensity={0.3} />
        
        <Center>
          <AvatarMesh 
            diffuseTextureUrl={diffuseTextureUrl}
            normalTextureUrl={normalTextureUrl}
            roughnessTextureUrl={roughnessTextureUrl}
            strength={strength}
            endurance={endurance}
          />
        </Center>
        
        <ContactShadows
          position={[0, -2.2, 0]}
          opacity={0.5}
          scale={12}
          blur={2.5}
          far={4}
        />
        
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 2.5}
          maxPolarAngle={Math.PI / 1.8}
          autoRotate={autoRotate}
          autoRotateSpeed={0.5}
        />
      </Canvas>
      
      {/* Stats overlay */}
      <div className="absolute bottom-3 left-3 right-3 z-10">
        <div className="bg-black/70 backdrop-blur-md rounded-lg p-3 border border-purple-500/50">
          <div className="flex items-center justify-between">
            <span className="text-white font-bold">Lvl {level}</span>
            <span className="text-purple-400 text-sm">🧠 AI Enhanced</span>
          </div>
          <div className="mt-2 flex gap-2">
            <span className="text-xs text-green-400">✓ Your face texture applied</span>
          </div>
        </div>
      </div>
    </div>
  )
}

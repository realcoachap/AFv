'use client'

/**
 * 3D Avatar Component - React Three Fiber
 * Fully interactive 3D character that evolves with stats
 */

import { useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import { getStatModifiers } from '@/app/lib/rpg/stats'
import { parseAvatarConfig, DEFAULT_CUSTOMIZATION } from '@/app/lib/rpg/customization'
import type { AvatarCustomization } from '@/app/lib/rpg/customization'

type Avatar3DProps = {
  strength: number
  endurance: number
  discipline: number
  colorScheme?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  autoRotate?: boolean
  customization?: AvatarCustomization
}

// Aura particle system
function AuraParticles({ intensity, color }: { intensity: number; color: string }) {
  const particlesRef = useRef<THREE.Points>(null)
  
  const particleCount = Math.floor(intensity * 50)
  
  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    const scales = new Float32Array(particleCount)
    
    for (let i = 0; i < particleCount; i++) {
      // Create sphere of particles around character
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      const radius = 1.5 + Math.random() * 0.5
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) + 1
      positions[i * 3 + 2] = radius * Math.cos(phi)
      
      scales[i] = Math.random() * 0.5 + 0.5
    }
    
    return { positions, scales }
  }, [particleCount])
  
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.2
    }
  })
  
  if (intensity === 0) return null
  
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(particles.positions, 3))
    geo.setAttribute('scale', new THREE.BufferAttribute(particles.scales, 1))
    return geo
  }, [particles])
  
  return (
    <points ref={particlesRef} geometry={geometry}>
      <pointsMaterial
        size={0.08}
        color={color}
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// 3D Character Model
function Character3D({
  strength,
  endurance,
  discipline,
  colorScheme,
  customization,
}: {
  strength: number
  endurance: number
  discipline: number
  colorScheme: string
  customization?: AvatarCustomization
}) {
  const groupRef = useRef<THREE.Group>(null)
  const modifiers = getStatModifiers(strength, endurance, discipline)
  
  // Parse customization (use defaults if not provided)
  const config = customization || DEFAULT_CUSTOMIZATION
  
  // Idle breathing animation
  useFrame((state) => {
    if (groupRef.current) {
      const breathe = Math.sin(state.clock.elapsedTime * 2) * 0.02
      groupRef.current.scale.y = 1 + breathe
    }
  })
  
  // Color schemes
  const colors = {
    navy: { primary: '#1A2332', secondary: '#E8DCC4', accent: '#00D9FF' },
    black: { primary: '#000000', secondary: '#FFFFFF', accent: '#FF0000' },
    red: { primary: '#DC2626', secondary: '#FEE2E2', accent: '#991B1B' },
    blue: { primary: '#2563EB', secondary: '#DBEAFE', accent: '#1E40AF' },
  }
  
  const scheme = colors[colorScheme as keyof typeof colors] || colors.navy
  
  // Use customized skin tone
  const skinColor = config.skinTone
  
  // Body proportions based on stats
  const getBodyScale = () => {
    const base = {
      shoulderWidth: 1.0,
      chestDepth: 1.0,
      armThickness: 1.0,
      legThickness: 1.0,
      waistWidth: 0.85,
    }
    
    // Strength increases bulk
    const strengthBonus = strength / 100
    const muscleMultiplierMap: Record<string, number> = {
      huge: 1.6,
      muscular: 1.4,
      defined: 1.2,
      normal: 1.0,
    }
    const muscleMultiplier = muscleMultiplierMap[modifiers.muscleTier] || 1.0
    
    // Endurance makes leaner
    const enduranceBonus = endurance / 100
    const leannessMultiplierMap: Record<string, number> = {
      shredded: 0.75,
      athletic: 0.85,
      lean: 0.95,
      standard: 1.0,
    }
    const leannessMultiplier = leannessMultiplierMap[modifiers.leannessTier] || 1.0
    
    return {
      shoulderWidth: base.shoulderWidth * muscleMultiplier,
      chestDepth: base.chestDepth * muscleMultiplier,
      armThickness: base.armThickness * muscleMultiplier * leannessMultiplier,
      legThickness: base.legThickness * (1 + strengthBonus * 0.3) * leannessMultiplier,
      waistWidth: base.waistWidth * leannessMultiplier,
    }
  }
  
  const body = getBodyScale()
  
  // Aura intensity based on discipline
  const auraIntensityMap: Record<string, number> = {
    radiant: 1.0,
    bright: 0.7,
    faint: 0.4,
    none: 0,
  }
  const auraIntensity = auraIntensityMap[modifiers.auraTier] || 0
  
  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      {/* Aura particles */}
      <AuraParticles intensity={auraIntensity} color={scheme.accent} />
      
      {/* Head */}
      <mesh position={[0, 2.2, 0]} castShadow>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>
      
      {/* Hair */}
      {config.hairStyle !== 'bald' && (
        <>
          {/* Hair - different styles */}
          {config.hairStyle === 'short' && (
            <mesh position={[0, 2.4, 0]} castShadow>
              <sphereGeometry args={[0.38, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
              <meshStandardMaterial color={config.hairColor} />
            </mesh>
          )}
          {config.hairStyle === 'buzz' && (
            <mesh position={[0, 2.38, 0]} castShadow>
              <sphereGeometry args={[0.36, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
              <meshStandardMaterial color={config.hairColor} />
            </mesh>
          )}
          {config.hairStyle === 'medium' && (
            <>
              <mesh position={[0, 2.42, 0]} castShadow>
                <sphereGeometry args={[0.4, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.7]} />
                <meshStandardMaterial color={config.hairColor} />
              </mesh>
              {/* Side hair */}
              <mesh position={[0.25, 2.15, 0]} castShadow>
                <boxGeometry args={[0.1, 0.3, 0.3]} />
                <meshStandardMaterial color={config.hairColor} />
              </mesh>
              <mesh position={[-0.25, 2.15, 0]} castShadow>
                <boxGeometry args={[0.1, 0.3, 0.3]} />
                <meshStandardMaterial color={config.hairColor} />
              </mesh>
            </>
          )}
          {config.hairStyle === 'long' && (
            <>
              <mesh position={[0, 2.42, 0]} castShadow>
                <sphereGeometry args={[0.41, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.7]} />
                <meshStandardMaterial color={config.hairColor} />
              </mesh>
              {/* Long side hair */}
              <mesh position={[0.28, 2.0, 0]} castShadow>
                <boxGeometry args={[0.12, 0.5, 0.35]} />
                <meshStandardMaterial color={config.hairColor} />
              </mesh>
              <mesh position={[-0.28, 2.0, 0]} castShadow>
                <boxGeometry args={[0.12, 0.5, 0.35]} />
                <meshStandardMaterial color={config.hairColor} />
              </mesh>
            </>
          )}
          {config.hairStyle === 'mohawk' && (
            <mesh position={[0, 2.5, 0]} castShadow rotation={[0, 0, 0]}>
              <boxGeometry args={[0.15, 0.5, 0.4]} />
              <meshStandardMaterial color={config.hairColor} />
            </mesh>
          )}
          {config.hairStyle === 'afro' && (
            <mesh position={[0, 2.35, 0]} castShadow>
              <sphereGeometry args={[0.5, 32, 32]} />
              <meshStandardMaterial color={config.hairColor} />
            </mesh>
          )}
          {config.hairStyle === 'dreads' && (
            <>
              <mesh position={[0, 2.42, 0]} castShadow>
                <sphereGeometry args={[0.38, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
                <meshStandardMaterial color={config.hairColor} />
              </mesh>
              {/* Dread strands */}
              {[-0.25, -0.12, 0, 0.12, 0.25].map((x, i) => (
                <mesh key={i} position={[x, 1.8, 0]} castShadow>
                  <cylinderGeometry args={[0.03, 0.03, 0.6, 8]} />
                  <meshStandardMaterial color={config.hairColor} />
                </mesh>
              ))}
            </>
          )}
          {config.hairStyle === 'ponytail' && (
            <>
              <mesh position={[0, 2.42, 0]} castShadow>
                <sphereGeometry args={[0.39, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.65]} />
                <meshStandardMaterial color={config.hairColor} />
              </mesh>
              {/* Ponytail back */}
              <mesh position={[0, 2.1, -0.25]} castShadow>
                <cylinderGeometry args={[0.06, 0.04, 0.4, 16]} />
                <meshStandardMaterial color={config.hairColor} />
              </mesh>
            </>
          )}
          {config.hairStyle === 'spiky' && (
            <>
              <mesh position={[0, 2.42, 0]} castShadow>
                <sphereGeometry args={[0.37, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
                <meshStandardMaterial color={config.hairColor} />
              </mesh>
              {/* Spikes */}
              {[-0.15, 0, 0.15].map((x, i) => (
                <mesh key={i} position={[x, 2.6, 0]} castShadow>
                  <coneGeometry args={[0.08, 0.25, 8]} />
                  <meshStandardMaterial color={config.hairColor} />
                </mesh>
              ))}
            </>
          )}
        </>
      )}
      
      {/* Eyes */}
      <mesh position={[-0.12, 2.25, 0.3]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color={config.eyeColor} />
      </mesh>
      <mesh position={[0.12, 2.25, 0.3]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color={config.eyeColor} />
      </mesh>
      
      {/* Facial Hair */}
      {config.facialHair === 'stubble' && (
        <>
          <mesh position={[0, 2.05, 0.32]}>
            <boxGeometry args={[0.25, 0.12, 0.05]} />
            <meshStandardMaterial color={config.hairColor} opacity={0.7} transparent />
          </mesh>
        </>
      )}
      {config.facialHair === 'goatee' && (
        <mesh position={[0, 2.0, 0.33]}>
          <boxGeometry args={[0.15, 0.15, 0.06]} />
          <meshStandardMaterial color={config.hairColor} />
        </mesh>
      )}
      {config.facialHair === 'beard' && (
        <>
          <mesh position={[0, 2.05, 0.3]}>
            <boxGeometry args={[0.35, 0.25, 0.15]} />
            <meshStandardMaterial color={config.hairColor} />
          </mesh>
          {/* Chin beard extension */}
          <mesh position={[0, 1.95, 0.32]}>
            <boxGeometry args={[0.3, 0.15, 0.12]} />
            <meshStandardMaterial color={config.hairColor} />
          </mesh>
        </>
      )}
      {config.facialHair === 'mustache' && (
        <>
          <mesh position={[-0.1, 2.12, 0.34]}>
            <boxGeometry args={[0.12, 0.06, 0.04]} />
            <meshStandardMaterial color={config.hairColor} />
          </mesh>
          <mesh position={[0.1, 2.12, 0.34]}>
            <boxGeometry args={[0.12, 0.06, 0.04]} />
            <meshStandardMaterial color={config.hairColor} />
          </mesh>
        </>
      )}
      {config.facialHair === 'van-dyke' && (
        <>
          {/* Mustache */}
          <mesh position={[-0.1, 2.12, 0.34]}>
            <boxGeometry args={[0.12, 0.06, 0.04]} />
            <meshStandardMaterial color={config.hairColor} />
          </mesh>
          <mesh position={[0.1, 2.12, 0.34]}>
            <boxGeometry args={[0.12, 0.06, 0.04]} />
            <meshStandardMaterial color={config.hairColor} />
          </mesh>
          {/* Goatee */}
          <mesh position={[0, 2.0, 0.33]}>
            <boxGeometry args={[0.12, 0.15, 0.06]} />
            <meshStandardMaterial color={config.hairColor} />
          </mesh>
        </>
      )}
      
      {/* Neck */}
      <mesh position={[0, 1.85, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.3, 16]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>
      
      {/* Torso (shirt) */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <boxGeometry args={[0.6 * body.shoulderWidth, 0.9, 0.4 * body.chestDepth]} />
        <meshStandardMaterial color={scheme.primary} />
      </mesh>
      
      {/* Chest accent stripe */}
      <mesh position={[0, 1.4, 0.21 * body.chestDepth]}>
        <boxGeometry args={[0.5 * body.shoulderWidth, 0.08, 0.02]} />
        <meshStandardMaterial color={scheme.accent} emissive={scheme.accent} emissiveIntensity={0.5} />
      </mesh>
      
      {/* Arms */}
      {/* Left shoulder */}
      <mesh position={[-0.35 * body.shoulderWidth, 1.5, 0]} castShadow>
        <sphereGeometry args={[0.12 * body.armThickness, 16, 16]} />
        <meshStandardMaterial color={scheme.primary} />
      </mesh>
      {/* Left upper arm */}
      <mesh position={[-0.35 * body.shoulderWidth, 1.15, 0]} castShadow>
        <cylinderGeometry args={[0.08 * body.armThickness, 0.1 * body.armThickness, 0.5, 16]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>
      {/* Left forearm */}
      <mesh position={[-0.35 * body.shoulderWidth, 0.65, 0]} castShadow>
        <cylinderGeometry args={[0.07 * body.armThickness, 0.06 * body.armThickness, 0.5, 16]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>
      
      {/* Right shoulder */}
      <mesh position={[0.35 * body.shoulderWidth, 1.5, 0]} castShadow>
        <sphereGeometry args={[0.12 * body.armThickness, 16, 16]} />
        <meshStandardMaterial color={scheme.primary} />
      </mesh>
      {/* Right upper arm */}
      <mesh position={[0.35 * body.shoulderWidth, 1.15, 0]} castShadow>
        <cylinderGeometry args={[0.08 * body.armThickness, 0.1 * body.armThickness, 0.5, 16]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>
      {/* Right forearm */}
      <mesh position={[0.35 * body.shoulderWidth, 0.65, 0]} castShadow>
        <cylinderGeometry args={[0.07 * body.armThickness, 0.06 * body.armThickness, 0.5, 16]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>
      
      {/* Waist/shorts */}
      <mesh position={[0, 0.65, 0]} castShadow>
        <boxGeometry args={[0.5 * body.waistWidth, 0.4, 0.35 * body.chestDepth]} />
        <meshStandardMaterial color={scheme.secondary} />
      </mesh>
      
      {/* Legs */}
      {/* Left thigh */}
      <mesh position={[-0.15, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.12 * body.legThickness, 0.1 * body.legThickness, 0.6, 16]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>
      {/* Left calf */}
      <mesh position={[-0.15, -0.3, 0]} castShadow>
        <cylinderGeometry args={[0.1 * body.legThickness, 0.08 * body.legThickness, 0.6, 16]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>
      {/* Left shoe */}
      <mesh position={[-0.15, -0.68, 0.08]} castShadow>
        <boxGeometry args={[0.15, 0.12, 0.3]} />
        <meshStandardMaterial color={scheme.primary} />
      </mesh>
      
      {/* Right thigh */}
      <mesh position={[0.15, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.12 * body.legThickness, 0.1 * body.legThickness, 0.6, 16]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>
      {/* Right calf */}
      <mesh position={[0.15, -0.3, 0]} castShadow>
        <cylinderGeometry args={[0.1 * body.legThickness, 0.08 * body.legThickness, 0.6, 16]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>
      {/* Right shoe */}
      <mesh position={[0.15, -0.68, 0.08]} castShadow>
        <boxGeometry args={[0.15, 0.12, 0.3]} />
        <meshStandardMaterial color={scheme.primary} />
      </mesh>
    </group>
  )
}

// Loading fallback
function LoadingAvatar() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A2332]" />
    </div>
  )
}

// Main component export
export default function Avatar3D({
  strength,
  endurance,
  discipline,
  colorScheme = 'navy',
  size = 'lg',
  autoRotate = true,
  customization,
}: Avatar3DProps) {
  const sizes = {
    sm: { width: 160, height: 200 },
    md: { width: 240, height: 300 },
    lg: { width: 320, height: 400 },
    xl: { width: 400, height: 500 },
  }
  
  const { width, height } = sizes[size]
  
  return (
    <div style={{ width, height }} className="relative">
      <Canvas
        shadows
        camera={{ position: [0, 0.2, 5], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 0.2, 5]} />
          
          {/* Lighting */}
          <ambientLight intensity={0.6} />
          <directionalLight
            position={[5, 5, 5]}
            intensity={0.8}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <spotLight position={[-5, 5, 5]} intensity={0.3} />
          
          {/* Character */}
          <Character3D
            strength={strength}
            endurance={endurance}
            discipline={discipline}
            colorScheme={colorScheme}
            customization={customization}
          />
          
          {/* Ground plane (for shadows) */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.25, 0]} receiveShadow>
            <planeGeometry args={[10, 10]} />
            <shadowMaterial opacity={0.2} />
          </mesh>
          
          {/* Controls */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 2}
            autoRotate={autoRotate}
            autoRotateSpeed={2}
          />
        </Suspense>
      </Canvas>
      
      {/* Loading overlay */}
      <Suspense fallback={<LoadingAvatar />} />
    </div>
  )
}

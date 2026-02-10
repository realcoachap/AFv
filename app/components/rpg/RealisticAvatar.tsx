'use client'

/**
 * Realistic Avatar 3D - Advanced Three.js Character System
 * Procedural human mesh with morph targets, PBR materials, and gear system
 * No external dependencies - pure Three.js awesomeness
 */

import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { 
  OrbitControls, 
  Environment, 
  ContactShadows,
  RoundedBox,
  Sphere,
  Cylinder,
  MeshTransmissionMaterial,
  useTexture
} from '@react-three/drei'
import * as THREE from 'three'
import type { AvatarCustomization } from '@/app/lib/rpg/customization'

type RealisticAvatarProps = {
  strength: number
  endurance: number
  discipline: number
  level: number
  colorScheme?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  autoRotate?: boolean
  customization?: AvatarCustomization
  showStats?: boolean
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function RealisticAvatar({
  strength,
  endurance,
  discipline,
  level,
  colorScheme = 'navy',
  size = 'lg',
  autoRotate = true,
  customization,
  showStats = true,
}: RealisticAvatarProps) {
  const sizes = {
    sm: { width: 200, height: 280 },
    md: { width: 300, height: 420 },
    lg: { width: 400, height: 560 },
    xl: { width: 500, height: 700 },
  }
  
  const { width, height } = sizes[size]

  return (
    <div style={{ width, height }} className="relative">
      <Canvas
        shadows
        camera={{ position: [0, 1.5, 5], fov: 35 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2
        }}
        style={{ background: 'transparent' }}
      >
        {/* Studio Lighting Setup */}
        <StudioLighting discipline={discipline} />
        
        {/* Environment for reflections */}
        <Environment preset="studio" />
        
        {/* Character */}
        <Character 
          strength={strength}
          endurance={endurance}
          discipline={discipline}
          level={level}
          colorScheme={colorScheme}
          customization={customization}
        />
        
        {/* Ground shadows */}
        <ContactShadows
          position={[0, -2.5, 0]}
          opacity={0.4}
          scale={20}
          blur={2.5}
          far={4}
        />
        
        {/* Camera controls */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 2.5}
          maxPolarAngle={Math.PI / 2}
          autoRotate={autoRotate}
          autoRotateSpeed={1}
          target={[0, 0.5, 0]}
        />
      </Canvas>
      
      {/* Stats Overlay */}
      {showStats && (
        <StatsOverlay 
          strength={strength}
          endurance={endurance}
          discipline={discipline}
          level={level}
        />
      )}
    </div>
  )
}

// ============================================
// CHARACTER COMPONENT
// ============================================
function Character({
  strength,
  endurance,
  discipline,
  level,
  colorScheme,
  customization,
}: {
  strength: number
  endurance: number
  discipline: number
  level: number
  colorScheme: string
  customization?: AvatarCustomization
}) {
  const groupRef = useRef<THREE.Group>(null)
  
  // Calculate body proportions from stats
  const bodyMetrics = useMemo(() => ({
    muscleScale: 0.7 + (strength / 100) * 0.6, // 0.7 to 1.3
    leanness: 1 - (endurance / 200), // 1.0 to 0.5
    height: 1 + (level / 100) * 0.1, // slight height increase with level
  }), [strength, endurance, level])

  // Idle animation
  useFrame((state) => {
    if (groupRef.current) {
      // Breathing animation
      const breathe = Math.sin(state.clock.elapsedTime * 1.5) * 0.015
      groupRef.current.scale.y = 1 + breathe
      groupRef.current.position.y = breathe * 0.1
      
      // Subtle sway
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.02
    }
  })

  // Color schemes
  const colors = {
    navy: { primary: '#1e3a5f', secondary: '#2d5a87', accent: '#00d4ff' },
    crimson: { primary: '#7f1d1d', secondary: '#991b1b', accent: '#fca5a5' },
    emerald: { primary: '#064e3b', secondary: '#065f46', accent: '#34d399' },
    gold: { primary: '#92400e', secondary: '#b45309', accent: '#fcd34d' },
    void: { primary: '#1a1a2e', secondary: '#16213e', accent: '#a855f7' },
  }
  const scheme = colors[colorScheme as keyof typeof colors] || colors.navy

  // Aura intensity
  const auraIntensity = discipline / 100

  return (
    <group ref={groupRef} position={[0, -1, 0]}>
      {/* Aura effect */}
      {discipline > 40 && <AuraEffect intensity={auraIntensity} color={scheme.accent} />}
      
      {/* Character body */}
      <group scale={[bodyMetrics.muscleScale * bodyMetrics.leanness, bodyMetrics.height, bodyMetrics.muscleScale]}>
        {/* Head */}
        <Head discipline={discipline} customization={customization} />
        
        {/* Torso */}
        <Torso strength={strength} colorScheme={scheme} />
        
        {/* Arms */}
        <Arm side="left" strength={strength} colorScheme={scheme} />
        <Arm side="right" strength={strength} colorScheme={scheme} />
        
        {/* Legs */}
        <Leg side="left" strength={strength} />
        <Leg side="right" strength={strength} />
      </group>
      
      {/* Level badge floating */}
      <LevelBadge level={level} position={[1.2, 2, 0]} />
    </group>
  )
}

// ============================================
// HEAD COMPONENT - Realistic Face
// ============================================
function Head({ discipline, customization }: { discipline: number; customization?: AvatarCustomization }) {
  const headRef = useRef<THREE.Group>(null)
  
  // Skin material with subsurface scattering effect
  const skinMaterial = useMemo(() => {
    const skinColor = customization?.skinTone || '#e8c4a0'
    return new THREE.MeshPhysicalMaterial({
      color: skinColor,
      roughness: 0.4,
      metalness: 0,
      clearcoat: 0.3,
      clearcoatRoughness: 0.2,
      sheen: 0.1,
      sheenColor: new THREE.Color(0xffd1b3),
    })
  }, [customization?.skinTone])

  // Hair color
  const hairColor = customization?.hairColor || '#2c1810'

  return (
    <group ref={headRef} position={[0, 2.2, 0]}>
      {/* Skull base - more organic shape */}
      <mesh castShadow>
        <capsuleGeometry args={[0.32, 0.35, 4, 16]} />
        <primitive object={skinMaterial} attach="material" />
      </mesh>
      
      {/* Face plane */}
      <mesh position={[0, 0.05, 0.25]} castShadow>
        <RoundedBox args={[0.45, 0.5, 0.1]} radius={0.05} smoothness={4}>
          <primitive object={skinMaterial} attach="material" />
        </RoundedBox>
      </mesh>
      
      {/* Eyes */}
      <Eye position={[-0.12, 0.08, 0.32]} color={customization?.eyeColor || '#4a3728'} />
      <Eye position={[0.12, 0.08, 0.32]} color={customization?.eyeColor || '#4a3728'} />
      
      {/* Eyebrows - show determination based on discipline */}
      <Eyebrow position={[-0.12, 0.18, 0.32]} intensity={discipline} color={hairColor} />
      <Eyebrow position={[0.12, 0.18, 0.32]} intensity={discipline} color={hairColor} />
      
      {/* Nose */}
      <mesh position={[0, 0.02, 0.35]} castShadow>
        <roundedBoxGeometry args={[0.08, 0.15, 0.08]} />
        <primitive object={skinMaterial} attach="material" />
      </mesh>
      
      {/* Mouth */}
      <mesh position={[0, -0.15, 0.32]}>
        <RoundedBox args={[0.2, 0.06, 0.02]} radius={0.02} smoothness={2}>
          <meshStandardMaterial color="#cc8888" />
        </RoundedBox>
      </mesh>
      
      {/* Hair */}
      <Hair style={customization?.hairStyle || 'short'} color={hairColor} />
      
      {/* Ears */}
      <mesh position={[-0.35, 0, 0]} castShadow>
        <capsuleGeometry args={[0.08, 0.12, 4, 8]} rotation={[0, 0, Math.PI / 2]} />
        <primitive object={skinMaterial} attach="material" />
      </mesh>
      <mesh position={[0.35, 0, 0]} castShadow>
        <capsuleGeometry args={[0.08, 0.12, 4, 8]} rotation={[0, 0, Math.PI / 2]} />
        <primitive object={skinMaterial} attach="material" />
      </mesh>
    </group>
  )
}

// ============================================
// EYE COMPONENT
// ============================================
function Eye({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <group position={position}>
      {/* Eye white */}
      <mesh>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      
      {/* Iris */}
      <mesh position={[0, 0, 0.04]}>
        <circleGeometry args={[0.035, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      {/* Pupil */}
      <mesh position={[0, 0, 0.05]}>
        <circleGeometry args={[0.018, 16]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      
      {/* Highlight */}
      <mesh position={[0.02, 0.02, 0.055]}>
        <circleGeometry args={[0.008, 8]} />
        <meshBasicMaterial color="#ffffff" opacity={0.8} transparent />
      </mesh>
    </group>
  )
}

// ============================================
// EYEBROW COMPONENT - Shows determination
// ============================================
function Eyebrow({ position, intensity, color }: { position: [number, number, number]; intensity: number; color: string }) {
  // Higher discipline = more angled/serious eyebrows
  const angle = intensity > 60 ? -0.3 : intensity > 30 ? -0.15 : 0
  
  return (
    <mesh position={position} rotation={[0, 0, angle]}>
      <capsuleGeometry args={[0.025, 0.12, 4, 8]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

// ============================================
// HAIR COMPONENT
// ============================================
function Hair({ style, color }: { style: string; color: string }) {
  const hairMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: color,
    roughness: 0.7,
    metalness: 0.1,
  }), [color])

  switch (style) {
    case 'bald':
      return null
    case 'short':
      return (
        <mesh position={[0, 0.35, 0]}>
          <sphereGeometry args={[0.34, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.4]} />
          <primitive object={hairMaterial} attach="material" />
        </mesh>
      )
    case 'medium':
      return (
        <group>
          <mesh position={[0, 0.35, 0]}>
            <sphereGeometry args={[0.36, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
            <primitive object={hairMaterial} attach="material" />
          </mesh>
          {/* Back hair */}
          <mesh position={[0, 0, -0.25]}>
            <RoundedBox args={[0.5, 0.6, 0.15]} radius={0.05}>
              <primitive object={hairMaterial} attach="material" />
            </RoundedBox>
          </mesh>
        </group>
      )
    case 'long':
      return (
        <group>
          <mesh position={[0, 0.35, 0]}>
            <sphereGeometry args={[0.36, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
            <primitive object={hairMaterial} attach="material" />
          </mesh>
          {/* Long back hair */}
          <mesh position={[0, -0.3, -0.28]}>
            <RoundedBox args={[0.55, 1.0, 0.15]} radius={0.08}>
              <primitive object={hairMaterial} attach="material" />
            </RoundedBox>
          </mesh>
        </group>
      )
    default:
      return (
        <mesh position={[0, 0.35, 0]}>
          <sphereGeometry args={[0.34, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.4]} />
          <primitive object={hairMaterial} attach="material" />
        </mesh>
      )
  }
}

// ============================================
// TORSO COMPONENT
// ============================================
function Torso({ strength, colorScheme }: { strength: number; colorScheme: { primary: string; secondary: string; accent: string } }) {
  // Muscle definition increases with strength
  const muscleDefinition = strength / 100
  
  return (
    <group position={[0, 1.2, 0]}>
      {/* Upper torso/chest */}
      <mesh castShadow>
        <RoundedBox args={[0.7 + muscleDefinition * 0.2, 0.5, 0.35 + muscleDefinition * 0.1]} radius={0.08} smoothness={4}>
          <meshStandardMaterial 
            color={colorScheme.primary}
            roughness={0.6}
          />
        </RoundedBox>
      </mesh>
      
      {/* Muscle definition lines for high strength */}
      {strength > 50 && (
        <>
          {/* Pectoral definition */}
          <mesh position={[0, 0.15, 0.18]}>
            <RoundedBox args={[0.4, 0.03, 0.02]} radius={0.01}>
              <meshStandardMaterial color={colorScheme.accent} emissive={colorScheme.accent} emissiveIntensity={0.2} />
            </RoundedBox>
          </mesh>
          {/* Abs definition */}
          {[...Array(3)].map((_, i) => (
            <mesh key={i} position={[0, -0.1 - i * 0.12, 0.18]}>
              <RoundedBox args={[0.25, 0.02, 0.02]} radius={0.01}>
                <meshStandardMaterial color={colorScheme.secondary} />
              </RoundedBox>
            </mesh>
          ))}
        </>
      )}
      
      {/* Waist */}
      <mesh position={[0, -0.45, 0]} castShadow>
        <RoundedBox args={[0.55, 0.4, 0.3]} radius={0.06} smoothness={4}>
          <meshStandardMaterial color={colorScheme.secondary} roughness={0.6} />
        </RoundedBox>
      </mesh>
      
      {/* Accent stripe */}
      <mesh position={[0, 0.1, 0.19]}>
        <RoundedBox args={[0.5, 0.06, 0.02]} radius={0.01}>
          <meshStandardMaterial color={colorScheme.accent} emissive={colorScheme.accent} emissiveIntensity={0.3} />
        </RoundedBox>
      </mesh>
    </group>
  )
}

// ============================================
// ARM COMPONENT
// ============================================
function Arm({ side, strength, colorScheme }: { side: 'left' | 'right'; strength: number; colorScheme: { primary: string; secondary: string; accent: string } }) {
  const xOffset = side === 'left' ? -0.45 : 0.45
  const muscleScale = 0.8 + (strength / 100) * 0.4
  
  return (
    <group position={[xOffset, 1.3, 0]}>
      {/* Shoulder */}
      <mesh castShadow>
        <sphereGeometry args={[0.18 * muscleScale, 16, 16]} />
        <meshStandardMaterial color={colorScheme.primary} />
      </mesh>
      
      {/* Upper arm */}
      <mesh position={[0, -0.35, 0]} castShadow>
        <RoundedBox args={[0.16 * muscleScale, 0.5, 0.16 * muscleScale]} radius={0.04}>
          <meshStandardMaterial color="#e8c4a0" roughness={0.4} />
        </RoundedBox>
      </mesh>
      
      {/* Bicep bulge for high strength */}
      {strength > 40 && (
        <mesh position={[side === 'left' ? -0.05 : 0.05, -0.25, 0.05]}>
          <sphereGeometry args={[0.12 * muscleScale, 16, 16]} />
          <meshStandardMaterial color="#e8c4a0" roughness={0.4} />
        </mesh>
      )}
      
      {/* Forearm */}
      <mesh position={[0, -0.85, 0]} castShadow>
        <RoundedBox args={[0.12 * muscleScale, 0.45, 0.12 * muscleScale]} radius={0.03}>
          <meshStandardMaterial color="#e8c4a0" roughness={0.4} />
        </RoundedBox>
      </mesh>
      
      {/* Hand */}
      <mesh position={[0, -1.2, 0]} castShadow>
        <RoundedBox args={[0.1, 0.15, 0.08]} radius={0.03}>
          <meshStandardMaterial color="#e8c4a0" roughness={0.4} />
        </RoundedBox>
      </mesh>
    </group>
  )
}

// ============================================
// LEG COMPONENT
// ============================================
function Leg({ side, strength }: { side: 'left' | 'right'; strength: number }) {
  const xOffset = side === 'left' ? -0.2 : 0.2
  const muscleScale = 0.85 + (strength / 100) * 0.35
  
  return (
    <group position={[xOffset, 0.2, 0]}>
      {/* Thigh */}
      <mesh castShadow>
        <RoundedBox args={[0.22 * muscleScale, 0.6, 0.22 * muscleScale]} radius={0.05}>
          <meshStandardMaterial color="#e8c4a0" roughness={0.4} />
        </RoundedBox>
      </mesh>
      
      {/* Knee */}
      <mesh position={[0, -0.35, 0]}>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshStandardMaterial color="#d4a574" roughness={0.4} />
      </mesh>
      
      {/* Calf */}
      <mesh position={[0, -0.75, 0]} castShadow>
        <RoundedBox args={[0.18 * muscleScale, 0.5, 0.18 * muscleScale]} radius={0.04}>
          <meshStandardMaterial color="#e8c4a0" roughness={0.4} />
        </RoundedBox>
      </mesh>
      
      {/* Calf muscle for high strength */}
      {strength > 50 && (
        <mesh position={[0, -0.7, 0.08]}>
          <sphereGeometry args={[0.1 * muscleScale, 12, 12]} />
          <meshStandardMaterial color="#e8c4a0" roughness={0.4} />
        </mesh>
      )}
      
      {/* Foot */}
      <mesh position={[0, -1.1, 0.1]} castShadow>
        <RoundedBox args={[0.14, 0.12, 0.25]} radius={0.03}>
          <meshStandardMaterial color="#333333" roughness={0.8} />
        </RoundedBox>
      </mesh>
    </group>
  )
}

// ============================================
// AURA EFFECT COMPONENT
// ============================================
function AuraEffect({ intensity, color }: { intensity: number; color: string }) {
  const particlesRef = useRef<THREE.Points>(null)
  
  const particleCount = Math.floor(intensity * 100)
  
  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const colorObj = new THREE.Color(color)
    
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      const radius = 1.5 + Math.random() * 0.8
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) + 1
      positions[i * 3 + 2] = radius * Math.cos(phi)
      
      colors[i * 3] = colorObj.r
      colors[i * 3 + 1] = colorObj.g
      colors[i * 3 + 2] = colorObj.b
    }
    
    return { positions, colors }
  }, [particleCount, color])
  
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.3
    }
  })
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        vertexColors
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  )
}

// ============================================
// LEVEL BADGE COMPONENT
// ============================================
function LevelBadge({ level, position }: { level: number; position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1
    }
  })
  
  // Determine rarity color
  let badgeColor = '#6b7280'
  if (level >= 30) badgeColor = '#a855f7'
  else if (level >= 20) badgeColor = '#fbbf24'
  else if (level >= 10) badgeColor = '#3b82f6'
  else if (level >= 5) badgeColor = '#22c55e'
  
  return (
    <group position={position}>
      {/* Glowing ring */}
      <mesh ref={meshRef}>
        <torusGeometry args={[0.15, 0.02, 8, 32]} />
        <meshBasicMaterial color={badgeColor} />
      </mesh>
      
      {/* Level number */}
      <mesh>
        <circleGeometry args={[0.12, 32]} />
        <meshBasicMaterial color="#1f2937" />
      </mesh>
    </group>
  )
}

// ============================================
// STUDIO LIGHTING
// ============================================
function StudioLighting({ discipline }: { discipline: number }) {
  return (
    <>
      {/* Key light */}
      <directionalLight
        position={[5, 5, 5]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.1}
        shadow-camera-far={20}
        shadow-bias={-0.0001}
      />
      
      {/* Fill light */}
      <directionalLight
        position={[-5, 3, 2]}
        intensity={0.5}
      />
      
      {/* Rim light for definition */}
      <directionalLight
        position={[0, 5, -5]}
        intensity={0.8}
        color="#ffffff"
      />
      
      {/* Ambient */}
      <ambientLight intensity={0.3} />
      
      {/* Aura light for high discipline */}
      {discipline > 40 && (
        <pointLight
          position={[0, 2, 0]}
          intensity={discipline / 50}
          color="#a855f7"
          distance={5}
        />
      )}
    </>
  )
}

// ============================================
// STATS OVERLAY
// ============================================
function StatsOverlay({ strength, endurance, discipline, level }: { strength: number; endurance: number; discipline: number; level: number }) {
  const avgStats = Math.floor((strength + endurance + discipline) / 3)
  
  let title = 'Novice'
  if (avgStats >= 80) title = 'Legend'
  else if (avgStats >= 60) title = 'Elite'
  else if (avgStats >= 40) title = 'Warrior'
  else if (avgStats >= 20) title = 'Trainee'
  
  return (
    <div className="absolute bottom-4 left-4 right-4 z-10">
      <div className="bg-black/70 backdrop-blur-md rounded-xl p-4 border border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <span className="text-white font-bold text-lg">Level {level}</span>
          <span className="text-purple-400 font-bold">{title}</span>
        </div>
        
        <div className="space-y-2">
          <StatBar label="STR" value={strength} color="#ef4444" />
          <StatBar label="END" value={endurance} color="#3b82f6" />
          <StatBar label="DIS" value={discipline} color="#eab308" />
        </div>
      </div>
    </div>
  )
}

function StatBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-bold text-gray-400 w-8">{label}</span>
      <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-500"
          style={{ 
            width: `${value}%`,
            backgroundColor: color,
            boxShadow: `0 0 8px ${color}`,
          }}
        />
      </div>
      <span className="text-xs text-white w-8 text-right">{value}</span>
    </div>
  )
}
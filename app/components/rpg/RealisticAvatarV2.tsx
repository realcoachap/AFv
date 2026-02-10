'use client'

/**
 * Realistic Avatar 3D v2 - AAA Quality Character System
 * Enhanced with procedural textures, detailed anatomy, and cinematic lighting
 */

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { 
  OrbitControls, 
  Environment, 
  ContactShadows,
  useTexture,
  MeshDistortMaterial
} from '@react-three/drei'
import * as THREE from 'three'
import type { AvatarCustomization } from '@/app/lib/rpg/customization'

type RealisticAvatarV2Props = {
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

export default function RealisticAvatarV2({
  strength,
  endurance,
  discipline,
  level,
  colorScheme = 'navy',
  size = 'lg',
  autoRotate = true,
  customization,
  showStats = true,
}: RealisticAvatarV2Props) {
  const sizes = {
    sm: { width: 240, height: 320 },
    md: { width: 360, height: 480 },
    lg: { width: 480, height: 640 },
    xl: { width: 600, height: 800 },
  }
  
  const { width, height } = sizes[size]

  return (
    <div style={{ width, height }} className="relative">
      <Canvas
        shadows
        camera={{ position: [0, -0.5, 6], fov: 35 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0
        }}
      >
        {/* Cinematic Lighting */}
        <CinematicLighting discipline={discipline} />
        <Environment preset="city" />
        
        {/* Character */}
        <Character 
          strength={strength}
          endurance={endurance}
          discipline={discipline}
          level={level}
          colorScheme={colorScheme}
          customization={customization}
        />
        
        {/* Dramatic ground shadows */}
        <ContactShadows
          position={[0, -3, 0]}
          opacity={0.6}
          scale={15}
          blur={3}
          far={5}
        />
        
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 2.2}
          maxPolarAngle={Math.PI / 1.8}
          autoRotate={autoRotate}
          autoRotateSpeed={0.8}
          target={[0, 0.3, 0]}
        />
      </Canvas>
      
      {showStats && <StatsOverlay strength={strength} endurance={endurance} discipline={discipline} level={level} />}
    </div>
  )
}

// ============================================
// ENHANCED CHARACTER
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
  
  // Calculate body metrics
  const metrics = useMemo(() => {
    const muscleMass = strength / 100 // 0-1
    const leanness = endurance / 100 // 0-1 (higher = leaner)
    const definition = (strength + endurance) / 200
    
    return {
      muscleScale: 0.75 + muscleMass * 0.45, // 0.75 to 1.2
      leannessFactor: 0.85 + leanness * 0.15, // 0.85 to 1.0
      definition: definition,
      hasSixPack: strength > 40 && endurance > 30,
      hasVascularity: strength > 60 && endurance > 50,
    }
  }, [strength, endurance])

  // Idle animation with breathing
  useFrame((state) => {
    if (groupRef.current) {
      const breathe = Math.sin(state.clock.elapsedTime * 1.2) * 0.008
      const sway = Math.sin(state.clock.elapsedTime * 0.3) * 0.015
      
      groupRef.current.scale.y = 1 + breathe
      groupRef.current.scale.x = 1 - breathe * 0.5
      groupRef.current.scale.z = 1 - breathe * 0.5
      groupRef.current.rotation.y = sway
    }
  })

  const colors = {
    navy: { primary: '#1a2744', secondary: '#243656', accent: '#4a9eff' },
    crimson: { primary: '#5c1a1a', secondary: '#7a2424', accent: '#ff6b6b' },
    emerald: { primary: '#0d3328', secondary: '#1a4d3a', accent: '#4ade80' },
    gold: { primary: '#4a3d1a', secondary: '#6b5a24', accent: '#fbbf24' },
    void: { primary: '#1a1a2e', secondary: '#252542', accent: '#a855f7' },
  }
  const scheme = colors[colorScheme as keyof typeof colors] || colors.navy

  return (
    <group ref={groupRef} position={[0, -2.2, 0]}>
      {/* Aura */}
      {discipline > 35 && <AuraEffect intensity={discipline / 100} color={scheme.accent} />}
      
      <group scale={[metrics.muscleScale * metrics.leannessFactor, 1, metrics.muscleScale]}>
        {/* Head with detailed face */}
        <DetailedHead 
          discipline={discipline} 
          customization={customization}
        />
        
        {/* Torso with anatomy */}
        <AnatomicalTorso 
          strength={strength}
          endurance={endurance}
          hasSixPack={metrics.hasSixPack}
          hasVascularity={metrics.hasVascularity}
          colorScheme={scheme}
        />
        
        {/* Arms */}
        <AnatomicalArm side="left" strength={strength} />
        <AnatomicalArm side="right" strength={strength} />
        
        {/* Legs */}
        <AnatomicalLeg side="left" strength={strength} />
        <AnatomicalLeg side="right" strength={strength} />
      </group>
      
      <LevelBadge level={level} position={[1.0, 1.5, 0]} />
    </group>
  )
}

// ============================================
// DETAILED HEAD - Realistic face
// ============================================
function DetailedHead({ discipline, customization }: { discipline: number; customization?: AvatarCustomization }) {
  const headGroup = useRef<THREE.Group>(null)
  
  // Procedural skin material with texture
  const skinMaterial = useMemo(() => {
    const color = customization?.skinTone || '#d4a574'
    return new THREE.MeshPhysicalMaterial({
      color: color,
      roughness: 0.45,
      metalness: 0.02,
      clearcoat: 0.1,
      clearcoatRoughness: 0.3,
      sheen: 0.2,
      sheenColor: new THREE.Color(0xffdbac),
      sheenRoughness: 0.5,
    })
  }, [customization?.skinTone])

  const hairColor = customization?.hairColor || '#2c1810'
  const eyeColor = customization?.eyeColor || '#4a3728'
  
  // Determined expression based on discipline
  const browAngle = discipline > 60 ? -0.25 : discipline > 30 ? -0.1 : 0

  return (
    <group ref={headGroup} position={[0, 2.0, 0]}>
      {/* Cranium - more realistic shape */}
      <mesh castShadow>
        <sphereGeometry args={[0.28, 32, 32]} />
        <primitive object={skinMaterial} attach="material" />
      </mesh>
      
      {/* Jawline - creates masculine face shape */}
      <mesh position={[0, -0.15, 0.05]} castShadow>
        <boxGeometry args={[0.32, 0.25, 0.28]} />
        <primitive object={skinMaterial} attach="material" />
      </mesh>
      
      {/* Chin */}
      <mesh position={[0, -0.28, 0.12]} castShadow>
        <sphereGeometry args={[0.12, 16, 16]} />
        <primitive object={skinMaterial} attach="material" />
      </mesh>
      
      {/* Cheekbones */}
      <mesh position={[-0.22, -0.05, 0.15]} castShadow>
        <sphereGeometry args={[0.1, 16, 16]} />
        <primitive object={skinMaterial} attach="material" />
      </mesh>
      <mesh position={[0.22, -0.05, 0.15]} castShadow>
        <sphereGeometry args={[0.1, 16, 16]} />
        <primitive object={skinMaterial} attach="material" />
      </mesh>
      
      {/* Brow ridge */}
      <mesh position={[0, 0.12, 0.22]} rotation={[0.2, 0, 0]} castShadow>
        <boxGeometry args={[0.35, 0.06, 0.1]} />
        <primitive object={skinMaterial} attach="material" />
      </mesh>
      
      {/* Nose */}
      <group position={[0, 0.02, 0.32]}>
        {/* Bridge */}
        <mesh castShadow>
          <boxGeometry args={[0.08, 0.2, 0.08]} />
          <primitive object={skinMaterial} attach="material" />
        </mesh>
        {/* Tip */}
        <mesh position={[0, -0.12, 0.03]} castShadow>
          <sphereGeometry args={[0.06, 12, 12]} />
          <primitive object={skinMaterial} attach="material" />
        </mesh>
        {/* Nostrils */}
        <mesh position={[-0.03, -0.1, 0.05]}>
          <circleGeometry args={[0.015, 8]} />
          <meshBasicMaterial color="#8b6239" />
        </mesh>
        <mesh position={[0.03, -0.1, 0.05]}>
          <circleGeometry args={[0.015, 8]} />
          <meshBasicMaterial color="#8b6239" />
        </mesh>
      </group>
      
      {/* Eyes */}
      <DetailedEye position={[-0.1, 0.05, 0.24]} color={eyeColor} />
      <DetailedEye position={[0.1, 0.05, 0.24]} color={eyeColor} />
      
      {/* Eyebrows - angled for determination */}
      <group rotation={[0, 0, browAngle]}>
        <mesh position={[-0.1, 0.18, 0.26]} castShadow>
          <capsuleGeometry args={[0.025, 0.14, 4, 8]} />
          <meshStandardMaterial color={hairColor} />
        </mesh>
      </group>
      
      <group rotation={[0, 0, -browAngle]}>
        <mesh position={[0.1, 0.18, 0.26]} castShadow>
          <capsuleGeometry args={[0.025, 0.14, 4, 8]} />
          <meshStandardMaterial color={hairColor} />
        </mesh>
      </group>
      
      {/* Mouth */}
      <group position={[0, -0.18, 0.28]}>
        {/* Lips base */}
        <mesh>
          <boxGeometry args={[0.18, 0.04, 0.02]} />
          <meshStandardMaterial color="#c97e7e" />
        </mesh>
        {/* Lower lip */}
        <mesh position={[0, -0.03, 0.01]}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshStandardMaterial color="#c97e7e" />
        </mesh>
      </group>
      
      {/* Ears */}
      <mesh position={[-0.28, 0, 0]} rotation={[0, 0, -0.2]} castShadow>
        <capsuleGeometry args={[0.06, 0.14, 4, 8]} />
        <primitive object={skinMaterial} attach="material" />
      </mesh>
      <mesh position={[0.28, 0, 0]} rotation={[0, 0, 0.2]} castShadow>
        <capsuleGeometry args={[0.06, 0.14, 4, 8]} />
        <primitive object={skinMaterial} attach="material" />
      </mesh>
      
      {/* Hair */}
      <DetailedHair style={customization?.hairStyle || 'short'} color={hairColor} />
      
      {/* Neck */}
      <mesh position={[0, -0.35, 0]} castShadow>
        <cylinderGeometry args={[0.14, 0.16, 0.25, 16]} />
        <primitive object={skinMaterial} attach="material" />
      </mesh>
      
      {/* Neck muscles (traps) for high strength */}
      {discipline > 50 && (
        <>
          <mesh position={[-0.12, -0.3, 0]} castShadow>
            <sphereGeometry args={[0.1, 12, 12]} />
            <primitive object={skinMaterial} attach="material" />
          </mesh>
          <mesh position={[0.12, -0.3, 0]} castShadow>
            <sphereGeometry args={[0.1, 12, 12]} />
            <primitive object={skinMaterial} attach="material" />
          </mesh>
        </>
      )}
    </group>
  )
}

// ============================================
// DETAILED EYE
// ============================================
function DetailedEye({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <group position={position}>
      {/* Eye socket depth */}
      <mesh position={[0, 0, -0.02]}>
        <circleGeometry args={[0.055, 16]} />
        <meshBasicMaterial color="#1a1a1a" />
      </mesh>
      
      {/* Sclera (white) */}
      <mesh position={[0, 0, 0.01]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#f5f5f5" roughness={0.3} />
      </mesh>
      
      {/* Iris */}
      <mesh position={[0, 0, 0.04]}>
        <circleGeometry args={[0.028, 16]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
      
      {/* Pupil */}
      <mesh position={[0, 0, 0.045]}>
        <circleGeometry args={[0.014, 12]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      
      {/* Eye shine */}
      <mesh position={[0.02, 0.015, 0.048]}>
        <circleGeometry args={[0.006, 8]} />
        <meshBasicMaterial color="#ffffff" opacity={0.8} transparent />
      </mesh>
      
      {/* Upper eyelid shadow */}
      <mesh position={[0, 0.04, 0.03]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[0.09, 0.02, 0.01]} />
        <meshStandardMaterial color="#8b6239" opacity={0.5} transparent />
      </mesh>
    </group>
  )
}

// ============================================
// DETAILED HAIR
// ============================================
function DetailedHair({ style, color }: { style: string; color: string }) {
  const hairMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: color,
    roughness: 0.7,
    metalness: 0.1,
  }), [color])

  const renderStrands = (count: number, radius: number, length: number, startY: number) => {
    return [...Array(count)].map((_, i) => {
      const angle = (i / count) * Math.PI * 2
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius
      return (
        <mesh key={i} position={[x, startY - length/2, z]} rotation={[0.1, angle, 0]}>
          <capsuleGeometry args={[0.015, length, 4, 6]} />
          <primitive object={hairMat} attach="material" />
        </mesh>
      )
    })
  }

  switch (style) {
    case 'bald':
      return null
    case 'short':
      return (
        <group>
          {/* Top */}
          <mesh position={[0, 0.25, 0]}>
            <sphereGeometry args={[0.29, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.35]} />
            <primitive object={hairMat} attach="material" />
          </mesh>
          {/* Individual strands */}
          {renderStrands(24, 0.28, 0.15, 0.2)}
        </group>
      )
    case 'medium':
      return (
        <group>
          <mesh position={[0, 0.28, 0]}>
            <sphereGeometry args={[0.3, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.45]} />
            <primitive object={hairMat} attach="material" />
          </mesh>
          {/* Back flow */}
          <mesh position={[0, 0, -0.25]}>
            <boxGeometry args={[0.45, 0.5, 0.15]} />
            <primitive object={hairMat} attach="material" />
          </mesh>
          {renderStrands(32, 0.3, 0.25, 0.15)}
        </group>
      )
    case 'long':
      return (
        <group>
          <mesh position={[0, 0.28, 0]}>
            <sphereGeometry args={[0.31, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
            <primitive object={hairMat} attach="material" />
          </mesh>
          {/* Long back */}
          <mesh position={[0, -0.4, -0.28]}>
            <boxGeometry args={[0.5, 1.0, 0.18]} />
            <primitive object={hairMat} attach="material" />
          </mesh>
          {renderStrands(40, 0.31, 0.4, 0.1)}
        </group>
      )
    default:
      return (
        <mesh position={[0, 0.25, 0]}>
          <sphereGeometry args={[0.29, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.35]} />
          <primitive object={hairMat} attach="material" />
        </mesh>
      )
  }
}

// ============================================
// ANATOMICAL TORSO - Detailed chest/abs
// ============================================
function AnatomicalTorso({ 
  strength, 
  endurance, 
  hasSixPack, 
  hasVascularity,
  colorScheme 
}: { 
  strength: number
  endurance: number
  hasSixPack: boolean
  hasVascularity: boolean
  colorScheme: { primary: string; secondary: string; accent: string }
}) {
  const muscleScale = 0.7 + (strength / 100) * 0.5
  
  return (
    <group position={[0, 1.0, 0]}>
      {/* Upper chest - pectorals */}
      <mesh castShadow>
        <boxGeometry args={[0.75 * muscleScale, 0.35, 0.25 * muscleScale]} />
        <meshStandardMaterial color={colorScheme.primary} roughness={0.6} />
      </mesh>
      
      {/* Chest muscle separation line */}
      <mesh position={[0, 0.05, 0.13]} castShadow>
        <boxGeometry args={[0.02, 0.25, 0.02]} />
        <meshStandardMaterial color={colorScheme.secondary} />
      </mesh>
      
      {/* Pectoral bulges (high strength) */}
      {strength > 40 && (
        <>
          <mesh position={[-0.18, 0.05, 0.14]} castShadow>
            <sphereGeometry args={[0.12 * muscleScale, 12, 12]} />
            <meshStandardMaterial color={colorScheme.primary} roughness={0.5} />
          </mesh>
          <mesh position={[0.18, 0.05, 0.14]} castShadow>
            <sphereGeometry args={[0.12 * muscleScale, 12, 12]} />
            <meshStandardMaterial color={colorScheme.primary} roughness={0.5} />
          </mesh>
        </>
      )}
      
      {/* Abdomen / Six pack */}
      <group position={[0, -0.35, 0]}>
        {/* Waist */}
        <mesh castShadow>
          <boxGeometry args={[0.5, 0.4, 0.22]} />
          <meshStandardMaterial color="#d4a574" roughness={0.5} />
        </mesh>
        
        {/* Six pack definition */}
        {hasSixPack && (
          <>
            {/* Vertical line */}
            <mesh position={[0, 0, 0.12]}>
              <boxGeometry args={[0.015, 0.3, 0.01]} />
              <meshStandardMaterial color="#b8956a" />
            </mesh>
            
            {/* Horizontal lines */}
            {[-0.1, 0, 0.1].map((y, i) => (
              <mesh key={i} position={[0, y, 0.12]}>
                <boxGeometry args={[0.25, 0.015, 0.01]} />
                <meshStandardMaterial color="#b8956a" />
              </mesh>
            ))}
            
            {/* Individual ab muscles */}
            {[-0.1, 0.1].map((x) =>
              [-0.1, 0, 0.1].map((y, i) => (
                <mesh key={`${x}-${i}`} position={[x * 0.6, y, 0.13]} castShadow>
                  <sphereGeometry args={[0.06, 8, 8]} />
                  <meshStandardMaterial color="#c9a87c" roughness={0.4} />
                </mesh>
              ))
            )}
          </>
        )}
      </group>
      
      {/* Vascularity (veins) for elite athletes */}
      {hasVascularity && (
        <>
          <mesh position={[-0.15, -0.1, 0.12]}>
            <boxGeometry args={[0.02, 0.2, 0.005]} />
            <meshStandardMaterial color="#8b9dc3" opacity={0.6} transparent />
          </mesh>
          <mesh position={[0.15, -0.1, 0.12]}>
            <boxGeometry args={[0.02, 0.2, 0.005]} />
            <meshStandardMaterial color="#8b9dc3" opacity={0.6} transparent />
          </mesh>
        </>
      )}
      
      {/* Obliques (side abs) */}
      <mesh position={[-0.28, -0.2, 0.05]} castShadow>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshStandardMaterial color="#c9a87c" />
      </mesh>
      <mesh position={[0.28, -0.2, 0.05]} castShadow>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshStandardMaterial color="#c9a87c" />
      </mesh>
      
      {/* Shorts */}
      <mesh position={[0, -0.65, 0]} castShadow>
        <boxGeometry args={[0.52, 0.3, 0.28]} />
        <meshStandardMaterial color={colorScheme.secondary} roughness={0.8} />
      </mesh>
      
      {/* Belt/waistband */}
      <mesh position={[0, -0.52, 0.15]}>
        <boxGeometry args={[0.53, 0.04, 0.02]} />
        <meshStandardMaterial color={colorScheme.accent} />
      </mesh>
    </group>
  )
}

// ============================================
// ANATOMICAL ARM - Detailed muscles
// ============================================
function AnatomicalArm({ side, strength }: { side: 'left' | 'right'; strength: number }) {
  const xOffset = side === 'left' ? -0.42 : 0.42
  const muscleScale = 0.75 + (strength / 100) * 0.45
  
  return (
    <group position={[xOffset, 1.1, 0]}>
      {/* Deltoid (shoulder) */}
      <mesh castShadow>
        <sphereGeometry args={[0.18 * muscleScale, 16, 16]} />
        <meshStandardMaterial color="#2a3f5f" roughness={0.6} />
      </mesh>
      
      {/* Upper arm */}
      <mesh position={[0, -0.35, 0]} castShadow>
        <cylinderGeometry args={[0.09 * muscleScale, 0.1 * muscleScale, 0.45, 16]} />
        <meshStandardMaterial color="#d4a574" roughness={0.5} />
      </mesh>
      
      {/* Bicep peak (flexed look) */}
      {strength > 30 && (
        <mesh position={[side === 'left' ? -0.04 : 0.04, -0.25, 0.06]} castShadow>
          <sphereGeometry args={[0.08 * muscleScale, 12, 12]} />
          <meshStandardMaterial color="#c9a87c" roughness={0.4} />
        </mesh>
      )}
      
      {/* Tricep */}
      <mesh position={[0, -0.35, -0.05]} castShadow>
        <sphereGeometry args={[0.07 * muscleScale, 12, 12]} />
        <meshStandardMaterial color="#c9a87c" />
      </mesh>
      
      {/* Elbow */}
      <mesh position={[0, -0.62, 0]}>
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshStandardMaterial color="#b8956a" />
      </mesh>
      
      {/* Forearm */}
      <mesh position={[0, -0.95, 0]} castShadow>
        <cylinderGeometry args={[0.07 * muscleScale, 0.06 * muscleScale, 0.5, 14]} />
        <meshStandardMaterial color="#d4a574" />
      </mesh>
      
      {/* Forearm muscle definition */}
      {strength > 50 && (
        <mesh position={[side === 'left' ? -0.03 : 0.03, -0.85, 0.04]} castShadow>
          <sphereGeometry args={[0.05 * muscleScale, 10, 10]} />
          <meshStandardMaterial color="#c9a87c" />
        </mesh>
      )}
      
      {/* Hand */}
      <mesh position={[0, -1.25, 0.03]} castShadow>
        <boxGeometry args={[0.12, 0.15, 0.1]} />
        <meshStandardMaterial color="#d4a574" />
      </mesh>
    </group>
  )
}

// ============================================
// ANATOMICAL LEG - Detailed quads/calves
// ============================================
function AnatomicalLeg({ side, strength }: { side: 'left' | 'right'; strength: number }) {
  const xOffset = side === 'left' ? -0.18 : 0.18
  const muscleScale = 0.8 + (strength / 100) * 0.4
  
  return (
    <group position={[xOffset, 0.2, 0]}>
      {/* Hip/glute */}
      <mesh position={[0, 0.15, -0.1]} castShadow>
        <sphereGeometry args={[0.2 * muscleScale, 14, 14]} />
        <meshStandardMaterial color="#1a2744" roughness={0.7} />
      </mesh>
      
      {/* Quad (thigh) */}
      <mesh position={[0, -0.25, 0.05]} castShadow>
        <cylinderGeometry args={[0.16 * muscleScale, 0.13 * muscleScale, 0.55, 16]} />
        <meshStandardMaterial color="#d4a574" roughness={0.5} />
      </mesh>
      
      {/* Quad definition */}
      {strength > 40 && (
        <>
          <mesh position={[-0.06, -0.2, 0.16]} castShadow>
            <sphereGeometry args={[0.06 * muscleScale, 10, 10]} />
            <meshStandardMaterial color="#c9a87c" />
          </mesh>
          <mesh position={[0.06, -0.2, 0.16]} castShadow>
            <sphereGeometry args={[0.06 * muscleScale, 10, 10]} />
            <meshStandardMaterial color="#c9a87c" />
          </mesh>
        </>
      )}
      
      {/* Knee */}
      <mesh position={[0, -0.58, 0]}>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshStandardMaterial color="#b8956a" />
      </mesh>
      
      {/* Calf */}
      <mesh position={[0, -0.95, -0.05]} castShadow>
        <cylinderGeometry args={[0.11 * muscleScale, 0.09 * muscleScale, 0.5, 14]} />
        <meshStandardMaterial color="#d4a574" />
      </mesh>
      
      {/* Calf diamond shape */}
      {strength > 50 && (
        <mesh position={[0, -0.9, -0.12]} castShadow>
          <sphereGeometry args={[0.08 * muscleScale, 10, 10]} />
          <meshStandardMaterial color="#c9a87c" />
        </mesh>
      )}
      
      {/* Shoe */}
      <mesh position={[0, -1.35, 0.05]} castShadow>
        <boxGeometry args={[0.15, 0.12, 0.28]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
      </mesh>
    </group>
  )
}

// ============================================
// CINEMATIC LIGHTING
// ============================================
function CinematicLighting({ discipline }: { discipline: number }) {
  return (
    <>
      {/* Key light - dramatic from upper left */}
      <directionalLight
        position={[4, 6, 4]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.1}
        shadow-camera-far={20}
        shadow-bias={-0.0005}
        color="#fff5e6"
      />
      
      {/* Fill light - soft from right */}
      <directionalLight
        position={[-3, 2, 3]}
        intensity={0.4}
        color="#e6f0ff"
      />
      
      {/* Rim light - back for silhouette */}
      <directionalLight
        position={[0, 4, -5]}
        intensity={0.6}
        color="#ffffff"
      />
      
      {/* Ambient */}
      <ambientLight intensity={0.15} />
      
      {/* Discipline aura */}
      {discipline > 40 && (
        <pointLight
          position={[0, 1.5, 2]}
          intensity={discipline / 80}
          distance={6}
          color="#a855f7"
        />
      )}
    </>
  )
}

// ============================================
// AURA EFFECT
// ============================================
function AuraEffect({ intensity, color }: { intensity: number; color: string }) {
  const particlesRef = useRef<THREE.Points>(null)
  
  const particles = useMemo(() => {
    const count = Math.floor(intensity * 80)
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const c = new THREE.Color(color)
    
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      const r = 1.8 + Math.random()
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) + 1
      positions[i * 3 + 2] = r * Math.cos(phi)
      
      colors[i * 3] = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b
    }
    return { positions, colors, count }
  }, [intensity, color])
  
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.15
    }
  })
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[particles.positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[particles.colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.06} vertexColors transparent opacity={0.5} blending={THREE.AdditiveBlending} sizeAttenuation />
    </points>
  )
}

// ============================================
// LEVEL BADGE
// ============================================
function LevelBadge({ level, position }: { level: number; position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.05
    }
  })
  
  const colors = ['#6b7280', '#22c55e', '#3b82f6', '#fbbf24', '#a855f7']
  const color = level >= 30 ? colors[4] : level >= 20 ? colors[3] : level >= 10 ? colors[2] : level >= 5 ? colors[1] : colors[0]
  
  return (
    <group ref={ref} position={position}>
      <mesh>
        <torusGeometry args={[0.12, 0.015, 8, 32]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh position={[0, 0, 0.02]}>
        <circleGeometry args={[0.09, 32]} />
        <meshBasicMaterial color="#1f2937" />
      </mesh>
    </group>
  )
}

// ============================================
// STATS OVERLAY
// ============================================
function StatsOverlay({ strength, endurance, discipline, level }: { strength: number; endurance: number; discipline: number; level: number }) {
  const avg = Math.floor((strength + endurance + discipline) / 3)
  const title = avg >= 80 ? 'Legend' : avg >= 60 ? 'Elite' : avg >= 40 ? 'Warrior' : avg >= 20 ? 'Athlete' : 'Novice'
  
  return (
    <div className="absolute bottom-3 left-3 right-3 z-10">
      <div className="bg-black/70 backdrop-blur-md rounded-lg p-3 border border-gray-700/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white font-bold">Lvl {level}</span>
          <span className="text-purple-400 text-sm font-bold">{title}</span>
        </div>
        <div className="space-y-1.5">
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
      <span className="text-xs font-bold text-gray-400 w-6">{label}</span>
      <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${value}%`, backgroundColor: color, boxShadow: `0 0 6px ${color}` }} />
      </div>
      <span className="text-xs text-white w-6 text-right">{value}</span>
    </div>
  )
}
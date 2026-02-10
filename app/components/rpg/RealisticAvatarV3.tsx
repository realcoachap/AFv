'use client'

/**
 * Realistic Avatar 3D v3.1 - Mobile Optimized
 * Centered character, smaller frame, full body visible
 */

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { 
  OrbitControls, 
  Environment, 
  ContactShadows,
} from '@react-three/drei'
import * as THREE from 'three'
import type { AvatarCustomization } from '@/app/lib/rpg/customization'

type RealisticAvatarV3Props = {
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

export default function RealisticAvatarV3({
  strength,
  endurance,
  discipline,
  level,
  colorScheme = 'navy',
  size = 'lg',
  autoRotate = true,
  customization,
  showStats = true,
}: RealisticAvatarV3Props) {
  const sizes = {
    sm: { width: 240, height: 340 },
    md: { width: 300, height: 440 },
    lg: { width: 380, height: 560 },
    xl: { width: 440, height: 640 },
  }
  
  const { width, height } = sizes[size]

  return (
    <div style={{ width, height }} className="relative">
      <Canvas
        shadows
        camera={{ position: [0, 0, 10], fov: 28 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0
        }}
      >
        <CinematicLighting discipline={discipline} />
        <Environment preset="studio" />
        
        <Character 
          strength={strength}
          endurance={endurance}
          discipline={discipline}
          level={level}
          colorScheme={colorScheme}
          customization={customization}
        />
        
        <ContactShadows
          position={[0, -1.5, 0]}
          opacity={0.5}
          scale={12}
          blur={2.5}
          far={4}
        />
        
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 2.8}
          maxPolarAngle={Math.PI / 1.9}
          autoRotate={autoRotate}
          autoRotateSpeed={0.5}
          target={[0, 0.5, 0]}
        />
      </Canvas>
      
      {showStats && <StatsOverlay strength={strength} endurance={endurance} discipline={discipline} level={level} />}
    </div>
  )
}

// ============================================
// POLISHED CHARACTER
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
  
  const metrics = useMemo(() => {
    const muscle = strength / 100
    const lean = endurance / 100
    
    return {
      scale: 0.9 + muscle * 0.25,
      width: 0.85 + muscle * 0.2,
      definition: muscle * 0.8 + lean * 0.2,
    }
  }, [strength, endurance])

  useFrame((state) => {
    if (groupRef.current) {
      const breathe = Math.sin(state.clock.elapsedTime * 0.8) * 0.006
      groupRef.current.position.y = -0.8 + breathe
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.03
    }
  })

  const colors = {
    navy: { shirt: '#1e3a5f', shorts: '#152a45', accent: '#4a9eff' },
    crimson: { shirt: '#7c1d1d', shorts: '#5c1515', accent: '#ff6b6b' },
    emerald: { shirt: '#064e3b', shorts: '#043d2e', accent: '#4ade80' },
    gold: { shirt: '#78350f', shorts: '#5c280b', accent: '#fbbf24' },
    void: { shirt: '#1a1a2e', shorts: '#12121f', accent: '#a855f7' },
  }
  const scheme = colors[colorScheme as keyof typeof colors] || colors.navy

  const skinColor = customization?.skinTone || '#c68642'

  return (
    <group ref={groupRef}>
      {/* Aura */}
      {discipline > 30 && <AuraEffect intensity={discipline / 100} color={scheme.accent} />}
      
      <group scale={[metrics.width, metrics.scale, metrics.width]}>
        {/* HEAD - Smooth stylized */}
        <Head 
          skinColor={skinColor}
          hairStyle={customization?.hairStyle || 'short'}
          hairColor={customization?.hairColor || '#2c1810'}
          eyeColor={customization?.eyeColor || '#4a3728'}
          discipline={discipline}
        />
        
        {/* BODY - Smooth organic shapes */}
        <Body 
          strength={strength}
          endurance={endurance}
          shirtColor={scheme.shirt}
          shortsColor={scheme.shorts}
          accentColor={scheme.accent}
          skinColor={skinColor}
        />
        
        {/* ARMS */}
        <Arm side="left" strength={strength} shirtColor={scheme.shirt} skinColor={skinColor} />
        <Arm side="right" strength={strength} shirtColor={scheme.shirt} skinColor={skinColor} />
        
        {/* LEGS */}
        <Leg side="left" strength={strength} shortsColor={scheme.shorts} skinColor={skinColor} />
        <Leg side="right" strength={strength} shortsColor={scheme.shorts} skinColor={skinColor} />
      </group>
      
      <LevelBadge level={level} position={[1.0, 2.0, 0]} />
    </group>
  )
}

// ============================================
// SMOOTH HEAD
// ============================================
function Head({ 
  skinColor, 
  hairStyle, 
  hairColor, 
  eyeColor,
  discipline 
}: { 
  skinColor: string
  hairStyle: string
  hairColor: string
  eyeColor: string
  discipline: number
}) {
  const skinMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: skinColor,
    roughness: 0.5,
    metalness: 0,
    clearcoat: 0.1,
    sheen: 0.15,
    sheenColor: new THREE.Color(0xffdbac),
  }), [skinColor])

  const hairMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: hairColor,
    roughness: 0.8,
  }), [hairColor])

  const browAngle = discipline > 50 ? -0.2 : 0

  return (
    <group position={[0, 2.1, 0]}>
      {/* Main head - smooth sphere/capsule blend */}
      <mesh castShadow>
        <capsuleGeometry args={[0.26, 0.35, 8, 16]} />
        <primitive object={skinMat} attach="material" />
      </mesh>
      
      {/* Jaw/chin - smooth blend */}
      <mesh position={[0, -0.22, 0.08]} castShadow>
        <sphereGeometry args={[0.2, 16, 16]} />
        <primitive object={skinMat} attach="material" />
      </mesh>
      
      {/* Eyes - embedded */}
      <Eye position={[-0.09, 0.02, 0.22]} color={eyeColor} />
      <Eye position={[0.09, 0.02, 0.22]} color={eyeColor} />
      
      {/* Eyebrows */}
      <group rotation={[0, 0, browAngle]}>
        <mesh position={[-0.09, 0.14, 0.24]} castShadow>
          <capsuleGeometry args={[0.022, 0.1, 4, 8]} />
          <primitive object={hairMat} attach="material" />
        </mesh>
      </group>
      <group rotation={[0, 0, -browAngle]}>
        <mesh position={[0.09, 0.14, 0.24]} castShadow>
          <capsuleGeometry args={[0.022, 0.1, 4, 8]} />
          <primitive object={hairMat} attach="material" />
        </mesh>
      </group>
      
      {/* Nose - subtle */}
      <mesh position={[0, -0.05, 0.28]} castShadow>
        <sphereGeometry args={[0.055, 12, 12]} />
        <primitive object={skinMat} attach="material" />
      </mesh>
      
      {/* Mouth */}
      <mesh position={[0, -0.18, 0.22]}>
        <boxGeometry args={[0.12, 0.025, 0.02]} />
        <meshStandardMaterial color="#c97e7e" />
      </mesh>
      
      {/* Hair */}
      <Hair style={hairStyle} color={hairColor} />
      
      {/* Ears */}
      <mesh position={[-0.28, 0, 0]} rotation={[0, 0, Math.PI / 2.5]} castShadow>
        <capsuleGeometry args={[0.05, 0.12, 4, 8]} />
        <primitive object={skinMat} attach="material" />
      </mesh>
      <mesh position={[0.28, 0, 0]} rotation={[0, 0, -Math.PI / 2.5]} castShadow>
        <capsuleGeometry args={[0.05, 0.12, 4, 8]} />
        <primitive object={skinMat} attach="material" />
      </mesh>
      
      {/* Neck */}
      <mesh position={[0, -0.32, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.14, 0.25, 16]} />
        <primitive object={skinMat} attach="material" />
      </mesh>
    </group>
  )
}

function Eye({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>
      <mesh position={[0, 0, 0.035]}>
        <circleGeometry args={[0.024, 12]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 0, 0.042]}>
        <circleGeometry args={[0.012, 8]} />
        <meshBasicMaterial color="#000" />
      </mesh>
      <mesh position={[0.015, 0.015, 0.045]}>
        <circleGeometry args={[0.006, 6]} />
        <meshBasicMaterial color="#fff" opacity={0.7} transparent />
      </mesh>
    </group>
  )
}

function Hair({ style, color }: { style: string; color: string }) {
  const mat = useMemo(() => new THREE.MeshStandardMaterial({ color, roughness: 0.75 }), [color])
  
  switch (style) {
    case 'bald':
      return null
    case 'short':
      return (
        <mesh position={[0, 0.22, 0]} castShadow>
          <sphereGeometry args={[0.28, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.4]} />
          <primitive object={mat} attach="material" />
        </mesh>
      )
    case 'medium':
      return (
        <group>
          <mesh position={[0, 0.25, 0]} castShadow>
            <sphereGeometry args={[0.29, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
            <primitive object={mat} attach="material" />
          </mesh>
          <mesh position={[0, -0.1, -0.22]} castShadow>
            <capsuleGeometry args={[0.08, 0.5, 4, 8]} />
            <primitive object={mat} attach="material" />
          </mesh>
        </group>
      )
    case 'long':
      return (
        <group>
          <mesh position={[0, 0.25, 0]} castShadow>
            <sphereGeometry args={[0.3, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
            <primitive object={mat} attach="material" />
          </mesh>
          <mesh position={[0, -0.4, -0.25]} castShadow>
            <capsuleGeometry args={[0.1, 1.0, 4, 8]} />
            <primitive object={mat} attach="material" />
          </mesh>
        </group>
      )
    default:
      return (
        <mesh position={[0, 0.22, 0]} castShadow>
          <sphereGeometry args={[0.28, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.4]} />
          <primitive object={mat} attach="material" />
        </mesh>
      )
  }
}

// ============================================
// SMOOTH BODY
// ============================================
function Body({ 
  strength, 
  endurance, 
  shirtColor, 
  shortsColor, 
  accentColor,
  skinColor 
}: { 
  strength: number
  endurance: number
  shirtColor: string
  shortsColor: string
  accentColor: string
  skinColor: string
}) {
  const muscleScale = 0.8 + (strength / 100) * 0.35
  const hasDefinition = strength > 35

  return (
    <group position={[0, 1.15, 0]}>
      {/* Chest/Torso - smooth rounded shape */}
      <mesh castShadow>
        <capsuleGeometry args={[0.28 * muscleScale, 0.45, 8, 16]} />
        <meshStandardMaterial color={shirtColor} roughness={0.7} />
      </mesh>
      
      {/* Chest definition */}
      {hasDefinition && (
        <>
          <mesh position={[-0.12, 0.1, 0.22]} castShadow>
            <sphereGeometry args={[0.1 * muscleScale, 12, 12]} />
            <meshStandardMaterial color={shirtColor} roughness={0.6} />
          </mesh>
          <mesh position={[0.12, 0.1, 0.22]} castShadow>
            <sphereGeometry args={[0.1 * muscleScale, 12, 12]} />
            <meshStandardMaterial color={shirtColor} roughness={0.6} />
          </mesh>
        </>
      )}
      
      {/* Accent stripe on shirt */}
      <mesh position={[0, 0.12, 0.27]}>
        <boxGeometry args={[0.4 * muscleScale, 0.04, 0.02]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.2} />
      </mesh>
      
      {/* Abs/Stomach area */}
      <mesh position={[0, -0.35, 0]} castShadow>
        <capsuleGeometry args={[0.22 * muscleScale, 0.35, 8, 16]} />
        <meshStandardMaterial color={skinColor} roughness={0.5} />
      </mesh>
      
      {/* Six pack definition */}
      {strength > 40 && endurance > 25 && (
        <group>
          {[-0.08, 0.08].map((x) =>
            [-0.15, -0.05, 0.05].map((y, i) => (
              <mesh key={`${x}-${i}`} position={[x, y, 0.18]} castShadow>
                <sphereGeometry args={[0.045, 8, 8]} />
                <meshStandardMaterial color={skinColor} roughness={0.4} />
              </mesh>
            ))
          )}
        </group>
      )}
      
      {/* Shorts - smooth shape */}
      <mesh position={[0, -0.85, 0]} castShadow>
        <capsuleGeometry args={[0.26 * muscleScale, 0.4, 8, 16]} />
        <meshStandardMaterial color={shortsColor} roughness={0.8} />
      </mesh>
      
      {/* Waistband */}
      <mesh position={[0, -0.65, 0.18]}>
        <boxGeometry args={[0.45 * muscleScale, 0.06, 0.03]} />
        <meshStandardMaterial color={accentColor} />
      </mesh>
    </group>
  )
}

// ============================================
// SMOOTH ARM
// ============================================
function Arm({ side, strength, shirtColor, skinColor }: { side: 'left' | 'right'; strength: number; shirtColor: string; skinColor: string }) {
  const xOffset = side === 'left' ? -0.38 : 0.38
  const muscleScale = 0.8 + (strength / 100) * 0.3

  return (
    <group position={[xOffset, 1.35, 0]}>
      {/* Shoulder - smooth cap */}
      <mesh castShadow>
        <sphereGeometry args={[0.16 * muscleScale, 16, 16]} />
        <meshStandardMaterial color={shirtColor} roughness={0.7} />
      </mesh>
      
      {/* Upper arm */}
      <mesh position={[0, -0.32, 0]} castShadow>
        <capsuleGeometry args={[0.09 * muscleScale, 0.45, 8, 16]} />
        <meshStandardMaterial color={skinColor} roughness={0.5} />
      </mesh>
      
      {/* Bicep */}
      {strength > 25 && (
        <mesh position={[side === 'left' ? -0.03 : 0.03, -0.22, 0.04]} castShadow>
          <sphereGeometry args={[0.08 * muscleScale, 12, 12]} />
          <meshStandardMaterial color={skinColor} roughness={0.5} />
        </mesh>
      )}
      
      {/* Elbow */}
      <mesh position={[0, -0.6, 0]}>
        <sphereGeometry args={[0.065, 10, 10]} />
        <meshStandardMaterial color={skinColor} roughness={0.5} />
      </mesh>
      
      {/* Forearm */}
      <mesh position={[0, -0.95, 0]} castShadow>
        <capsuleGeometry args={[0.07 * muscleScale, 0.45, 8, 16]} />
        <meshStandardMaterial color={skinColor} roughness={0.5} />
      </mesh>
      
      {/* Hand */}
      <mesh position={[0, -1.25, 0.02]} castShadow>
        <sphereGeometry args={[0.075, 10, 10]} />
        <meshStandardMaterial color={skinColor} roughness={0.5} />
      </mesh>
    </group>
  )
}

// ============================================
// SMOOTH LEG
// ============================================
function Leg({ side, strength, shortsColor, skinColor }: { side: 'left' | 'right'; strength: number; shortsColor: string; skinColor: string }) {
  const xOffset = side === 'left' ? -0.16 : 0.16
  const muscleScale = 0.85 + (strength / 100) * 0.25

  return (
    <group position={[xOffset, 0.3, 0]}>
      {/* Hip */}
      <mesh position={[0, 0.1, -0.05]} castShadow>
        <sphereGeometry args={[0.18 * muscleScale, 14, 14]} />
        <meshStandardMaterial color={shortsColor} roughness={0.8} />
      </mesh>
      
      {/* Thigh */}
      <mesh position={[0, -0.25, 0]} castShadow>
        <capsuleGeometry args={[0.14 * muscleScale, 0.55, 8, 16]} />
        <meshStandardMaterial color={skinColor} roughness={0.5} />
      </mesh>
      
      {/* Quad definition */}
      {strength > 30 && (
        <>
          <mesh position={[-0.04, -0.2, 0.1]} castShadow>
            <sphereGeometry args={[0.055 * muscleScale, 10, 10]} />
            <meshStandardMaterial color={skinColor} />
          </mesh>
          <mesh position={[0.04, -0.2, 0.1]} castShadow>
            <sphereGeometry args={[0.055 * muscleScale, 10, 10]} />
            <meshStandardMaterial color={skinColor} />
          </mesh>
        </>
      )}
      
      {/* Knee */}
      <mesh position={[0, -0.6, 0]}>
        <sphereGeometry args={[0.09, 12, 12]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>
      
      {/* Calf */}
      <mesh position={[0, -1.0, -0.02]} castShadow>
        <capsuleGeometry args={[0.1 * muscleScale, 0.5, 8, 16]} />
        <meshStandardMaterial color={skinColor} roughness={0.5} />
      </mesh>
      
      {/* Calf muscle */}
      {strength > 40 && (
        <mesh position={[0, -0.95, -0.08]} castShadow>
          <sphereGeometry args={[0.07 * muscleScale, 10, 10]} />
          <meshStandardMaterial color={skinColor} />
        </mesh>
      )}
      
      {/* Shoe */}
      <mesh position={[0, -1.4, 0.05]} castShadow>
        <boxGeometry args={[0.12, 0.15, 0.25]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
      </mesh>
    </group>
  )
}

// ============================================
// EFFECTS
// ============================================
function AuraEffect({ intensity, color }: { intensity: number; color: string }) {
  const particlesRef = useRef<THREE.Points>(null)
  
  const particles = useMemo(() => {
    const count = Math.floor(intensity * 60)
    const positions = new Float32Array(count * 3)
    const c = new THREE.Color(color)
    const colors = new Float32Array(count * 3)
    
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      const r = 1.6 + Math.random() * 0.8
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) + 0.5
      positions[i * 3 + 2] = r * Math.cos(phi)
      
      colors[i * 3] = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b
    }
    return { positions, colors }
  }, [intensity, color])
  
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[particles.positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[particles.colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.05} vertexColors transparent opacity={0.5} blending={THREE.AdditiveBlending} sizeAttenuation />
    </points>
  )
}

function LevelBadge({ level, position }: { level: number; position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.5) * 0.04
    }
  })
  
  const colors = ['#6b7280', '#22c55e', '#3b82f6', '#fbbf24', '#a855f7']
  const color = level >= 30 ? colors[4] : level >= 20 ? colors[3] : level >= 10 ? colors[2] : level >= 5 ? colors[1] : colors[0]
  
  return (
    <group ref={ref} position={position}>
      <mesh>
        <torusGeometry args={[0.1, 0.015, 6, 24]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh position={[0, 0, 0.015]}>
        <circleGeometry args={[0.075, 24]} />
        <meshBasicMaterial color="#1f2937" />
      </mesh>
    </group>
  )
}

// ============================================
// LIGHTING
// ============================================
function CinematicLighting({ discipline }: { discipline: number }) {
  return (
    <>
      <directionalLight position={[4, 5, 4]} intensity={1.1} castShadow shadow-mapSize={[2048, 2048]} shadow-bias={-0.0005} color="#fff8f0" />
      <directionalLight position={[-3, 2, 3]} intensity={0.35} color="#e8f0ff" />
      <directionalLight position={[0, 4, -4]} intensity={0.5} />
      <ambientLight intensity={0.2} />
      {discipline > 35 && <pointLight position={[0, 1, 2]} intensity={discipline / 90} distance={5} color="#a855f7" />}
    </>
  )
}

// ============================================
// STATS
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
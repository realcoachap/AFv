'use client'

/**
 * Realistic Avatar V4 - Modular Anatomical System
 * Combines detailed body parts with premium materials
 * Each muscle group scales independently based on RPG stats
 */

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei'
import { EffectComposer, Bloom, SSAO } from '@react-three/postprocessing'
import * as THREE from 'three'
import type { AvatarCustomization } from '@/app/lib/rpg/customization'

type RealisticAvatarV4Props = {
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
// MATERIALS - Enhanced Physical Materials
// ============================================
function createSkinMaterial(color: string) {
  return new THREE.MeshPhysicalMaterial({
    color: color,
    roughness: 0.4,
    metalness: 0.0,
    clearcoat: 0.15,      // Reduced from 0.3
    clearcoatRoughness: 0.4,
    sheen: 0.1,           // Reduced from 0.25
    sheenColor: new THREE.Color(0xffe4c4),
    sheenRoughness: 0.5,
    ior: 1.45,
  })
}

function createClothingMaterial(color: string) {
  return new THREE.MeshPhysicalMaterial({
    color: color,
    roughness: 0.6,
    metalness: 0.1,
    clearcoat: 0.2,
    clearcoatRoughness: 0.3,
  })
}

function createAccentMaterial(color: string) {
  return new THREE.MeshPhysicalMaterial({
    color: color,
    roughness: 0.4,
    metalness: 0.2,
    clearcoat: 0.5,
    emissive: color,
    emissiveIntensity: 0.15,
  })
}

// ============================================
// MODULAR BODY PARTS
// ============================================

// Head with face details
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
  const skinMat = useMemo(() => createSkinMaterial(skinColor), [skinColor])
  const hairMat = useMemo(() => createClothingMaterial(hairColor), [hairColor])
  
  // Brow angle based on discipline
  const browAngle = discipline > 50 ? -0.2 : 0

  return (
    <group position={[0, 2.1, 0]}>
      {/* Main head */}
      <mesh castShadow>
        <capsuleGeometry args={[0.26, 0.35, 8, 16]} />
        <primitive object={skinMat} attach="material" />
      </mesh>
      
      {/* Jaw */}
      <mesh position={[0, -0.22, 0.08]} castShadow>
        <sphereGeometry args={[0.2, 16, 16]} />
        <primitive object={skinMat} attach="material" />
      </mesh>
      
      {/* Eyes */}
      <group position={[-0.09, 0.02, 0.22]}>
        <mesh>
          <sphereGeometry args={[0.045, 12, 12]} />
          <meshStandardMaterial color="#f5f5f5" />
        </mesh>
        <mesh position={[0, 0, 0.035]}>
          <circleGeometry args={[0.024, 12]} />
          <meshStandardMaterial color={eyeColor} />
        </mesh>
      </group>
      <group position={[0.09, 0.02, 0.22]}>
        <mesh>
          <sphereGeometry args={[0.045, 12, 12]} />
          <meshStandardMaterial color="#f5f5f5" />
        </mesh>
        <mesh position={[0, 0, 0.035]}>
          <circleGeometry args={[0.024, 12]} />
          <meshStandardMaterial color={eyeColor} />
        </mesh>
      </group>
      
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
      
      {/* Nose */}
      <mesh position={[0, -0.05, 0.28]} castShadow>
        <sphereGeometry args={[0.055, 12, 12]} />
        <primitive object={skinMat} attach="material" />
      </mesh>
      
      {/* Mouth */}
      <mesh position={[0, -0.18, 0.22]}>
        <boxGeometry args={[0.12, 0.025, 0.02]} />
        <meshStandardMaterial color="#c97e7e" />
      </mesh>
      
      {/* Hair - simplified styles */}
      {hairStyle !== 'bald' && (
        <mesh position={[0, 0.22, 0]} castShadow>
          <sphereGeometry args={[0.28, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.4]} />
          <primitive object={hairMat} attach="material" />
        </mesh>
      )}
      
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

// Modular Torso with separate muscle groups
function Torso({ 
  strength, 
  endurance, 
  shirtColor, 
  accentColor,
  skinColor 
}: { 
  strength: number
  endurance: number
  shirtColor: string
  accentColor: string
  skinColor: string
}) {
  // Individual muscle scales based on strength
  const chestScale = 1 + (strength / 100) * 0.35
  const shoulderScale = 1 + (strength / 100) * 0.4
  const abDefinition = strength > 40 && endurance > 25

  const shirtMat = useMemo(() => createClothingMaterial(shirtColor), [shirtColor])
  const accentMat = useMemo(() => createAccentMaterial(accentColor), [accentColor])
  const skinMat = useMemo(() => createSkinMaterial(skinColor), [skinColor])

  return (
    <group position={[0, 1.15, 0]}>
      {/* CHEST - Scales with strength */}
      <group scale={[chestScale, chestScale * 0.9, chestScale * 0.8]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.28, 0.45, 8, 16]} />
          <primitive object={shirtMat} attach="material" />
        </mesh>
        
        {/* Pectoral definition */}
        {strength > 30 && (
          <>
            <mesh position={[-0.12, 0.1, 0.22]} castShadow>
              <sphereGeometry args={[0.1, 12, 12]} />
              <primitive object={shirtMat} attach="material" />
            </mesh>
            <mesh position={[0.12, 0.1, 0.22]} castShadow>
              <sphereGeometry args={[0.1, 12, 12]} />
              <primitive object={shirtMat} attach="material" />
            </mesh>
          </>
        )}
      </group>
      
      {/* Accent stripe */}
      <mesh position={[0, 0.12, 0.27]}>
        <boxGeometry args={[0.4, 0.04, 0.02]} />
        <primitive object={accentMat} attach="material" />
      </mesh>
      
      {/* ABS - Show if strong AND lean */}
      <group position={[0, -0.35, 0]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.22, 0.35, 8, 16]} />
          <primitive object={skinMat} attach="material" />
        </mesh>
        
        {/* Six pack */}
        {abDefinition && (
          <group>
            {[-0.08, 0.08].map((x) =>
              [-0.15, -0.05, 0.05].map((y, i) => (
                <mesh key={`${x}-${i}`} position={[x, y, 0.18]} castShadow>
                  <sphereGeometry args={[0.045, 8, 8]} />
                  <primitive object={skinMat} attach="material" />
                </mesh>
              ))
            )}
          </group>
        )}
      </group>
    </group>
  )
}

// Modular Arm with bicep/tricep separation
function Arm({ 
  side, 
  strength, 
  shirtColor, 
  skinColor 
}: { 
  side: 'left' | 'right'
  strength: number
  shirtColor: string
  skinColor: string
}) {
  const xOffset = side === 'left' ? -0.38 : 0.38
  const armScale = 1 + (strength / 100) * 0.3
  const bicepScale = 1 + (strength / 100) * 0.5

  const shirtMat = useMemo(() => createClothingMaterial(shirtColor), [shirtColor])
  const skinMat = useMemo(() => createSkinMaterial(skinColor), [skinColor])

  return (
    <group position={[xOffset, 1.35, 0]}>
      {/* SHOULDER/DELTOID - High impact muscle */}
      <group scale={[armScale, armScale, armScale]}>
        <mesh castShadow>
          <sphereGeometry args={[0.16, 16, 16]} />
          <primitive object={shirtMat} attach="material" />
        </mesh>
      </group>
      
      {/* UPPER ARM */}
      <mesh position={[0, -0.32, 0]} castShadow>
        <capsuleGeometry args={[0.09 * armScale, 0.45, 8, 16]} />
        <primitive object={skinMat} attach="material" />
      </mesh>
      
      {/* BICEP - Separated muscle that scales more */}
      {strength > 20 && (
        <mesh 
          position={[side === 'left' ? -0.03 : 0.03, -0.22, 0.04]} 
          castShadow
          scale={[bicepScale, bicepScale, bicepScale]}
        >
          <sphereGeometry args={[0.08, 12, 12]} />
          <primitive object={skinMat} attach="material" />
        </mesh>
      )}
      
      {/* ELBOW */}
      <mesh position={[0, -0.6, 0]}>
        <sphereGeometry args={[0.065, 10, 10]} />
        <primitive object={skinMat} attach="material" />
      </mesh>
      
      {/* FOREARM */}
      <mesh position={[0, -0.95, 0]} castShadow>
        <capsuleGeometry args={[0.07 * armScale, 0.45, 8, 16]} />
        <primitive object={skinMat} attach="material" />
      </mesh>
      
      {/* HAND */}
      <mesh position={[0, -1.25, 0.02]} castShadow>
        <sphereGeometry args={[0.075, 10, 10]} />
        <primitive object={skinMat} attach="material" />
      </mesh>
    </group>
  )
}

// Modular Leg with quad/calf separation
function Leg({ 
  side, 
  strength, 
  shortsColor, 
  skinColor 
}: { 
  side: 'left' | 'right'
  strength: number
  shortsColor: string
  skinColor: string
}) {
  const xOffset = side === 'left' ? -0.16 : 0.16
  const thighScale = 1 + (strength / 100) * 0.25
  const calfScale = 1 + (strength / 100) * 0.35

  const shortsMat = useMemo(() => createClothingMaterial(shortsColor), [shortsColor])
  const skinMat = useMemo(() => createSkinMaterial(skinColor), [skinColor])

  return (
    <group position={[xOffset, 0.3, 0]}>
      {/* HIP/SHORTS */}
      <mesh position={[0, 0.1, -0.05]} castShadow>
        <sphereGeometry args={[0.18, 14, 14]} />
        <primitive object={shortsMat} attach="material" />
      </mesh>
      
      {/* THIGH */}
      <group scale={[thighScale, 1, thighScale]}>
        <mesh position={[0, -0.25, 0]} castShadow>
          <capsuleGeometry args={[0.14, 0.55, 8, 16]} />
          <primitive object={skinMat} attach="material" />
        </mesh>
      </group>
      
      {/* QUAD DEFINITION */}
      {strength > 30 && (
        <>
          <mesh position={[-0.04, -0.2, 0.1]} castShadow>
            <sphereGeometry args={[0.055 * thighScale, 10, 10]} />
            <primitive object={skinMat} attach="material" />
          </mesh>
          <mesh position={[0.04, -0.2, 0.1]} castShadow>
            <sphereGeometry args={[0.055 * thighScale, 10, 10]} />
            <primitive object={skinMat} attach="material" />
          </mesh>
        </>
      )}
      
      {/* KNEE */}
      <mesh position={[0, -0.6, 0]}>
        <sphereGeometry args={[0.09, 12, 12]} />
        <primitive object={skinMat} attach="material" />
      </mesh>
      
      {/* CALF */}
      <group scale={[calfScale, 1, calfScale]}>
        <mesh position={[0, -1.0, -0.02]} castShadow>
          <capsuleGeometry args={[0.1, 0.5, 8, 16]} />
          <primitive object={skinMat} attach="material" />
        </mesh>
      </group>
      
      {/* CALF MUSCLE */}
      {strength > 40 && (
        <mesh position={[0, -0.95, -0.08]} castShadow>
          <sphereGeometry args={[0.07 * calfScale, 10, 10]} />
          <primitive object={skinMat} attach="material" />
        </mesh>
      )}
      
      {/* SHOE */}
      <mesh position={[0, -1.4, 0.05]} castShadow>
        <boxGeometry args={[0.12, 0.15, 0.25]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
      </mesh>
    </group>
  )
}

// Complete Character Assembly
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

  // Breathing animation
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
      <Head 
        skinColor={skinColor}
        hairStyle={customization?.hairStyle || 'short'}
        hairColor={customization?.hairColor || '#2c1810'}
        eyeColor={customization?.eyeColor || '#4a3728'}
        discipline={discipline}
      />
      
      <Torso 
        strength={strength}
        endurance={endurance}
        shirtColor={scheme.shirt}
        accentColor={scheme.accent}
        skinColor={skinColor}
      />
      
      <Arm side="left" strength={strength} shirtColor={scheme.shirt} skinColor={skinColor} />
      <Arm side="right" strength={strength} shirtColor={scheme.shirt} skinColor={skinColor} />
      
      <Leg side="left" strength={strength} shortsColor={scheme.shorts} skinColor={skinColor} />
      <Leg side="right" strength={strength} shortsColor={scheme.shorts} skinColor={skinColor} />
    </group>
  )
}

// ============================================
// LIGHTING - Cinematic Setup
// ============================================
function CinematicLighting({ discipline }: { discipline: number }) {
  const lightIntensity = 1 + (discipline / 100)

  return (
    <>
      {/* Key Light - Main illumination */}
      <spotLight
        position={[4, 6, 4]}
        angle={Math.PI / 6}
        penumbra={0.3}
        intensity={800 * lightIntensity}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />
      
      {/* Fill Light - Soft fill */}
      <directionalLight
        position={[-3, 2, 3]}
        intensity={300}
        color="#ffeedd"
      />
      
      {/* Rim Light - Edge separation */}
      <spotLight
        position={[0, 4, -3]}
        angle={Math.PI / 4}
        penumbra={0.5}
        intensity={300}         // Reduced from 500
        color="#ccddff"
      />
      
      {/* Ambient */}
      <ambientLight intensity={0.2} />
    </>
  )
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function RealisticAvatarV4({
  strength,
  endurance,
  discipline,
  level,
  colorScheme = 'navy',
  size = 'lg',
  autoRotate = true,
  customization,
  showStats = true,
}: RealisticAvatarV4Props) {
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
        camera={{ position: [2.5, 1.5, 6], fov: 32 }}
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
        
        {/* Post-Processing */}
        <EffectComposer>
          <Bloom 
            intensity={0.15}          // Reduced from 0.4
            luminanceThreshold={0.8}  // Increased from 0.6
            luminanceSmoothing={0.3}
            height={300}
          />
          <SSAO 
            samples={16}
            radius={0.5}
            intensity={15}          // Reduced from 20
            luminanceInfluence={0.5}
          />
        </EffectComposer>
        
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
      
      {showStats && (
        <div className="absolute bottom-2 left-2 right-2 bg-black/70 rounded-lg p-2 text-white text-xs">
          <div className="flex justify-between">
            <span>💪 STR: {strength}</span>
            <span>🏃 END: {endurance}</span>
            <span>🎯 DIS: {discipline}</span>
            <span>⭐ LVL: {level}</span>
          </div>
        </div>
      )}
    </div>
  )
}

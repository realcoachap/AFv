'use client'

/**
 * Realistic Avatar V4 - Modular Anatomical System
 * Combines detailed body parts with premium materials
 * Each muscle group scales independently based on RPG stats
 * 
 * REFACTORED: Now uses shared utilities from @/app/lib/rpg/avatar-helpers
 */

import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import type { AvatarCustomization } from '@/app/lib/rpg/customization'
import { 
  createSkinMaterial, 
  createClothingMaterial, 
  createAccentMaterial,
  getColorScheme,
  SimpleStatsOverlay
} from '@/app/lib/rpg/avatar-helpers'
import { getColorScheme as getThemeColors } from '@/app/lib/rpg/themes'

// Mobile detection hook
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  return isMobile
}

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

// Custom hook for material management with cleanup
function useMaterials(skinColor: string, shirtColor: string, shortsColor: string, accentColor: string, hairColor: string) {
  const materials = useMemo(() => ({
    skin: createSkinMaterial(skinColor),
    shirt: createClothingMaterial(shirtColor),
    shorts: createClothingMaterial(shortsColor),
    accent: createAccentMaterial(accentColor),
    hair: createClothingMaterial(hairColor),
    white: new THREE.MeshStandardMaterial({ color: '#f5f5f5' }),
    dark: new THREE.MeshStandardMaterial({ color: '#1a1a1a', roughness: 0.8 }),
    lip: new THREE.MeshStandardMaterial({ color: '#c97e7e' }),
  }), [skinColor, shirtColor, shortsColor, accentColor, hairColor])

  // Note: Material disposal removed to prevent React Strict Mode crashes
  // Three.js handles cleanup automatically when component unmounts

  return materials
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
  discipline,
  isMobile = false
}: { 
  skinColor: string
  hairStyle: string
  hairColor: string
  eyeColor: string
  discipline: number
  isMobile?: boolean
}) {
  const skinMat = useMemo(() => createSkinMaterial(skinColor), [skinColor])
  const hairMat = useMemo(() => createClothingMaterial(hairColor), [hairColor])
  
  // Cleanup materials on unmount
  useEffect(() => {
    return () => {
      skinMat.dispose()
      hairMat.dispose()
    }
  }, [skinMat, hairMat])
  
  // Brow angle based on discipline
  const browAngle = discipline > 50 ? -0.2 : 0
  
  // Reduce geometry complexity on mobile
  const seg = isMobile ? 8 : 16

  return (
    <group position={[0, 2.1, 0]}>
      {/* Main head */}
      <mesh castShadow>
        <capsuleGeometry args={[0.26, 0.35, isMobile ? 4 : 8, seg]} />
        <primitive object={skinMat} attach="material" />
      </mesh>
      
      {/* Jaw */}
      <mesh position={[0, -0.22, 0.08]} castShadow>
        <sphereGeometry args={[0.2, isMobile ? 8 : 16, isMobile ? 8 : 16]} />
        <primitive object={skinMat} attach="material" />
      </mesh>
      
      {/* Eyes */}
      <group position={[-0.09, 0.02, 0.22]}>
        <mesh>
          <sphereGeometry args={[0.045, isMobile ? 6 : 12, isMobile ? 6 : 12]} />
          <meshStandardMaterial color="#f5f5f5" />
        </mesh>
        <mesh position={[0, 0, 0.035]}>
          <circleGeometry args={[0.024, isMobile ? 6 : 12]} />
          <meshStandardMaterial color={eyeColor} />
        </mesh>
      </group>
      <group position={[0.09, 0.02, 0.22]}>
        <mesh>
          <sphereGeometry args={[0.045, isMobile ? 6 : 12, isMobile ? 6 : 12]} />
          <meshStandardMaterial color="#f5f5f5" />
        </mesh>
        <mesh position={[0, 0, 0.035]}>
          <circleGeometry args={[0.024, isMobile ? 6 : 12]} />
          <meshStandardMaterial color={eyeColor} />
        </mesh>
      </group>
      
      {/* Eyebrows */}
      <group rotation={[0, 0, browAngle]}>
        <mesh position={[-0.09, 0.14, 0.24]} castShadow>
          <capsuleGeometry args={[0.022, 0.1, isMobile ? 3 : 4, isMobile ? 4 : 8]} />
          <primitive object={hairMat} attach="material" />
        </mesh>
      </group>
      <group rotation={[0, 0, -browAngle]}>
        <mesh position={[0.09, 0.14, 0.24]} castShadow>
          <capsuleGeometry args={[0.022, 0.1, isMobile ? 3 : 4, isMobile ? 4 : 8]} />
          <primitive object={hairMat} attach="material" />
        </mesh>
      </group>
      
      {/* Nose */}
      <mesh position={[0, -0.05, 0.28]} castShadow>
        <sphereGeometry args={[0.055, isMobile ? 6 : 12, isMobile ? 6 : 12]} />
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
          <sphereGeometry args={[0.28, isMobile ? 8 : 16, isMobile ? 8 : 16, 0, Math.PI * 2, 0, Math.PI * 0.4]} />
          <primitive object={hairMat} attach="material" />
        </mesh>
      )}
      
      {/* Ears */}
      <mesh position={[-0.28, 0, 0]} rotation={[0, 0, Math.PI / 2.5]} castShadow>
        <capsuleGeometry args={[0.05, 0.12, isMobile ? 3 : 4, isMobile ? 4 : 8]} />
        <primitive object={skinMat} attach="material" />
      </mesh>
      <mesh position={[0.28, 0, 0]} rotation={[0, 0, -Math.PI / 2.5]} castShadow>
        <capsuleGeometry args={[0.05, 0.12, isMobile ? 3 : 4, isMobile ? 4 : 8]} />
        <primitive object={skinMat} attach="material" />
      </mesh>
      
      {/* Neck */}
      <mesh position={[0, -0.32, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.14, 0.25, seg]} />
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
  skinColor,
  isMobile = false
}: { 
  strength: number
  endurance: number
  shirtColor: string
  accentColor: string
  skinColor: string
  isMobile?: boolean
}) {
  // Individual muscle scales based on strength
  const chestScale = 1 + (strength / 100) * 0.35
  const shoulderScale = 1 + (strength / 100) * 0.4
  const abDefinition = strength > 40 && endurance > 25

  const shirtMat = useMemo(() => createClothingMaterial(shirtColor), [shirtColor])
  const accentMat = useMemo(() => createAccentMaterial(accentColor), [accentColor])
  const skinMat = useMemo(() => createSkinMaterial(skinColor), [skinColor])

  // Cleanup materials on unmount
  useEffect(() => {
    return () => {
      shirtMat.dispose()
      accentMat.dispose()
      skinMat.dispose()
    }
  }, [shirtMat, accentMat, skinMat])

  // Reduce geometry complexity on mobile
  const seg = isMobile ? 8 : 16

  return (
    <group position={[0, 1.15, 0]}>
      {/* CHEST - Scales with strength */}
      <group scale={[chestScale, chestScale * 0.9, chestScale * 0.8]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.28, 0.45, isMobile ? 4 : 8, seg]} />
          <primitive object={shirtMat} attach="material" />
        </mesh>
        
        {/* Pectoral definition */}
        {strength > 30 && (
          <>
            <mesh position={[-0.12, 0.1, 0.22]} castShadow>
              <sphereGeometry args={[0.1, isMobile ? 6 : 12, isMobile ? 6 : 12]} />
              <primitive object={shirtMat} attach="material" />
            </mesh>
            <mesh position={[0.12, 0.1, 0.22]} castShadow>
              <sphereGeometry args={[0.1, isMobile ? 6 : 12, isMobile ? 6 : 12]} />
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
          <capsuleGeometry args={[0.22, 0.35, isMobile ? 4 : 8, seg]} />
          <primitive object={skinMat} attach="material" />
        </mesh>
        
        {/* Six pack */}
        {abDefinition && (
          <group>
            {[-0.08, 0.08].map((x) =>
              [-0.15, -0.05, 0.05].map((y, i) => (
                <mesh key={`${x}-${i}`} position={[x, y, 0.18]} castShadow>
                  <sphereGeometry args={[0.045, isMobile ? 4 : 8, isMobile ? 4 : 8]} />
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
  skinColor,
  isMobile = false
}: { 
  side: 'left' | 'right'
  strength: number
  shirtColor: string
  skinColor: string
  isMobile?: boolean
}) {
  const xOffset = side === 'left' ? -0.38 : 0.38
  const armScale = 1 + (strength / 100) * 0.3
  const bicepScale = 1 + (strength / 100) * 0.5

  const shirtMat = useMemo(() => createClothingMaterial(shirtColor), [shirtColor])
  const skinMat = useMemo(() => createSkinMaterial(skinColor), [skinColor])

  // Cleanup materials on unmount
  useEffect(() => {
    return () => {
      shirtMat.dispose()
      skinMat.dispose()
    }
  }, [shirtMat, skinMat])

  // Reduce geometry complexity on mobile
  const seg = isMobile ? 8 : 16

  return (
    <group position={[xOffset, 1.35, 0]}>
      {/* SHOULDER/DELTOID - High impact muscle */}
      <group scale={[armScale, armScale, armScale]}>
        <mesh castShadow>
          <sphereGeometry args={[0.16, isMobile ? 8 : 16, isMobile ? 8 : 16]} />
          <primitive object={shirtMat} attach="material" />
        </mesh>
      </group>
      
      {/* UPPER ARM */}
      <mesh position={[0, -0.32, 0]} castShadow>
        <capsuleGeometry args={[0.09 * armScale, 0.45, isMobile ? 4 : 8, seg]} />
        <primitive object={skinMat} attach="material" />
      </mesh>
      
      {/* BICEP - Separated muscle that scales more */}
      {strength > 20 && (
        <mesh 
          position={[side === 'left' ? -0.03 : 0.03, -0.22, 0.04]} 
          castShadow
          scale={[bicepScale, bicepScale, bicepScale]}
        >
          <sphereGeometry args={[0.08, isMobile ? 6 : 12, isMobile ? 6 : 12]} />
          <primitive object={skinMat} attach="material" />
        </mesh>
      )}
      
      {/* ELBOW */}
      <mesh position={[0, -0.6, 0]}>
        <sphereGeometry args={[0.065, isMobile ? 5 : 10, isMobile ? 5 : 10]} />
        <primitive object={skinMat} attach="material" />
      </mesh>
      
      {/* FOREARM */}
      <mesh position={[0, -0.95, 0]} castShadow>
        <capsuleGeometry args={[0.07 * armScale, 0.45, isMobile ? 4 : 8, seg]} />
        <primitive object={skinMat} attach="material" />
      </mesh>
      
      {/* HAND */}
      <mesh position={[0, -1.25, 0.02]} castShadow>
        <sphereGeometry args={[0.075, isMobile ? 5 : 10, isMobile ? 5 : 10]} />
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
  skinColor,
  isMobile = false
}: { 
  side: 'left' | 'right'
  strength: number
  shortsColor: string
  skinColor: string
  isMobile?: boolean
}) {
  const xOffset = side === 'left' ? -0.16 : 0.16
  const thighScale = 1 + (strength / 100) * 0.25
  const calfScale = 1 + (strength / 100) * 0.35

  const shortsMat = useMemo(() => createClothingMaterial(shortsColor), [shortsColor])
  const skinMat = useMemo(() => createSkinMaterial(skinColor), [skinColor])

  // Cleanup materials on unmount
  useEffect(() => {
    return () => {
      shortsMat.dispose()
      skinMat.dispose()
    }
  }, [shortsMat, skinMat])

  // Reduce geometry complexity on mobile
  const seg = isMobile ? 8 : 16

  return (
    <group position={[xOffset, 0.3, 0]}>
      {/* HIP/SHORTS */}
      <mesh position={[0, 0.1, -0.05]} castShadow>
        <sphereGeometry args={[0.18, isMobile ? 7 : 14, isMobile ? 7 : 14]} />
        <primitive object={shortsMat} attach="material" />
      </mesh>
      
      {/* THIGH */}
      <group scale={[thighScale, 1, thighScale]}>
        <mesh position={[0, -0.25, 0]} castShadow>
          <capsuleGeometry args={[0.14, 0.55, isMobile ? 4 : 8, seg]} />
          <primitive object={skinMat} attach="material" />
        </mesh>
      </group>
      
      {/* QUAD DEFINITION */}
      {strength > 30 && (
        <>
          <mesh position={[-0.04, -0.2, 0.1]} castShadow>
            <sphereGeometry args={[0.055 * thighScale, isMobile ? 5 : 10, isMobile ? 5 : 10]} />
            <primitive object={skinMat} attach="material" />
          </mesh>
          <mesh position={[0.04, -0.2, 0.1]} castShadow>
            <sphereGeometry args={[0.055 * thighScale, isMobile ? 5 : 10, isMobile ? 5 : 10]} />
            <primitive object={skinMat} attach="material" />
          </mesh>
        </>
      )}
      
      {/* KNEE */}
      <mesh position={[0, -0.6, 0]}>
        <sphereGeometry args={[0.09, isMobile ? 6 : 12, isMobile ? 6 : 12]} />
        <primitive object={skinMat} attach="material" />
      </mesh>
      
      {/* CALF */}
      <group scale={[calfScale, 1, calfScale]}>
        <mesh position={[0, -1.0, -0.02]} castShadow>
          <capsuleGeometry args={[0.1, 0.5, isMobile ? 4 : 8, seg]} />
          <primitive object={skinMat} attach="material" />
        </mesh>
      </group>
      
      {/* CALF MUSCLE */}
      {strength > 40 && (
        <mesh position={[0, -0.95, -0.08]} castShadow>
          <sphereGeometry args={[0.07 * calfScale, isMobile ? 5 : 10, isMobile ? 5 : 10]} />
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
  isMobile = false,
}: {
  strength: number
  endurance: number
  discipline: number
  level: number
  colorScheme: string
  customization?: AvatarCustomization
  isMobile?: boolean
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

  const scheme = getThemeColors(colorScheme)
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
function CinematicLighting({ discipline, isMobile = false }: { discipline: number; isMobile?: boolean }) {
  const lightIntensity = 1 + (discipline / 100)
  const shadowMapSize = isMobile ? 1024 : 2048

  return (
    <>
      {/* Key Light - Main illumination */}
      <spotLight
        position={[4, 6, 4]}
        angle={Math.PI / 6}
        penumbra={0.3}
        intensity={isMobile ? 300 : 500}
        castShadow
        shadow-mapSize-width={shadowMapSize}
        shadow-mapSize-height={shadowMapSize}
        shadow-bias={-0.0001}
      />
      
      {/* Fill Light - Soft fill */}
      <directionalLight
        position={[-3, 2, 3]}
        intensity={isMobile ? 150 : 200}
        color="#ffeedd"
      />
      
      {/* Rim Light - Edge separation */}
      <spotLight
        position={[0, 4, -3]}
        angle={Math.PI / 4}
        penumbra={0.5}
        intensity={isMobile ? 150 : 200}
        color="#ccddff"
      />
      
      {/* Ambient */}
      <ambientLight intensity={isMobile ? 0.4 : 0.2} />
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
  const isMobile = useIsMobile()
  
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
          antialias: !isMobile, 
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0
        }}
      >
        <CinematicLighting discipline={discipline} isMobile={isMobile} />
        <Environment preset="studio" />
        
        <Character 
          strength={strength}
          endurance={endurance}
          discipline={discipline}
          level={level}
          colorScheme={colorScheme}
          customization={customization}
          isMobile={isMobile}
        />
        
        <ContactShadows
          position={[0, -1.5, 0]}
          opacity={isMobile ? 0.3 : 0.5}
          scale={12}
          blur={isMobile ? 1.5 : 2.5}
          far={4}
          resolution={isMobile ? 128 : 256}
        />
        
        {/* Post-processing disabled - caused crashes */}
        
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 2.8}
          maxPolarAngle={Math.PI / 1.9}
          autoRotate={autoRotate}
          autoRotateSpeed={isMobile ? 0.3 : 0.5}
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

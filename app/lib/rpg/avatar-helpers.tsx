/**
 * Avatar Helpers - Shared utilities for RPG avatar components
 * Consolidates duplicated code from 8+ avatar files
 * Saves ~800 lines of duplicated code
 */

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { AvatarCustomization } from './customization'
import { getStatModifiers } from './stats'
import { getColorScheme, getLevelBadgeColor, getStatTitle } from './themes'

// Re-export theme utilities for convenience
export { getColorScheme, getLevelBadgeColor, getStatTitle } from './themes'

// ============================================
// BODY PROPORTION CALCULATIONS
// ============================================

export interface BodyMetrics {
  muscleScale: number
  width: number
  definition: number
  height: number
  hasSixPack: boolean
  hasVascularity: boolean
  leanness: number
}

export interface BodyScale {
  shoulderWidth: number
  chestDepth: number
  armThickness: number
  legThickness: number
  waistWidth: number
}

/**
 * Calculate body metrics from stats - used by 8 avatar components
 */
export function calculateBodyMetrics(
  strength: number,
  endurance: number,
  level: number
): BodyMetrics {
  const muscleMass = strength / 100
  const leanness = endurance / 100
  const definition = (strength + endurance) / 200

  return {
    muscleScale: 0.7 + muscleMass * 0.6,
    width: 0.85 + muscleMass * 0.2,
    definition,
    height: 1 + (level / 100) * 0.1,
    hasSixPack: strength > 40 && endurance > 30,
    hasVascularity: strength > 60 && endurance > 50,
    leanness: 1 - leanness * 0.5,
  }
}

/**
 * Calculate body scale with RPG modifiers
 */
export function calculateBodyScale(
  strength: number,
  endurance: number,
  discipline: number
): BodyScale {
  const modifiers = getStatModifiers(strength, endurance, discipline)

  const muscleMultiplierMap: Record<string, number> = {
    huge: 1.6,
    muscular: 1.4,
    defined: 1.2,
    normal: 1.0,
  }

  const leannessMultiplierMap: Record<string, number> = {
    shredded: 0.75,
    athletic: 0.85,
    lean: 0.95,
    standard: 1.0,
  }

  const muscleMultiplier = muscleMultiplierMap[modifiers.muscleTier] || 1.0
  const leannessMultiplier = leannessMultiplierMap[modifiers.leannessTier] || 1.0
  const strengthBonus = strength / 100

  return {
    shoulderWidth: 1.0 * muscleMultiplier,
    chestDepth: 1.0 * muscleMultiplier,
    armThickness: 1.0 * muscleMultiplier * leannessMultiplier,
    legThickness: 1.0 * (1 + strengthBonus * 0.3) * leannessMultiplier,
    waistWidth: 0.85 * leannessMultiplier,
  }
}

/**
 * Get aura intensity based on discipline
 */
export function getAuraIntensity(discipline: number): number {
  if (discipline >= 75) return 1.0  // radiant
  if (discipline >= 50) return 0.7  // bright
  if (discipline >= 25) return 0.4  // faint
  return 0                          // none
}

/**
 * Get aura tier name
 */
export function getAuraTier(discipline: number): string {
  if (discipline >= 75) return 'radiant'
  if (discipline >= 50) return 'bright'
  if (discipline >= 25) return 'faint'
  return 'none'
}

// ============================================
// THREE.JS MATERIAL HELPERS
// ============================================

/**
 * Create realistic skin material - used across 6+ components
 */
export function createSkinMaterial(color: string): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color: color,
    roughness: 0.45,
    metalness: 0.0,
    clearcoat: 0.08,
    clearcoatRoughness: 0.5,
    sheen: 0.08,
    sheenColor: new THREE.Color(0xffe4c4),
    sheenRoughness: 0.5,
    ior: 1.45,
  })
}

/**
 * Create clothing material with physical properties
 */
export function createClothingMaterial(color: string): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color: color,
    roughness: 0.6,
    metalness: 0.1,
    clearcoat: 0.2,
    clearcoatRoughness: 0.3,
  })
}

/**
 * Create accent material with subtle glow
 */
export function createAccentMaterial(color: string, emissiveIntensity = 0.05): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color: color,
    roughness: 0.4,
    metalness: 0.2,
    clearcoat: 0.3,
    emissive: color,
    emissiveIntensity,
  })
}

/**
 * Create enhanced skin material with PBR properties
 */
export function createEnhancedSkinMaterial(color: string): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color: color,
    roughness: 0.35,
    metalness: 0.0,
    clearcoat: 0.4,
    clearcoatRoughness: 0.2,
    sheen: 0.3,
    sheenColor: new THREE.Color(0xffe4c4),
    sheenRoughness: 0.5,
    ior: 1.45,
  })
}

// ============================================
// REACT COMPONENTS (for use in Three.js scenes)
// ============================================

/**
 * StatsOverlay - UI component displayed on avatar
 * Used by RealisticAvatar, RealisticAvatarV2, RealisticAvatarV3, RealisticAvatarV4
 */
export function StatsOverlay({
  strength,
  endurance,
  discipline,
  level,
}: {
  strength: number
  endurance: number
  discipline: number
  level: number
}) {
  const avg = Math.floor((strength + endurance + discipline) / 3)
  const title = getStatTitle(avg)

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

/**
 * Simple StatsOverlay for simpler components
 */
export function SimpleStatsOverlay({
  strength,
  endurance,
  discipline,
  level,
}: {
  strength: number
  endurance: number
  discipline: number
  level: number
}) {
  return (
    <div className="absolute bottom-2 left-2 right-2 bg-black/70 rounded-lg p-2 text-white text-xs">
      <div className="flex justify-between">
        <span>💪 STR: {strength}</span>
        <span>🏃 END: {endurance}</span>
        <span>🎯 DIS: {discipline}</span>
        <span>⭐ LVL: {level}</span>
      </div>
    </div>
  )
}

function StatBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-bold text-gray-400 w-6">{label}</span>
      <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${value}%`, backgroundColor: color, boxShadow: `0 0 6px ${color}` }}
        />
      </div>
      <span className="text-xs text-white w-6 text-right">{value}</span>
    </div>
  )
}

/**
 * LevelBadge - 3D floating badge showing character level
 * Used by RealisticAvatar, RealisticAvatarV2, RealisticAvatarV3, RealisticAvatarV4
 */
export function LevelBadge({
  level,
  position,
}: {
  level: number
  position: [number, number, number]
}) {
  const ref = useRef<THREE.Group>(null)
  const color = getLevelBadgeColor(level)

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.5) * 0.04
    }
  })

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

/**
 * AuraEffect - Particle system aura around character
 * Used by RealisticAvatar, RealisticAvatarV2, RealisticAvatarV3, RealisticAvatarV4
 */
export function AuraEffect({
  intensity,
  color,
}: {
  intensity: number
  color: string
}) {
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
    return { positions, colors, count }
  }, [intensity, color])

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })

  if (particles.count === 0) return null

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[particles.positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[particles.colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.5}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  )
}

// ============================================
// BREATHING ANIMATION HOOK
// ============================================

/**
 * Hook for breathing animation - used by multiple avatar components
 */
export function useBreathingAnimation(
  groupRef: React.RefObject<THREE.Group | null>,
  options: {
    speed?: number
    amplitude?: number
    rotationAmplitude?: number
  } = {}
) {
  const { speed = 0.8, amplitude = 0.006, rotationAmplitude = 0.03 } = options

  useFrame((state) => {
    if (groupRef.current) {
      const breathe = Math.sin(state.clock.elapsedTime * speed) * amplitude
      groupRef.current.position.y = -0.8 + breathe
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * rotationAmplitude
    }
  })
}

// ============================================
// SVG AVATAR HELPERS (for Avatar2D)
// ============================================

export interface SVGBodyProportions {
  shoulderWidth: number
  chestWidth: number
  waistWidth: number
  armThickness: number
  legThickness: number
}

/**
 * Calculate SVG body proportions based on stats
 */
export function calculateSVGBodyProportions(
  strength: number,
  endurance: number
): SVGBodyProportions {
  const modifiers = getStatModifiers(strength, endurance, 0)

  const base = {
    shoulderWidth: 40,
    chestWidth: 35,
    waistWidth: 28,
    armThickness: 6,
    legThickness: 8,
  }

  // Muscle tier adjustments
  switch (modifiers.muscleTier) {
    case 'huge':
      return {
        shoulderWidth: 50,
        chestWidth: 45,
        waistWidth: 32,
        armThickness: 10,
        legThickness: 11,
      }
    case 'muscular':
      return {
        shoulderWidth: 46,
        chestWidth: 42,
        waistWidth: 30,
        armThickness: 9,
        legThickness: 10,
      }
    case 'defined':
      return {
        shoulderWidth: 43,
        chestWidth: 38,
        waistWidth: 29,
        armThickness: 7,
        legThickness: 9,
      }
  }

  // Leanness tier adjustments
  switch (modifiers.leannessTier) {
    case 'shredded':
      return {
        shoulderWidth: 38,
        chestWidth: 32,
        waistWidth: 24,
        armThickness: 5,
        legThickness: 7,
      }
    case 'athletic':
      return {
        shoulderWidth: 39,
        chestWidth: 33,
        waistWidth: 26,
        armThickness: 6,
        legThickness: 8,
      }
  }

  return base
}

// ============================================
// COMPONENT SIZE HELPERS
// ============================================

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl'

export interface SizeDimensions {
  width: number
  height: number
}

export const AVATAR_SIZES: Record<string, Record<AvatarSize, SizeDimensions>> = {
  v1: {
    sm: { width: 200, height: 280 },
    md: { width: 300, height: 420 },
    lg: { width: 400, height: 560 },
    xl: { width: 500, height: 700 },
  },
  v2: {
    sm: { width: 240, height: 320 },
    md: { width: 360, height: 480 },
    lg: { width: 480, height: 640 },
    xl: { width: 600, height: 800 },
  },
  v3: {
    sm: { width: 240, height: 340 },
    md: { width: 300, height: 440 },
    lg: { width: 380, height: 560 },
    xl: { width: 440, height: 640 },
  },
  v4: {
    sm: { width: 240, height: 340 },
    md: { width: 300, height: 440 },
    lg: { width: 380, height: 560 },
    xl: { width: 440, height: 640 },
  },
  avatar3d: {
    sm: { width: 160, height: 200 },
    md: { width: 240, height: 300 },
    lg: { width: 320, height: 400 },
    xl: { width: 400, height: 500 },
  },
  svg: {
    sm: { width: 80, height: 100 },
    md: { width: 120, height: 150 },
    lg: { width: 160, height: 200 },
    xl: { width: 200, height: 250 },
  },
}

'use client'

/**
 * SVG Avatar Component - Modern Gym Aesthetic
 * Renders customizable avatar that evolves with stats
 * 
 * REFACTORED: Now uses shared utilities from @/app/lib/rpg/avatar-helpers
 */

import { getStatModifiers } from '@/app/lib/rpg/stats'
import { calculateSVGBodyProportions, getColorScheme } from '@/app/lib/rpg/avatar-helpers'

type AvatarProps = {
  strength: number
  endurance: number
  discipline: number
  colorScheme?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export default function Avatar({
  strength,
  endurance,
  discipline,
  colorScheme = 'navy',
  size = 'lg',
}: AvatarProps) {
  const modifiers = getStatModifiers(strength, endurance, discipline)

  // Size mappings
  const sizes = {
    sm: { width: 80, height: 100 },
    md: { width: 120, height: 150 },
    lg: { width: 160, height: 200 },
    xl: { width: 200, height: 250 },
  }

  const { width, height } = sizes[size]

  // Use shared color scheme
  const scheme = getColorScheme(colorScheme)

  // Use shared body proportions calculation
  const baseBody = calculateSVGBodyProportions(strength, endurance)
  
  // Apply leanness modifiers to body proportions
  const getBodyProportions = () => {
    if (modifiers.leannessTier === 'shredded') {
      return {
        shoulderWidth: 38,
        chestWidth: 32,
        waistWidth: 24,
        armThickness: 5,
        legThickness: 7,
      }
    } else if (modifiers.leannessTier === 'athletic') {
      return {
        shoulderWidth: 39,
        chestWidth: 33,
        waistWidth: 26,
        armThickness: 6,
        legThickness: 8,
      }
    }
    return baseBody
  }

  const body = getBodyProportions()

  // Aura effect based on discipline
  const getAuraEffect = () => {
    if (modifiers.auraTier === 'radiant') {
      return (
        <>
          <circle
            cx={width / 2}
            cy={height / 2}
            r={90}
            fill="none"
            stroke={scheme.accent}
            strokeWidth="3"
            opacity="0.6"
            className="animate-pulse"
          />
          <circle
            cx={width / 2}
            cy={height / 2}
            r={80}
            fill="none"
            stroke={scheme.accent}
            strokeWidth="2"
            opacity="0.4"
            className="animate-pulse"
            style={{ animationDelay: '0.3s' }}
          />
        </>
      )
    } else if (modifiers.auraTier === 'bright') {
      return (
        <circle
          cx={width / 2}
          cy={height / 2}
          r={85}
          fill="none"
          stroke={scheme.accent}
          strokeWidth="2"
          opacity="0.5"
          className="animate-pulse"
        />
      )
    } else if (modifiers.auraTier === 'faint') {
      return (
        <circle
          cx={width / 2}
          cy={height / 2}
          r={80}
          fill="none"
          stroke={scheme.accent}
          strokeWidth="1"
          opacity="0.3"
          className="animate-pulse"
        />
      )
    }
    return null
  }

  return (
    <div className="flex items-center justify-center">
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-lg"
      >
        {/* Aura Effects (behind character) */}
        {getAuraEffect()}

        {/* Head */}
        <circle
          cx={width / 2}
          cy={50}
          r={20}
          fill="#F0D0B0"
          stroke={scheme.primary}
          strokeWidth="2"
        />

        {/* Neck */}
        <rect
          x={width / 2 - 5}
          y={68}
          width={10}
          height={12}
          fill="#F0D0B0"
          stroke={scheme.primary}
          strokeWidth="1"
        />

        {/* Torso (shirt) */}
        <path
          d={`
            M ${width / 2 - body.shoulderWidth / 2} 80
            L ${width / 2 + body.shoulderWidth / 2} 80
            L ${width / 2 + body.chestWidth / 2} 120
            L ${width / 2 + body.waistWidth / 2} 145
            L ${width / 2 - body.waistWidth / 2} 145
            L ${width / 2 - body.chestWidth / 2} 120
            Z
          `}
          fill={scheme.primary}
          stroke={scheme.secondary}
          strokeWidth="2"
        />

        {/* Chest definition line */}
        <path
          d={`M ${width / 2 - body.chestWidth / 2 + 5} 100 L ${width / 2 + body.chestWidth / 2 - 5} 100`}
          stroke={scheme.secondary}
          strokeWidth="1"
          opacity="0.5"
        />

        {/* Arms */}
        <rect
          x={width / 2 - body.shoulderWidth / 2 - body.armThickness}
          y={82}
          width={body.armThickness}
          height={35}
          rx={body.armThickness / 2}
          fill="#F0D0B0"
          stroke={scheme.primary}
          strokeWidth="1"
        />
        <rect
          x={width / 2 + body.shoulderWidth / 2}
          y={82}
          width={body.armThickness}
          height={35}
          rx={body.armThickness / 2}
          fill="#F0D0B0"
          stroke={scheme.primary}
          strokeWidth="1"
        />

        {/* Shorts/Pants */}
        <rect
          x={width / 2 - body.waistWidth / 2}
          y={143}
          width={body.waistWidth}
          height={25}
          fill={scheme.secondary}
          stroke={scheme.primary}
          strokeWidth="2"
        />

        {/* Legs */}
        <rect
          x={width / 2 - body.waistWidth / 2 + 2}
          y={166}
          width={body.legThickness}
          height={30}
          rx={body.legThickness / 2}
          fill="#F0D0B0"
          stroke={scheme.primary}
          strokeWidth="1"
        />
        <rect
          x={width / 2 + body.waistWidth / 2 - body.legThickness - 2}
          y={166}
          width={body.legThickness}
          height={30}
          rx={body.legThickness / 2}
          fill="#F0D0B0"
          stroke={scheme.primary}
          strokeWidth="1"
        />

        {/* Shoes */}
        <ellipse
          cx={width / 2 - body.waistWidth / 2 + 2 + body.legThickness / 2}
          cy={198}
          rx={body.legThickness + 2}
          ry={6}
          fill={scheme.primary}
        />
        <ellipse
          cx={width / 2 + body.waistWidth / 2 - body.legThickness / 2 - 2}
          cy={198}
          rx={body.legThickness + 2}
          ry={6}
          fill={scheme.primary}
        />

        {/* Face details */}
        <circle cx={width / 2 - 6} cy={48} r={2} fill={scheme.primary} />
        <circle cx={width / 2 + 6} cy={48} r={2} fill={scheme.primary} />
        <path
          d={`M ${width / 2 - 4} 56 Q ${width / 2} 58 ${width / 2 + 4} 56`}
          stroke={scheme.primary}
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
      </svg>

      {/* Stat tier labels (for debugging) */}
      {/* <div className="text-xs text-gray-500 mt-2 text-center">
        <p>Muscle: {modifiers.muscleTier}</p>
        <p>Lean: {modifiers.leannessTier}</p>
        <p>Aura: {modifiers.auraTier}</p>
      </div> */}
    </div>
  )
}
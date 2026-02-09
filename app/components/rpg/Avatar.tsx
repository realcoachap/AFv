'use client'

/**
 * SVG Avatar Component - Modern Gym Aesthetic
 * Renders customizable avatar that evolves with stats
 */

import { getStatModifiers } from '@/app/lib/rpg/stats'

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

  // Color schemes
  const colors = {
    navy: {
      primary: '#1A2332',
      secondary: '#E8DCC4',
      accent: '#00D9FF',
    },
    black: {
      primary: '#000000',
      secondary: '#FFFFFF',
      accent: '#FF0000',
    },
    red: {
      primary: '#DC2626',
      secondary: '#FEE2E2',
      accent: '#991B1B',
    },
    blue: {
      primary: '#2563EB',
      secondary: '#DBEAFE',
      accent: '#1E40AF',
    },
  }

  const scheme = colors[colorScheme as keyof typeof colors] || colors.navy

  // Body proportions based on stats
  const getBodyProportions = () => {
    const base = {
      shoulderWidth: 40,
      chestWidth: 35,
      waistWidth: 28,
      armThickness: 6,
      legThickness: 8,
    }

    // Strength increases bulk
    if (modifiers.muscleTier === 'huge') {
      return {
        shoulderWidth: 50,
        chestWidth: 45,
        waistWidth: 32,
        armThickness: 10,
        legThickness: 11,
      }
    } else if (modifiers.muscleTier === 'muscular') {
      return {
        shoulderWidth: 46,
        chestWidth: 42,
        waistWidth: 30,
        armThickness: 9,
        legThickness: 10,
      }
    } else if (modifiers.muscleTier === 'defined') {
      return {
        shoulderWidth: 43,
        chestWidth: 38,
        waistWidth: 29,
        armThickness: 7,
        legThickness: 9,
      }
    }

    // Endurance makes leaner
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

    return base
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
          stroke={scheme.primary}
          strokeWidth="2"
        />

        {/* Accent line on shirt */}
        <path
          d={`
            M ${width / 2 - body.chestWidth / 2 + 5} 100
            L ${width / 2 + body.chestWidth / 2 - 5} 100
          `}
          stroke={scheme.accent}
          strokeWidth="2"
          opacity="0.7"
        />

        {/* Arms */}
        {/* Left arm */}
        <rect
          x={width / 2 - body.shoulderWidth / 2 - body.armThickness}
          y={85}
          width={body.armThickness}
          height={50}
          fill="#F0D0B0"
          stroke={scheme.primary}
          strokeWidth="1"
          rx={body.armThickness / 2}
        />
        {/* Right arm */}
        <rect
          x={width / 2 + body.shoulderWidth / 2}
          y={85}
          width={body.armThickness}
          height={50}
          fill="#F0D0B0"
          stroke={scheme.primary}
          strokeWidth="1"
          rx={body.armThickness / 2}
        />

        {/* Shorts/Pants */}
        <rect
          x={width / 2 - body.waistWidth / 2}
          y={145}
          width={body.waistWidth}
          height={35}
          fill={scheme.secondary}
          stroke={scheme.primary}
          strokeWidth="2"
        />

        {/* Legs */}
        {/* Left leg */}
        <rect
          x={width / 2 - body.waistWidth / 2 + 2}
          y={178}
          width={body.legThickness}
          height={45}
          fill="#F0D0B0"
          stroke={scheme.primary}
          strokeWidth="1"
          rx={body.legThickness / 2}
        />
        {/* Right leg */}
        <rect
          x={width / 2 + body.waistWidth / 2 - body.legThickness - 2}
          y={178}
          width={body.legThickness}
          height={45}
          fill="#F0D0B0"
          stroke={scheme.primary}
          strokeWidth="1"
          rx={body.legThickness / 2}
        />

        {/* Shoes */}
        <ellipse
          cx={width / 2 - body.waistWidth / 2 + 2 + body.legThickness / 2}
          cy={230}
          rx={body.legThickness + 2}
          ry={6}
          fill={scheme.primary}
        />
        <ellipse
          cx={width / 2 + body.waistWidth / 2 - body.legThickness / 2 - 2}
          cy={230}
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

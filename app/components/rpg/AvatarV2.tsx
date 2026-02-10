'use client'

/**
 * Enhanced Avatar Component V2 - Modern Gym Aesthetic
 * Way more detailed, customizable, and realistic
 */

import { getStatModifiers } from '@/app/lib/rpg/stats'

type AvatarProps = {
  strength: number
  endurance: number
  discipline: number
  config?: {
    hairStyle?: string
    hairColor?: string
    skinTone?: string
    outfit?: string
    colorScheme?: string
    accessories?: {
      headband?: boolean
      wristbands?: boolean
      watch?: boolean
    }
  }
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export default function AvatarV2({
  strength,
  endurance,
  discipline,
  config = {},
  size = 'lg',
}: AvatarProps) {
  const modifiers = getStatModifiers(strength, endurance, discipline)

  // Size mappings
  const sizes = {
    sm: { width: 100, height: 140 },
    md: { width: 140, height: 200 },
    lg: { width: 180, height: 260 },
    xl: { width: 220, height: 320 },
  }

  const { width, height } = sizes[size]

  // Configuration defaults
  const hairStyle = config.hairStyle || 'short'
  const hairColor = config.hairColor || '#2C1810'
  const skinTone = config.skinTone || '#F0D0B0'
  const outfit = config.outfit || 'tee'
  const colorScheme = config.colorScheme || 'navy'

  // Color schemes
  const colors = {
    navy: { primary: '#1A2332', secondary: '#E8DCC4', accent: '#00D9FF' },
    black: { primary: '#000000', secondary: '#FFFFFF', accent: '#FF0000' },
    red: { primary: '#DC2626', secondary: '#FEE2E2', accent: '#991B1B' },
    blue: { primary: '#2563EB', secondary: '#DBEAFE', accent: '#1E40AF' },
    purple: { primary: '#9333EA', secondary: '#F3E8FF', accent: '#7C3AED' },
  }

  const scheme = colors[colorScheme as keyof typeof colors] || colors.navy

  // Body proportions based on stats (more detailed)
  const getBodyProps = () => {
    const base = {
      shoulderWidth: 44,
      chestWidth: 38,
      waistWidth: 30,
      armThickness: 7,
      legThickness: 9,
      neckWidth: 10,
      absVisible: false,
      muscleDefinition: 'normal' as 'normal' | 'defined' | 'ripped' | 'huge',
    }

    // Strength increases bulk and definition
    if (strength >= 75) {
      return {
        ...base,
        shoulderWidth: 54,
        chestWidth: 50,
        waistWidth: 34,
        armThickness: 12,
        legThickness: 13,
        neckWidth: 13,
        absVisible: true,
        muscleDefinition: 'huge' as const,
      }
    } else if (strength >= 50) {
      return {
        ...base,
        shoulderWidth: 50,
        chestWidth: 46,
        waistWidth: 32,
        armThickness: 10,
        legThickness: 11,
        neckWidth: 12,
        absVisible: true,
        muscleDefinition: 'ripped' as const,
      }
    } else if (strength >= 25) {
      return {
        ...base,
        shoulderWidth: 47,
        chestWidth: 42,
        waistWidth: 31,
        armThickness: 8,
        legThickness: 10,
        neckWidth: 11,
        absVisible: false,
        muscleDefinition: 'defined' as const,
      }
    }

    // Endurance makes leaner
    if (endurance >= 50) {
      return {
        ...base,
        shoulderWidth: 40,
        chestWidth: 34,
        waistWidth: 26,
        armThickness: 6,
        legThickness: 8,
        neckWidth: 9,
        absVisible: true,
        muscleDefinition: 'defined' as const,
      }
    }

    return base
  }

  const body = getBodyProps()

  // Aura effects based on discipline
  const renderAura = () => {
    if (discipline < 25) return null

    const auraRadius = discipline >= 75 ? 95 : discipline >= 50 ? 88 : 82
    const auraOpacity = discipline >= 75 ? 0.7 : discipline >= 50 ? 0.5 : 0.3
    const strokeWidth = discipline >= 75 ? 3 : discipline >= 50 ? 2 : 1

    return (
      <>
        <circle
          cx={width / 2}
          cy={height / 2}
          r={auraRadius}
          fill="none"
          stroke={scheme.accent}
          strokeWidth={strokeWidth}
          opacity={auraOpacity}
          className="animate-pulse"
        />
        {discipline >= 50 && (
          <circle
            cx={width / 2}
            cy={height / 2}
            r={auraRadius - 8}
            fill="none"
            stroke={scheme.accent}
            strokeWidth={strokeWidth - 0.5}
            opacity={auraOpacity - 0.2}
            className="animate-pulse"
            style={{ animationDelay: '0.3s' }}
          />
        )}
      </>
    )
  }

  // Render different hairstyles
  const renderHair = () => {
    const headX = width / 2
    const headY = 42
    const headRadius = 22

    switch (hairStyle) {
      case 'bald':
        return null

      case 'buzzcut':
      case 'short':
        return (
          <ellipse
            cx={headX}
            cy={headY - 8}
            rx={headRadius - 2}
            ry={12}
            fill={hairColor}
          />
        )

      case 'fade':
      case 'medium':
        return (
          <path
            d={`M ${headX - headRadius + 5} ${headY - 5}
                Q ${headX} ${headY - 20} ${headX + headRadius - 5} ${headY - 5}
                L ${headX + headRadius - 3} ${headY + 5}
                Q ${headX} ${headY - 15} ${headX - headRadius + 3} ${headY + 5}
                Z`}
            fill={hairColor}
          />
        )

      case 'long':
        return (
          <>
            <path
              d={`M ${headX - headRadius + 3} ${headY - 5}
                  Q ${headX} ${headY - 22} ${headX + headRadius - 3} ${headY - 5}
                  L ${headX + headRadius} ${headY + 25}
                  Q ${headX} ${headY + 30} ${headX - headRadius} ${headY + 25}
                  Z`}
              fill={hairColor}
            />
          </>
        )

      case 'ponytail':
        return (
          <>
            {/* Front hair */}
            <ellipse
              cx={headX}
              cy={headY - 8}
              rx={headRadius - 2}
              ry={14}
              fill={hairColor}
            />
            {/* Ponytail */}
            <ellipse
              cx={headX}
              cy={headY + 30}
              rx={8}
              ry={18}
              fill={hairColor}
            />
          </>
        )

      case 'bun':
        return (
          <>
            {/* Front hair */}
            <ellipse
              cx={headX}
              cy={headY - 8}
              rx={headRadius - 2}
              ry={12}
              fill={hairColor}
            />
            {/* Top bun */}
            <circle cx={headX} cy={headY - 20} r={8} fill={hairColor} />
          </>
        )

      case 'mohawk':
        return (
          <path
            d={`M ${headX - 8} ${headY}
                L ${headX - 5} ${headY - 25}
                L ${headX} ${headY - 28}
                L ${headX + 5} ${headY - 25}
                L ${headX + 8} ${headY}
                Z`}
            fill={hairColor}
          />
        )

      case 'dreadlocks':
        return (
          <>
            <ellipse cx={headX} cy={headY - 8} rx={headRadius} ry={14} fill={hairColor} />
            {/* Dreads */}
            {[-12, -6, 0, 6, 12].map((offset, i) => (
              <rect
                key={i}
                x={headX + offset - 2}
                y={headY + 15}
                width={4}
                height={20}
                rx={2}
                fill={hairColor}
              />
            ))}
          </>
        )

      default:
        return (
          <ellipse
            cx={headX}
            cy={headY - 8}
            rx={headRadius - 2}
            ry={12}
            fill={hairColor}
          />
        )
    }
  }

  // Render different outfits
  const renderOutfit = () => {
    const shoulderL = width / 2 - body.shoulderWidth / 2
    const shoulderR = width / 2 + body.shoulderWidth / 2
    const chestL = width / 2 - body.chestWidth / 2
    const chestR = width / 2 + body.chestWidth / 2
    const waistL = width / 2 - body.waistWidth / 2
    const waistR = width / 2 + body.waistWidth / 2

    switch (outfit) {
      case 'tank':
        return (
          <path
            d={`M ${shoulderL + 8} 80
                L ${shoulderR - 8} 80
                L ${chestR - 5} 120
                L ${waistR} 145
                L ${waistL} 145
                L ${chestL + 5} 120
                Z`}
            fill={scheme.primary}
            stroke={scheme.primary}
            strokeWidth="2"
          />
        )

      case 'compression':
        return (
          <>
            <path
              d={`M ${shoulderL} 80
                  L ${shoulderR} 80
                  L ${chestR} 120
                  L ${waistR + 2} 155
                  L ${waistL - 2} 155
                  L ${chestL} 120
                  Z`}
              fill={scheme.primary}
              stroke={scheme.primary}
              strokeWidth="1"
            />
            {/* Compression lines */}
            <line x1={width / 2 - 15} y1={90} x2={width / 2 - 12} y2={140} stroke={scheme.accent} strokeWidth="1" opacity="0.5" />
            <line x1={width / 2 + 15} y1={90} x2={width / 2 + 12} y2={140} stroke={scheme.accent} strokeWidth="1" opacity="0.5" />
          </>
        )

      case 'hoodie':
        return (
          <>
            {/* Hood */}
            <path
              d={`M ${shoulderL - 5} 78
                  Q ${width / 2} 50 ${shoulderR + 5} 78`}
              fill={scheme.primary}
              stroke={scheme.primary}
              strokeWidth="2"
            />
            {/* Body */}
            <path
              d={`M ${shoulderL} 80
                  L ${shoulderR} 80
                  L ${chestR + 5} 120
                  L ${waistR + 5} 150
                  L ${waistL - 5} 150
                  L ${chestL - 5} 120
                  Z`}
              fill={scheme.primary}
              stroke={scheme.primary}
              strokeWidth="2"
            />
            {/* Drawstrings */}
            <circle cx={width / 2 - 8} cy={75} r={2} fill={scheme.secondary} />
            <circle cx={width / 2 + 8} cy={75} r={2} fill={scheme.secondary} />
          </>
        )

      default: // 'tee'
        return (
          <>
            <path
              d={`M ${shoulderL} 80
                  L ${shoulderR} 80
                  L ${chestR} 120
                  L ${waistR} 145
                  L ${waistL} 145
                  L ${chestL} 120
                  Z`}
              fill={scheme.primary}
              stroke={scheme.primary}
              strokeWidth="2"
            />
            {/* V-neck */}
            <path
              d={`M ${width / 2 - 6} 80
                  L ${width / 2} 88
                  L ${width / 2 + 6} 80`}
              fill={skinTone}
            />
          </>
        )
    }
  }

  // Render abs if visible
  const renderAbs = () => {
    if (!body.absVisible) return null

    return (
      <g opacity="0.3">
        {/* Six pack */}
        <rect x={width / 2 - 8} y={110} width={6} height={8} rx={1} fill="#000" />
        <rect x={width / 2 + 2} y={110} width={6} height={8} rx={1} fill="#000" />
        <rect x={width / 2 - 8} y={120} width={6} height={8} rx={1} fill="#000" />
        <rect x={width / 2 + 2} y={120} width={6} height={8} rx={1} fill="#000" />
        <rect x={width / 2 - 8} y={130} width={6} height={8} rx={1} fill="#000" />
        <rect x={width / 2 + 2} y={130} width={6} height={8} rx={1} fill="#000" />
      </g>
    )
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
        {/* Aura Effects (behind) */}
        {renderAura()}

        {/* Hair (behind head for some styles) */}
        {['long', 'ponytail', 'dreadlocks'].includes(hairStyle) && renderHair()}

        {/* Head */}
        <circle
          cx={width / 2}
          cy={42}
          r={22}
          fill={skinTone}
          stroke={scheme.primary}
          strokeWidth="2"
        />

        {/* Face Features */}
        <g>
          {/* Eyes */}
          <circle cx={width / 2 - 7} cy={40} r={2.5} fill="#2C1810" />
          <circle cx={width / 2 + 7} cy={40} r={2.5} fill="#2C1810" />
          <circle cx={width / 2 - 6.5} cy={39.5} r={1} fill="#FFF" />
          <circle cx={width / 2 + 7.5} cy={39.5} r={1} fill="#FFF" />

          {/* Eyebrows */}
          <path
            d={`M ${width / 2 - 10} 35 Q ${width / 2 - 7} 34 ${width / 2 - 4} 35`}
            stroke="#2C1810"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d={`M ${width / 2 + 4} 35 Q ${width / 2 + 7} 34 ${width / 2 + 10} 35`}
            stroke="#2C1810"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />

          {/* Nose */}
          <line
            x1={width / 2}
            y1={44}
            x2={width / 2}
            y2={48}
            stroke={scheme.primary}
            strokeWidth="1"
            opacity="0.3"
          />

          {/* Mouth (determined expression) */}
          <path
            d={`M ${width / 2 - 5} 52 Q ${width / 2} 53 ${width / 2 + 5} 52`}
            stroke={scheme.primary}
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
        </g>

        {/* Hair (in front for most styles) */}
        {!['long', 'ponytail', 'dreadlocks'].includes(hairStyle) && renderHair()}

        {/* Neck */}
        <rect
          x={width / 2 - body.neckWidth / 2}
          y={62}
          width={body.neckWidth}
          height={18}
          fill={skinTone}
          stroke={scheme.primary}
          strokeWidth="1"
        />

        {/* Torso (outfit) */}
        {renderOutfit()}
        {renderAbs()}

        {/* Arms */}
        <rect
          x={width / 2 - body.shoulderWidth / 2 - body.armThickness}
          y={85}
          width={body.armThickness}
          height={55}
          fill={skinTone}
          stroke={scheme.primary}
          strokeWidth="1"
          rx={body.armThickness / 2}
        />
        <rect
          x={width / 2 + body.shoulderWidth / 2}
          y={85}
          width={body.armThickness}
          height={55}
          fill={skinTone}
          stroke={scheme.primary}
          strokeWidth="1"
          rx={body.armThickness / 2}
        />

        {/* Muscle definition on arms (if strong) */}
        {body.muscleDefinition !== 'normal' && (
          <g opacity="0.2">
            <ellipse
              cx={width / 2 - body.shoulderWidth / 2 - body.armThickness / 2}
              cy={100}
              rx={body.armThickness / 2 - 1}
              ry={8}
              fill="#000"
            />
            <ellipse
              cx={width / 2 + body.shoulderWidth / 2 + body.armThickness / 2}
              cy={100}
              rx={body.armThickness / 2 - 1}
              ry={8}
              fill="#000"
            />
          </g>
        )}

        {/* Shorts */}
        <rect
          x={width / 2 - body.waistWidth / 2}
          y={145}
          width={body.waistWidth}
          height={38}
          fill={scheme.secondary}
          stroke={scheme.primary}
          strokeWidth="2"
        />

        {/* Legs */}
        <rect
          x={width / 2 - body.waistWidth / 2 + 3}
          y={181}
          width={body.legThickness}
          height={50}
          fill={skinTone}
          stroke={scheme.primary}
          strokeWidth="1"
          rx={body.legThickness / 2}
        />
        <rect
          x={width / 2 + body.waistWidth / 2 - body.legThickness - 3}
          y={181}
          width={body.legThickness}
          height={50}
          fill={skinTone}
          stroke={scheme.primary}
          strokeWidth="1"
          rx={body.legThickness / 2}
        />

        {/* Shoes */}
        <ellipse
          cx={width / 2 - body.waistWidth / 2 + 3 + body.legThickness / 2}
          cy={238}
          rx={body.legThickness + 3}
          ry={7}
          fill={scheme.primary}
        />
        <ellipse
          cx={width / 2 + body.waistWidth / 2 - body.legThickness / 2 - 3}
          cy={238}
          rx={body.legThickness + 3}
          ry={7}
          fill={scheme.primary}
        />

        {/* Accessories */}
        {config.accessories?.headband && (
          <rect
            x={width / 2 - 20}
            y={35}
            width={40}
            height={5}
            rx={2}
            fill={scheme.accent}
          />
        )}

        {config.accessories?.wristbands && (
          <>
            <rect
              x={width / 2 - body.shoulderWidth / 2 - body.armThickness - 1}
              y={125}
              width={body.armThickness + 2}
              height={6}
              rx={2}
              fill={scheme.accent}
            />
            <rect
              x={width / 2 + body.shoulderWidth / 2 - 1}
              y={125}
              width={body.armThickness + 2}
              height={6}
              rx={2}
              fill={scheme.accent}
            />
          </>
        )}

        {config.accessories?.watch && (
          <rect
            x={width / 2 + body.shoulderWidth / 2}
            y={115}
            width={body.armThickness + 2}
            height={8}
            rx={2}
            fill="#333"
            opacity="0.8"
          />
        )}
      </svg>
    </div>
  )
}

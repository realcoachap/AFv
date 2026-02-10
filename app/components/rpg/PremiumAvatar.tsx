'use client'

/**
 * Premium Avatar Component - Visual Wow Factor
 * Stylistic character portraits that evolve with stats
 */

import { useMemo } from 'react'
import type { AvatarCustomization } from '@/app/lib/rpg/customization'

type AvatarProps = {
  level: number
  strength: number
  endurance: number
  discipline: number
  colorScheme?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'share'
  customization?: AvatarCustomization
}

export default function PremiumAvatar({
  level,
  strength,
  endurance,
  discipline,
  colorScheme = 'navy',
  size = 'lg',
  customization,
}: AvatarProps) {
  // Calculate visual tiers
  const tiers = useMemo(() => {
    const avgStats = (strength + endurance + discipline) / 3
    
    return {
      physique: strength > 70 ? 'beast' : strength > 50 ? 'muscular' : strength > 30 ? 'fit' : 'lean',
      leanness: endurance > 70 ? 'shredded' : endurance > 50 ? 'defined' : 'athletic',
      aura: discipline > 80 ? 'legendary' : discipline > 60 ? 'epic' : discipline > 40 ? 'rare' : discipline > 20 ? 'uncommon' : 'common',
      frame: level >= 30 ? 'mythic' : level >= 20 ? 'legendary' : level >= 15 ? 'epic' : level >= 10 ? 'rare' : level >= 5 ? 'uncommon' : 'common',
    }
  }, [strength, endurance, discipline, level])

  // Size configurations
  const sizes = {
    sm: { width: 120, height: 120, scale: 0.6 },
    md: { width: 180, height: 180, scale: 0.9 },
    lg: { width: 280, height: 280, scale: 1.4 },
    xl: { width: 400, height: 400, scale: 2 },
    share: { width: 600, height: 600, scale: 3 },
  }

  const { width, height, scale } = sizes[size]

  // Color schemes with premium gradients
  const schemes: Record<string, {
    bg: string
    bgGradient: string
    frame: string
    frameGradient: string
    accent: string
    aura: string
    text: string
  }> = {
    navy: {
      bg: '#0f172a',
      bgGradient: 'radial-gradient(circle at 30% 30%, #1e293b 0%, #0f172a 50%, #020617 100%)',
      frame: '#e8dcc4',
      frameGradient: 'linear-gradient(135deg, #e8dcc4 0%, #d4c4a8 50%, #c4b498 100%)',
      accent: '#00d9ff',
      aura: 'rgba(0, 217, 255, 0.3)',
      text: '#e8dcc4',
    },
    crimson: {
      bg: '#450a0a',
      bgGradient: 'radial-gradient(circle at 30% 30%, #7f1d1d 0%, #450a0a 50%, #000000 100%)',
      frame: '#fca5a5',
      frameGradient: 'linear-gradient(135deg, #fca5a5 0%, #f87171 50%, #ef4444 100%)',
      accent: '#ff6b6b',
      aura: 'rgba(255, 107, 107, 0.3)',
      text: '#fee2e2',
    },
    emerald: {
      bg: '#022c22',
      bgGradient: 'radial-gradient(circle at 30% 30%, #064e3b 0%, #022c22 50%, #000000 100%)',
      frame: '#6ee7b7',
      frameGradient: 'linear-gradient(135deg, #6ee7b7 0%, #34d399 50%, #10b981 100%)',
      accent: '#00ff88',
      aura: 'rgba(0, 255, 136, 0.3)',
      text: '#d1fae5',
    },
    gold: {
      bg: '#422006',
      bgGradient: 'radial-gradient(circle at 30% 30%, #713f12 0%, #422006 50%, #000000 100%)',
      frame: '#fde047',
      frameGradient: 'linear-gradient(135deg, #fde047 0%, #facc15 50%, #eab308 100%)',
      accent: '#ffd700',
      aura: 'rgba(255, 215, 0, 0.4)',
      text: '#fef9c3',
    },
    void: {
      bg: '#000000',
      bgGradient: 'radial-gradient(circle at 50% 50%, #1a1a2e 0%, #0f0f1a 30%, #000000 70%)',
      frame: '#a855f7',
      frameGradient: 'linear-gradient(135deg, #c084fc 0%, #a855f7 50%, #7c3aed 100%)',
      accent: '#c084fc',
      aura: 'rgba(168, 85, 247, 0.4)',
      text: '#f3e8ff',
    },
  }

  const scheme = schemes[colorScheme] || schemes.navy

  // Frame styles based on tier
  const frameStyles: Record<string, { border: number; glow: string; decoration: string }> = {
    common: { border: 4, glow: '0 0 20px rgba(255,255,255,0.1)', decoration: 'none' },
    uncommon: { border: 6, glow: '0 0 30px rgba(255,255,255,0.2)', decoration: 'simple' },
    rare: { border: 8, glow: '0 0 40px rgba(0,217,255,0.3)', decoration: 'ornate' },
    epic: { border: 10, glow: '0 0 60px rgba(0,217,255,0.5)', decoration: 'elaborate' },
    legendary: { border: 12, glow: '0 0 80px rgba(255,215,0,0.6)', decoration: 'mythic' },
    mythic: { border: 14, glow: '0 0 100px rgba(168,85,247,0.8)', decoration: 'divine' },
  }

  const frame = frameStyles[tiers.frame]

  // Skin tone from customization
  const skinTone = customization?.skinTone || '#d4a574'
  
  // Calculate physique modifiers
  const muscleWidth = 1 + (strength / 200) // 1.0 to 1.35
  const muscleDepth = 1 + (strength / 150) // 1.0 to 1.47
  const leanness = 1 - (endurance / 300) // 1.0 to 0.77 (lower = leaner)

  return (
    <div 
      className="relative inline-block"
      style={{ width, height }}
    >
      {/* Outer glow for high discipline */}
      {discipline > 40 && (
        <div 
          className="absolute inset-0 rounded-full animate-pulse"
          style={{
            background: `radial-gradient(circle, ${scheme.aura} 0%, transparent 70%)`,
            filter: 'blur(20px)',
            transform: 'scale(1.2)',
          }}
        />
      )}

      {/* Main avatar container */}
      <div 
        className="absolute inset-0 rounded-full overflow-hidden"
        style={{
          background: scheme.bgGradient,
          boxShadow: `
            inset 0 0 60px rgba(0,0,0,0.5),
            ${frame.glow}
          `,
          border: `${frame.border}px solid transparent`,
          backgroundClip: 'padding-box',
        }}
      >
        {/* Frame border with gradient */}
        <div 
          className="absolute inset-0 rounded-full"
          style={{
            padding: frame.border,
            background: scheme.frameGradient,
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />

        {/* Corner decorations for rare+ frames */}
        {tiers.frame !== 'common' && tiers.frame !== 'uncommon' && (
          <>
            <div 
              className="absolute top-2 left-2 w-6 h-6"
              style={{
                borderTop: `3px solid ${scheme.accent}`,
                borderLeft: `3px solid ${scheme.accent}`,
                opacity: 0.8,
              }}
            />
            <div 
              className="absolute top-2 right-2 w-6 h-6"
              style={{
                borderTop: `3px solid ${scheme.accent}`,
                borderRight: `3px solid ${scheme.accent}`,
                opacity: 0.8,
              }}
            />
            <div 
              className="absolute bottom-2 left-2 w-6 h-6"
              style={{
                borderBottom: `3px solid ${scheme.accent}`,
                borderLeft: `3px solid ${scheme.accent}`,
                opacity: 0.8,
              }}
            />
            <div 
              className="absolute bottom-2 right-2 w-6 h-6"
              style={{
                borderBottom: `3px solid ${scheme.accent}`,
                borderRight: `3px solid ${scheme.accent}`,
                opacity: 0.8,
              }}
            />
          </>
        )}

        {/* Level badge */}
        <div 
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20"
          style={{
            background: scheme.frameGradient,
            borderRadius: '999px',
            padding: '4px 16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
          }}
        >
          <span 
            className="font-bold text-lg"
            style={{ 
              color: scheme.bg,
              textShadow: '0 1px 2px rgba(255,255,255,0.3)',
            }}
          >
            LVL {level}
          </span>
        </div>

        {/* Character SVG */}
        <svg
          viewBox="0 0 200 240"
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          style={{ 
            width: 140 * scale,
            height: 168 * scale,
            filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.5))',
          }}
        >
          <defs>
            {/* Muscle gradient */}
            <linearGradient id="muscleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={skinTone} />
              <stop offset="50%" stopColor={adjustBrightness(skinTone, -10)} />
              <stop offset="100%" stopColor={adjustBrightness(skinTone, -20)} />
            </linearGradient>
            
            {/* Shadow gradient */}
            <linearGradient id="shadowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(0,0,0,0)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.3)" />
            </linearGradient>

            {/* Metal gradient for epic+ frames */}
            {tiers.frame === 'legendary' || tiers.frame === 'mythic' ? (
              <linearGradient id="metalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffd700" />
                <stop offset="50%" stopColor="#ffed4e" />
                <stop offset="100%" stopColor="#d4af37" />
              </linearGradient>
            ) : null}
          </defs>

          {/* Aura effect for high discipline */}
          {discipline > 60 && (
            <ellipse 
              cx="100" 
              cy="180" 
              rx={80 + (discipline - 60) / 2} 
              ry={30 + (discipline - 60) / 4}
              fill={scheme.aura}
              className="animate-pulse"
            />
          )}

          {/* Character Group - scaled by physique */}
          <g transform={`translate(100, 120) scale(${muscleWidth * leanness}, ${muscleDepth}) translate(-100, -120)`}>
            
            {/* Legs */}
            <path
              d={`
                M 70 160 
                L 70 220 
                Q 85 225 100 220 
                Q 115 225 130 220 
                L 130 160
                Z
              `}
              fill="url(#muscleGradient)"
              stroke={adjustBrightness(skinTone, -30)}
              strokeWidth="1"
            />
            
            {/* Muscle definition lines */}
            {strength > 30 && (
              <>
                <path d="M 85 170 Q 90 190 85 210" stroke={adjustBrightness(skinTone, -25)} strokeWidth="1" fill="none" opacity="0.6" />
                <path d="M 115 170 Q 110 190 115 210" stroke={adjustBrightness(skinTone, -25)} strokeWidth="1" fill="none" opacity="0.6" />
              </>
            )}

            {/* Torso - dynamic based on strength */}
            <path
              d={`
                M ${70 - (strength / 10)} 90
                L ${130 + (strength / 10)} 90
                L ${125 + (strength / 15)} 165
                L ${75 - (strength / 15)} 165
                Z
              `}
              fill={scheme.bg}
              stroke={scheme.accent}
              strokeWidth="2"
            />
            
            {/* Shirt details */}
            <path
              d={`
                M ${85 - (strength / 20)} 90
                L ${85 - (strength / 20)} 140
                M ${115 + (strength / 20)} 90
                L ${115 + (strength / 20)} 140
              `}
              stroke={scheme.accent}
              strokeWidth="2"
              opacity="0.5"
            />

            {/* Chest muscle definition for high strength */}
            {strength > 50 && (
              <path
                d={`
                  M 100 110
                  Q ${85 - (strength / 20)} 125 100 140
                  Q ${115 + (strength / 20)} 125 100 110
                `}
                stroke={scheme.accent}
                strokeWidth="1"
                fill="none"
                opacity="0.4"
              />
            )}

            {/* Arms - dynamic muscle size */}
            <ellipse 
              cx={55 - (strength / 15)} 
              cy="115" 
              rx={12 + (strength / 10)} 
              ry={35 + (strength / 15)} 
              fill="url(#muscleGradient)"
              stroke={adjustBrightness(skinTone, -30)}
              strokeWidth="1"
            />
            
            <ellipse 
              cx={145 + (strength / 15)} 
              cy="115" 
              rx={12 + (strength / 10)} 
              ry={35 + (strength / 15)} 
              fill="url(#muscleGradient)"
              stroke={adjustBrightness(skinTone, -30)}
              strokeWidth="1"
            />

            {/* Bicep peaks for high strength */}
            {strength > 60 && (
              <>
                <ellipse cx={50 - (strength / 15)} cy="105" rx={8} ry={12} fill={adjustBrightness(skinTone, -10)} opacity="0.6" />
                <ellipse cx={150 + (strength / 15)} cy="105" rx={8} ry={12} fill={adjustBrightness(skinTone, -10)} opacity="0.6" />
              </>
            )}

            {/* Neck */}
            <rect x="85" y="75" width="30" height="20" fill={skinTone} rx="5" />

            {/* Head */}
            <ellipse cx="100" cy="55" rx="25" ry="30" fill={skinTone} />
            
            {/* Face shadow */}
            <ellipse cx="100" cy="65" rx="20" ry="15" fill="url(#shadowGradient)" opacity="0.5" />

            {/* Eyes */}
            <circle cx="90" cy="52" r="4" fill="#fff" />
            <circle cx="110" cy="52" r="4" fill="#fff" />
            <circle cx="90" cy="52" r="2" fill={customization?.eyeColor || '#4a3728'} />
            <circle cx="110" cy="52" r="2" fill={customization?.eyeColor || '#4a3728'} />

            {/* Determined eyebrows for high discipline */}
            <path 
              d={discipline > 50 ? "M 85 45 L 95 47 M 105 47 L 115 45" : "M 85 46 L 95 46 M 105 46 L 115 46"}
              stroke={adjustBrightness(skinTone, -40)}
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />

            {/* Smile - bigger with streak */}
            <path
              d={`
                M 92 65
                Q 100 ${68 + (discipline / 20)} 108 65
              `}
              stroke={adjustBrightness(skinTone, -30)}
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />

            {/* Hair */}
            {renderHair(customization?.hairStyle || 'short', customization?.hairColor || '#2c1810')}

          </g>

          {/* Floating particles for epic+ */}
          {tiers.aura === 'epic' || tiers.aura === 'legendary' ? (
            <>
              <circle cx="40" cy="60" r="2" fill={scheme.accent} opacity="0.6">
                <animate attributeName="cy" values="60;40;60" dur="3s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.6;0;0.6" dur="3s" repeatCount="indefinite" />
              </circle>
              <circle cx="160" cy="80" r="3" fill={scheme.accent} opacity="0.4">
                <animate attributeName="cy" values="80;50;80" dur="4s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.4;0;0.4" dur="4s" repeatCount="indefinite" />
              </circle>
              <circle cx="120" cy="40" r="2" fill={scheme.accent} opacity="0.5">
                <animate attributeName="cy" values="40;20;40" dur="3.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.5;0;0.5" dur="3.5s" repeatCount="indefinite" />
              </circle>
            </>
          ) : null}
        </svg>

        {/* Power level indicator */}
        <div 
          className="absolute top-4 right-4 flex items-center gap-1"
          style={{
            background: 'rgba(0,0,0,0.6)',
            padding: '4px 10px',
            borderRadius: '999px',
            border: `1px solid ${scheme.accent}`,
          }}
        >
          <span style={{ color: scheme.accent, fontSize: '14px' }}>⚡</span>
          <span style={{ color: scheme.text, fontSize: '12px', fontWeight: 'bold' }}>
            {Math.floor((strength + endurance + discipline) / 3)}
          </span>
        </div>
      </div>
    </div>
  )
}

// Helper: Render different hair styles
function renderHair(style: string, color: string) {
  const styles: Record<string, JSX.Element> = {
    short: (
      <path
        d="M 75 45 Q 100 20 125 45 Q 125 55 120 50 Q 100 35 80 50 Q 75 55 75 45"
        fill={color}
      />
    ),
    buzz: (
      <ellipse cx="100" cy="35" rx="22" ry="10" fill={color} opacity="0.8" />
    ),
    medium: (
      <path
        d="M 72 50 Q 70 30 100 22 Q 130 30 128 50 Q 130 70 120 65 Q 100 45 80 65 Q 70 70 72 50"
        fill={color}
      />
    ),
    long: (
      <path
        d="M 70 50 Q 65 25 100 18 Q 135 25 130 50 Q 135 80 125 75 Q 100 50 75 75 Q 65 80 70 50"
        fill={color}
      />
    ),
    mohawk: (
      <>
        <ellipse cx="100" cy="35" rx="20" ry="8" fill={color} opacity="0.3" />
        <path d="M 95 28 L 95 15 L 100 12 L 105 15 L 105 28" fill={color} />
      </>
    ),
    spiky: (
      <path
        d="M 75 45 L 85 20 L 95 40 L 100 15 L 105 40 L 115 20 L 125 45 Q 100 35 75 45"
        fill={color}
      />
    ),
  }

  return styles[style] || styles.short
}

// Helper: Adjust color brightness
function adjustBrightness(color: string, amount: number): string {
  const hex = color.replace('#', '')
  const r = Math.max(0, Math.min(255, parseInt(hex.substring(0, 2), 16) + amount))
  const g = Math.max(0, Math.min(255, parseInt(hex.substring(2, 4), 16) + amount))
  const b = Math.max(0, Math.min(255, parseInt(hex.substring(4, 6), 16) + amount))
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

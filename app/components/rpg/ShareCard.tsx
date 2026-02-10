'use client'

/**
 * Share Card Component - Instagram-worthy progress posts
 * Makes clients want to screenshot and brag
 */

import { useRef, useCallback, useState } from 'react'
import PremiumAvatar from './PremiumAvatar'
import type { AvatarCustomization } from '@/app/lib/rpg/customization'

type ShareCardProps = {
  userName: string
  level: number
  strength: number
  endurance: number
  discipline: number
  currentStreak: number
  longestStreak: number
  colorScheme?: string
  customization?: AvatarCustomization
  achievement?: string
  variant?: 'portrait' | 'landscape' | 'square'
}

export default function ShareCard({
  userName,
  level,
  strength,
  endurance,
  discipline,
  currentStreak,
  longestStreak,
  colorScheme = 'navy',
  customization,
  achievement,
  variant = 'portrait',
}: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleDownload = useCallback(async () => {
    setIsGenerating(true)
    
    // In production, this would use html2canvas
    // For now, we'll create a canvas and draw the card
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size based on variant
    const sizes = {
      portrait: { width: 1080, height: 1920 },
      landscape: { width: 1920, height: 1080 },
      square: { width: 1080, height: 1080 },
    }
    
    const { width, height } = sizes[variant]
    canvas.width = width
    canvas.height = height

    // Draw background
    const gradient = ctx.createRadialGradient(
      width * 0.3, height * 0.3, 0,
      width * 0.5, height * 0.5, width
    )
    
    const bgColors: Record<string, string[]> = {
      navy: ['#1e293b', '#0f172a', '#020617'],
      crimson: ['#7f1d1d', '#450a0a', '#000000'],
      emerald: ['#064e3b', '#022c22', '#000000'],
      gold: ['#713f12', '#422006', '#000000'],
      void: ['#1a1a2e', '#0f0f1a', '#000000'],
    }
    
    const colors = bgColors[colorScheme] || bgColors.navy
    gradient.addColorStop(0, colors[0])
    gradient.addColorStop(0.5, colors[1])
    gradient.addColorStop(1, colors[2])
    
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    // Draw decorative elements
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
    ctx.lineWidth = 2
    
    // Corner decorations
    const cornerSize = 60
    ctx.beginPath()
    ctx.moveTo(40, 40 + cornerSize)
    ctx.lineTo(40, 40)
    ctx.lineTo(40 + cornerSize, 40)
    ctx.stroke()
    
    ctx.beginPath()
    ctx.moveTo(width - 40, 40 + cornerSize)
    ctx.lineTo(width - 40, 40)
    ctx.lineTo(width - 40 - cornerSize, 40)
    ctx.stroke()
    
    ctx.beginPath()
    ctx.moveTo(40, height - 40 - cornerSize)
    ctx.lineTo(40, height - 40)
    ctx.lineTo(40 + cornerSize, height - 40)
    ctx.stroke()
    
    ctx.beginPath()
    ctx.moveTo(width - 40, height - 40 - cornerSize)
    ctx.lineTo(width - 40, height - 40)
    ctx.lineTo(width - 40 - cornerSize, height - 40)
    ctx.stroke()

    // Draw glow effect
    const glowGradient = ctx.createRadialGradient(
      width / 2, height * 0.4, 0,
      width / 2, height * 0.4, width * 0.6
    )
    glowGradient.addColorStop(0, 'rgba(0, 217, 255, 0.15)')
    glowGradient.addColorStop(1, 'transparent')
    ctx.fillStyle = glowGradient
    ctx.fillRect(0, 0, width, height)

    // Draw achievement banner if present
    if (achievement) {
      const bannerY = variant === 'portrait' ? 180 : 120
      
      ctx.save()
      ctx.fillStyle = 'rgba(0, 217, 255, 0.2)'
      ctx.strokeStyle = 'rgba(0, 217, 255, 0.5)'
      ctx.lineWidth = 2
      
      // Draw banner background
      ctx.beginPath()
      ctx.roundRect(width / 2 - 400, bannerY - 40, 800, 80, 20)
      ctx.fill()
      ctx.stroke()
      
      // Draw text
      ctx.font = 'bold 48px Arial'
      ctx.fillStyle = '#00d9ff'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(`🏆 ${achievement}`, width / 2, bannerY)
      ctx.restore()
    }

    // Draw user info
    const nameY = variant === 'portrait' ? 320 : 200
    ctx.font = 'bold 72px Arial'
    ctx.fillStyle = '#e8dcc4'
    ctx.textAlign = 'center'
    ctx.fillText(userName, width / 2, nameY)
    
    ctx.font = '36px Arial'
    ctx.fillStyle = '#94a3b8'
    ctx.fillText('Ascending Fitness', width / 2, nameY + 60)

    // Draw level badge
    const badgeY = variant === 'portrait' ? 450 : 320
    const badgeGradient = ctx.createLinearGradient(
      width / 2 - 100, badgeY - 40,
      width / 2 + 100, badgeY + 40
    )
    badgeGradient.addColorStop(0, '#e8dcc4')
    badgeGradient.addColorStop(0.5, '#d4c4a8')
    badgeGradient.addColorStop(1, '#c4b498')
    
    ctx.fillStyle = badgeGradient
    ctx.beginPath()
    ctx.roundRect(width / 2 - 120, badgeY - 50, 240, 100, 50)
    ctx.fill()
    
    ctx.font = 'bold 64px Arial'
    ctx.fillStyle = '#0f172a'
    ctx.fillText(`LVL ${level}`, width / 2, badgeY + 15)

    // Draw stats
    const statsY = variant === 'portrait' ? height - 500 : height - 250
    const statSpacing = variant === 'portrait' ? 220 : 280
    const startX = width / 2 - (statSpacing * 1.5)
    
    const stats = [
      { icon: '💪', label: 'STR', value: strength, color: '#ef4444' },
      { icon: '🏃', label: 'END', value: endurance, color: '#3b82f6' },
      { icon: '🎯', label: 'DIS', value: discipline, color: '#eab308' },
      { icon: '🔥', label: 'STRK', value: currentStreak, color: '#f97316' },
    ]
    
    stats.forEach((stat, index) => {
      const x = startX + (statSpacing * index)
      
      // Draw stat box
      ctx.fillStyle = `${stat.color}22`
      ctx.beginPath()
      ctx.roundRect(x - 80, statsY - 60, 160, 200, 20)
      ctx.fill()
      
      // Draw icon
      ctx.font = '48px Arial'
      ctx.fillStyle = stat.color
      ctx.textAlign = 'center'
      ctx.fillText(stat.icon, x, statsY)
      
      // Draw label
      ctx.font = 'bold 28px Arial'
      ctx.fillStyle = '#94a3b8'
      ctx.fillText(stat.label, x, statsY + 50)
      
      // Draw value
      ctx.font = 'bold 72px Arial'
      ctx.fillStyle = stat.color
      ctx.fillText(stat.value.toString(), x, statsY + 130)
    })

    // Draw streak info
    const streakY = variant === 'portrait' ? height - 200 : height - 120
    ctx.font = 'bold 48px Arial'
    ctx.fillStyle = '#f97316'
    ctx.fillText(`🔥 ${currentStreak} DAY STREAK`, width / 2, streakY)
    
    if (currentStreak === longestStreak) {
      ctx.font = 'italic 32px Arial'
      ctx.fillStyle = '#22c55e'
      ctx.fillText('(Personal Best!)', width / 2, streakY + 50)
    }

    // Draw branding
    ctx.font = 'bold 36px Arial'
    ctx.fillStyle = 'rgba(148, 163, 184, 0.8)'
    ctx.fillText('ASCENDING FITNESS RPG', width / 2, height - 60)

    // Download the image
    const link = document.createElement('a')
    link.download = `ascending-fitness-${userName.replace(/\s+/g, '-').toLowerCase()}-level-${level}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
    
    setIsGenerating(false)
  }, [achievement, colorScheme, currentStreak, discipline, endurance, level, longestStreak, strength, userName, variant])

  const handleShare = useCallback(async () => {
    const text = achievement 
      ? `🏆 ${achievement}! I'm Level ${level} in Ascending Fitness RPG! 💪`
      : `💪 Level ${level} at Ascending Fitness! ${currentStreak} day streak! 🔥`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Ascending Fitness Progress',
          text,
          url: window.location.origin,
        })
      } catch (err) {
        console.log('Share cancelled')
      }
    } else {
      navigator.clipboard.writeText(text)
      alert('Copied to clipboard!')
    }
  }, [achievement, level, currentStreak])

  // Color schemes
  const schemes: Record<string, { bg: string; text: string; accent: string; subtext: string }> = {
    navy: { bg: '#0f172a', text: '#e8dcc4', accent: '#00d9ff', subtext: '#94a3b8' },
    crimson: { bg: '#450a0a', text: '#fee2e2', accent: '#ff6b6b', subtext: '#fca5a5' },
    emerald: { bg: '#022c22', text: '#d1fae5', accent: '#00ff88', subtext: '#6ee7b7' },
    gold: { bg: '#422006', text: '#fef9c3', accent: '#ffd700', subtext: '#fde047' },
    void: { bg: '#000000', text: '#f3e8ff', accent: '#c084fc', subtext: '#d8b4fe' },
  }

  const scheme = schemes[colorScheme] || schemes.navy

  // Variant styles
  const variantStyles = {
    portrait: 'max-w-md',
    landscape: 'max-w-3xl',
    square: 'max-w-lg',
  }

  const isPB = currentStreak > 0 && currentStreak === longestStreak

  return (
    <div className="space-y-4">
      {/* The Card */}
      <div
        ref={cardRef}
        className={`relative w-full ${variantStyles[variant]} mx-auto overflow-hidden ${
          variant === 'landscape' ? 'aspect-video' : variant === 'square' ? 'aspect-square' : 'aspect-[9/16]'
        }`}
        style={{
          background: `linear-gradient(135deg, ${scheme.bg} 0%, ${adjustBrightness(scheme.bg, 20)} 100%)`,
          boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 100px ${scheme.accent}20`,
        }}
      >
        {/* Background pattern */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 80%, ${scheme.accent} 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, ${scheme.accent} 0%, transparent 50%)
            `,
          }}
        />

        {/* Corner decorations */}
        <div className="absolute top-6 left-6 w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-50" />
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-white to-transparent opacity-50" />
        </div>
        <div className="absolute top-6 right-6 w-16 h-16">
          <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-50" />
          <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-transparent via-white to-transparent opacity-50" />
        </div>
        <div className="absolute bottom-6 left-6 w-16 h-16">
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-50" />
          <div className="absolute bottom-0 left-0 w-1 h-full bg-gradient-to-t from-transparent via-white to-transparent opacity-50" />
        </div>
        <div className="absolute bottom-6 right-6 w-16 h-16">
          <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-50" />
          <div className="absolute bottom-0 right-0 w-1 h-full bg-gradient-to-t from-transparent via-white to-transparent opacity-50" />
        </div>

        {/* Content */}
        <div className="relative h-full flex flex-col p-8">
          
          {/* Achievement Banner */}
          {achievement && (
            <div 
              className="mb-4 py-3 px-6 rounded-xl text-center"
              style={{
                background: `linear-gradient(90deg, ${scheme.accent}22, ${scheme.accent}44, ${scheme.accent}22)`,
                border: `1px solid ${scheme.accent}66`,
              }}
            >
              <p className="text-lg font-bold" style={{ color: scheme.accent }}>
                🏆 {achievement}
              </p>
            </div>
          )}

          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold"
                style={{ 
                  background: scheme.accent,
                  color: scheme.bg,
                  boxShadow: `0 0 20px ${scheme.accent}80`,
                }}
              >
                💪
              </div>
              <div>
                <p className="font-bold text-xl" style={{ color: scheme.text }}>
                  {userName}
                </p>
                <p className="text-sm" style={{ color: scheme.subtext }}>
                  Ascending Fitness
                </p>
              </div>
            </div>
            <div 
              className="px-4 py-2 rounded-full font-bold text-xl"
              style={{ 
                background: scheme.accent,
                color: scheme.bg,
                boxShadow: `0 4px 20px ${scheme.accent}60`,
              }}
            >
              LVL {level}
            </div>
          </div>

          {/* Avatar Section */}
          <div className="flex-1 flex items-center justify-center py-4">
            <div className="relative">
              <div 
                className="absolute inset-0 rounded-full animate-pulse"
                style={{
                  background: `radial-gradient(circle, ${scheme.accent}30 0%, transparent 70%)`,
                  transform: 'scale(1.3)',
                  filter: 'blur(30px)',
                }}
              />
              <PremiumAvatar
                level={level}
                strength={strength}
                endurance={endurance}
                discipline={discipline}
                colorScheme={colorScheme}
                size={variant === 'landscape' ? 'md' : 'lg'}
                customization={customization}
              />
            </div>
          </div>

          {/* Stats Grid */}
          <div className={`grid gap-3 mb-4 ${variant === 'landscape' ? 'grid-cols-4' : 'grid-cols-2'}`}>
            <StatBox 
              icon="💪" 
              label="STRENGTH" 
              value={strength} 
              color="#ef4444"
              scheme={scheme}
            />
            
            <StatBox 
              icon="🏃" 
              label="ENDURANCE" 
              value={endurance} 
              color="#3b82f6"
              scheme={scheme}
            />
            
            <StatBox 
              icon="🎯" 
              label="DISCIPLINE" 
              value={discipline} 
              color="#eab308"
              scheme={scheme}
            />
            
            <StatBox 
              icon="🔥" 
              label="STREAK" 
              value={currentStreak} 
              color="#f97316"
              scheme={scheme}
              highlight={isPB}
            />
          </div>

          {/* Streak Celebration */}
          {isPB && currentStreak >= 7 && (
            <div 
              className="text-center py-2 px-4 rounded-lg mb-4"
              style={{
                background: 'linear-gradient(90deg, rgba(34, 197, 94, 0.2), rgba(34, 197, 94, 0.4), rgba(34, 197, 94, 0.2))',
                border: '1px solid rgba(34, 197, 94, 0.6)',
              }}
            >
              <p className="text-green-400 font-bold text-lg">
                🎉 PERSONAL BEST! {currentStreak} Days! 🔥
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-4" style={{ borderTop: `1px solid ${scheme.accent}22` }}>
            <div className="flex items-center gap-2">
              <span style={{ color: scheme.accent }}>⚡</span>
              <span style={{ color: scheme.text, fontWeight: 'bold' }}>
                Power Level: {Math.floor((strength + endurance + discipline) / 3)}
              </span>
            </div>
            <p className="text-sm font-bold tracking-wider" style={{ color: scheme.accent }}>
              ASCENDING FITNESS RPG
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-center">
        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share
        </button>

        <button
          onClick={handleDownload}
          disabled={isGenerating}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-bold hover:from-cyan-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          {isGenerating ? 'Generating...' : 'Save Image'}
        </button>

        <button
          onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(
            achievement 
              ? `🏆 ${achievement}! I'm Level ${level} in Ascending Fitness RPG! 💪🔥`
              : `💪 Level ${level} at Ascending Fitness! ${currentStreak} day streak! Game on! 🔥`
          )}`, '_blank')}
          className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          Tweet
        </button>
      </div>
    </div>
  )
}

function StatBox({ 
  icon, 
  label, 
  value, 
  color,
  scheme,
  highlight = false,
}: { 
  icon: string
  label: string 
  value: number 
  color: string
  scheme: { bg: string; text: string; accent: string; subtext: string }
  highlight?: boolean
}) {
  return (
    <div 
      className="text-center p-4 rounded-xl transition-transform hover:scale-105"
      style={{ 
        background: `${color}22`,
        border: highlight ? `2px solid ${color}` : 'none',
        boxShadow: highlight ? `0 0 20px ${color}40` : 'none',
      }}
    >
      <div className="text-3xl mb-1">{icon}</div>
      <div 
        className="text-xs font-bold mb-1 tracking-wider"
        style={{ color: scheme.subtext }}
      >
        {label}
      </div>
      <div 
        className="text-3xl font-bold"
        style={{ color }}
      >
        {value}
      </div>
      
      {highlight && (
        <div className="text-xs font-bold mt-1 text-green-400">
          🔥 BEST!
        </div>
      )}
    </div>
  )
}

function adjustBrightness(color: string, amount: number): string {
  const hex = color.replace('#', '')
  const r = Math.max(0, Math.min(255, parseInt(hex.substring(0, 2), 16) + amount))
  const g = Math.max(0, Math.min(255, parseInt(hex.substring(2, 4), 16) + amount))
  const b = Math.max(0, Math.min(255, parseInt(hex.substring(4, 6), 16) + amount))
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

'use client'

/**
 * Share Card Component - Instagram-worthy progress posts
 * Generates shareable character cards
 */

import { useRef, useCallback } from 'react'
import PremiumAvatar from './PremiumAvatar'
import type { AvatarCustomization } from '@/app/lib/rpg/customization'

type ShareCardProps = {
  userName: string
  level: number
  strength: number
  endurance: number
  discipline: number
  currentStreak: number
  colorScheme?: string
  customization?: AvatarCustomization
  achievement?: string
}

export default function ShareCard({
  userName,
  level,
  strength,
  endurance,
  discipline,
  currentStreak,
  colorScheme = 'navy',
  customization,
  achievement,
}: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleDownload = useCallback(() => {
    // In a real implementation, this would use html2canvas or similar
    // For now, we'll just show an alert
    alert('Download feature would capture this card as an image!')
  }, [])

  const handleShare = useCallback(async () => {
    const text = achievement 
      ? `🎉 ${achievement}! I'm Level ${level} in Ascending Fitness RPG! 💪`
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
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(text)
      alert('Copied to clipboard!')
    }
  }, [achievement, level, currentStreak])

  const schemes: Record<string, { bg: string; text: string; accent: string; subtext: string }> = {
    navy: { bg: '#0f172a', text: '#e8dcc4', accent: '#00d9ff', subtext: '#94a3b8' },
    crimson: { bg: '#450a0a', text: '#fee2e2', accent: '#ff6b6b', subtext: '#fca5a5' },
    emerald: { bg: '#022c22', text: '#d1fae5', accent: '#00ff88', subtext: '#6ee7b7' },
    gold: { bg: '#422006', text: '#fef9c3', accent: '#ffd700', subtext: '#fde047' },
    void: { bg: '#000000', text: '#f3e8ff', accent: '#c084fc', subtext: '#d8b4fe' },
  }

  const scheme = schemes[colorScheme] || schemes.navy

  return (
    <div className="space-y-4">
      {/* The Card */}
      <div
        ref={cardRef}
        className="relative w-full max-w-md mx-auto overflow-hidden rounded-3xl"
        style={{
          background: `linear-gradient(135deg, ${scheme.bg} 0%, ${adjustBrightness(scheme.bg, 20)} 100%)`,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* Background pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 80%, ${scheme.accent} 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, ${scheme.accent} 0%, transparent 50%)
            `,
          }}
        />

        {/* Header */}
        <div className="relative p-6 pb-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                style={{ background: scheme.accent }}
              >
                💪
              </div>
              <div>
                <p className="font-bold text-lg" style={{ color: scheme.text }}>
                  {userName}
                </p>
                <p className="text-sm" style={{ color: scheme.subtext }}>
                  Ascending Fitness
                </p>
              </div>
            </div>
            <div 
              className="px-4 py-2 rounded-full font-bold"
              style={{ 
                background: scheme.accent,
                color: scheme.bg,
              }}
            >
              LVL {level}
            </div>
          </div>
        </div>

        {/* Avatar */}
        <div className="relative flex justify-center py-6">
          <PremiumAvatar
            level={level}
            strength={strength}
            endurance={endurance}
            discipline={discipline}
            colorScheme={colorScheme}
            size="lg"
            customization={customization}
          />
        </div>

        {/* Achievement banner */}
        {achievement && (
          <div 
            className="mx-6 mb-4 p-3 rounded-xl text-center"
            style={{
              background: `linear-gradient(90deg, ${scheme.accent}22, ${scheme.accent}44, ${scheme.accent}22)`,
              border: `1px solid ${scheme.accent}66`,
            }}
          >
            <p className="text-sm font-bold" style={{ color: scheme.accent }}>
              🏆 {achievement}
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="px-6 pb-4">
          <div className="grid grid-cols-4 gap-3">
            <StatBox 
              icon="💪" 
              label="STR" 
              value={strength} 
              color="#ef4444"
              scheme={scheme}
            />
            <StatBox 
              icon="🏃" 
              label="END" 
              value={endurance} 
              color="#3b82f6"
              scheme={scheme}
            />
            <StatBox 
              icon="🎯" 
              label="DIS" 
              value={discipline} 
              color="#eab308"
              scheme={scheme}
            />
            <StatBox 
              icon="🔥" 
              label="STRK" 
              value={currentStreak} 
              color="#f97316"
              scheme={scheme}
            />
          </div>
        </div>

        {/* Footer */}
        <div 
          className="px-6 py-4 flex items-center justify-between"
          style={{ borderTop: `1px solid ${scheme.accent}22` }}
        >
          <p className="text-sm" style={{ color: scheme.subtext }}>
            🔥 {currentStreak} day streak
          </p>
          <p className="text-xs font-bold tracking-wider" style={{ color: scheme.accent }}>
            ASCENDING FITNESS RPG
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-center">
        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share
        </button>

        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-xl font-bold hover:bg-gray-700 transition-all shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Save
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
}: { 
  icon: string
  label: string 
  value: number 
  color: string
  scheme: { bg: string; text: string; accent: string; subtext: string }
}) {
  return (
    <div 
      className="text-center p-3 rounded-xl"
      style={{ background: `${color}22` }}
    >
      <div className="text-2xl mb-1">{icon}</div>
      <div 
        className="text-xs font-bold mb-1"
        style={{ color: scheme.subtext }}
      >
        {label}
      </div>
      <div 
        className="text-xl font-bold"
        style={{ color }}
      >
        {value}
      </div>
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

'use client'

/**
 * Quest Card Component - Beautiful quest display with progress
 */

import { useState } from 'react'

type QuestReward = {
  xp: number
  coins?: number
  bonus?: string
}

type QuestProgress = {
  current: number
  target: number
}

type QuestCardProps = {
  id: string
  title: string
  description: string
  type: 'daily' | 'weekly' | 'monthly' | 'personal'
  progress: QuestProgress
  reward: QuestReward
  isCompleted: boolean
  completedAt?: Date
  onComplete?: () => void
  colorScheme?: string
}

export default function QuestCard({
  title,
  description,
  type,
  progress,
  reward,
  isCompleted,
  completedAt,
  onComplete,
  colorScheme = 'navy',
}: QuestCardProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  const percentComplete = Math.min(100, Math.round((progress.current / progress.target) * 100))
  const isNearComplete = percentComplete >= 75 && !isCompleted

  const handleComplete = () => {
    setIsAnimating(true)
    setTimeout(() => {
      onComplete?.()
      setIsAnimating(false)
    }, 1000)
  }

  // Color schemes
  const schemes: Record<string, {
    bg: string
    border: string
    accent: string
    glow: string
    icon: string
  }> = {
    daily: {
      bg: 'from-blue-900/40 to-blue-800/20',
      border: 'border-blue-500/30',
      accent: '#3b82f6',
      glow: 'shadow-blue-500/20',
      icon: '🌅',
    },
    weekly: {
      bg: 'from-purple-900/40 to-purple-800/20',
      border: 'border-purple-500/30',
      accent: '#a855f7',
      glow: 'shadow-purple-500/20',
      icon: '📅',
    },
    monthly: {
      bg: 'from-amber-900/40 to-amber-800/20',
      border: 'border-amber-500/30',
      accent: '#f59e0b',
      glow: 'shadow-amber-500/20',
      icon: '🏆',
    },
    personal: {
      bg: 'from-emerald-900/40 to-emerald-800/20',
      border: 'border-emerald-500/30',
      accent: '#10b981',
      glow: 'shadow-emerald-500/20',
      icon: '🎯',
    },
  }

  const scheme = schemes[type]

  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl border-2 transition-all duration-300
        ${isCompleted ? 'opacity-75' : 'hover:scale-[1.02]'}
        ${scheme.border}
        bg-gradient-to-br ${scheme.bg}
        ${isNearComplete ? `shadow-lg ${scheme.glow}` : ''}
      `}
    >
      {/* Completion Animation Overlay */}
      {isAnimating && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="text-6xl animate-bounce">✨</div>
        </div>
      )}

      {/* Completed Stamp */}
      {isCompleted && (
        <div className="absolute top-4 right-4 z-10">
          <div 
            className="px-4 py-2 rounded-full font-bold text-sm transform rotate-12"
            style={{ 
              background: '#22c55e',
              color: 'white',
              boxShadow: '0 4px 20px rgba(34, 197, 94, 0.5)',
            }}
          >
            ✓ COMPLETED
          </div>
        </div>
      )}

      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
              style={{ 
                background: `${scheme.accent}30`,
                border: `2px solid ${scheme.accent}`,
              }}
            >
              {scheme.icon}
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">{title}</h3>
              <p className="text-sm text-gray-400 capitalize">{type} Quest</p>
            </div>
          </div>

          {/* Reward Badge */}
          <div 
            className="px-3 py-2 rounded-lg text-center"
            style={{ background: `${scheme.accent}20` }}
          >
            <div className="text-lg font-bold" style={{ color: scheme.accent }}>
              +{reward.xp}
            </div>
            <div className="text-xs text-gray-400">XP</div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-300 text-sm">{description}</p>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Progress</span>
            <span 
              className="font-bold"
              style={{ color: isCompleted ? '#22c55e' : scheme.accent }}
            >
              {progress.current} / {progress.target}
            </span>
          </div>
          
          <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out relative"
              style={{ 
                width: `${percentComplete}%`,
                background: isCompleted 
                  ? 'linear-gradient(90deg, #22c55e, #16a34a)' 
                  : `linear-gradient(90deg, ${scheme.accent}, ${scheme.accent}80)`,
              }}
            >
              {/* Shine effect */}
              <div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                style={{ animation: 'shine 2s infinite' }}
              />
            </div>
          </div>
          
          <div className="text-right text-xs text-gray-500">
            {percentComplete}%
          </div>
        </div>

        {/* Additional Rewards */}
        {(reward.coins || reward.bonus) && (
          <div className="flex gap-2 flex-wrap">
            {reward.coins && (
              <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-bold">
                🪙 {reward.coins} Coins
              </span>
            )}
            {reward.bonus && (
              <span className="px-3 py-1 rounded-full bg-pink-500/20 text-pink-400 text-xs font-bold">
                ✨ {reward.bonus}
              </span>
            )}
          </div>
        )}

        {/* Complete Button */}
        {!isCompleted && percentComplete === 100 && (
          <button
            onClick={handleComplete}
            className="w-full py-3 rounded-xl font-bold text-white transition-all hover:scale-[1.02] active:scale-95"
            style={{ 
              background: `linear-gradient(135deg, ${scheme.accent}, ${scheme.accent}80)`,
              boxShadow: `0 4px 20px ${scheme.accent}50`,
            }}
          >
            🎉 Claim Reward
          </button>
        )}

        {/* Completed Date */}
        {isCompleted && completedAt && (
          <div className="text-center text-sm text-gray-500">
            Completed {new Date(completedAt).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        )}
      </div>

      {/* Near Complete Indicator */}
      {isNearComplete && !isCompleted && (
        <div 
          className="absolute -top-1 -right-1 w-6 h-6 rounded-full animate-pulse"
          style={{ background: scheme.accent }}
        />
      )}

      <style jsx>{`
        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  )
}

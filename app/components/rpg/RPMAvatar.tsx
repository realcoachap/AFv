'use client'

/**
 * Ready Player Me Avatar Integration
 * Realistic 3D avatars with RPG stat effects
 */

import { useEffect, useMemo, useRef, useState } from 'react'

// RPM Avatar configuration
const RPM_CONFIG = {
  // Base URL for avatar generation
  avatarBaseUrl: 'https://api.readyplayer.me/v1/avatars',
  // Quick avatar generation endpoint
  quickAvatarUrl: 'https://models.readyplayer.me',
  // Default avatar ID (can be customized)
  defaultAvatarId: '6489a5f1c6b3f2d4e7a1b2c3', // Placeholder - we'll generate dynamically
}

// Avatar style presets based on stats
type AvatarStyle = {
  bodyType: 'slim' | 'average' | 'athletic' | 'muscular'
  outfit: string
  colors: {
    shirt: string
    pants: string
    shoes: string
  }
}

type RPMAvatarProps = {
  // User's avatar ID from RPM (if they've created one)
  avatarId?: string
  // Or generate from customization
  customization?: {
    skinTone: string
    hairStyle: string
    hairColor: string
    outfit: string
    colorScheme: string
  }
  // RPG Stats for visual effects
  level: number
  strength: number
  endurance: number
  discipline: number
  // Display options
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showAura?: boolean
  autoRotate?: boolean
  // Callback when avatar loads
  onLoad?: () => void
}

export default function RPMAvatar({
  avatarId,
  customization,
  level,
  strength,
  endurance,
  discipline,
  size = 'lg',
  showAura = true,
  autoRotate = false,
  onLoad,
}: RPMAvatarProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Calculate visual effects based on stats
  const visualEffects = calculateVisualEffects(strength, endurance, discipline, level)

  // Generate avatar URL
  const avatarUrl = useMemo(() => {
    if (avatarId) {
      // Use existing avatar
      return `${RPM_CONFIG.quickAvatarUrl}/${avatarId}.glb`
    }
    
    // Generate quick avatar with customization
    // RPM supports URL params for quick generation
    const params = new URLSearchParams({
      ...(customization?.hairStyle && { hairStyle: mapHairStyle(customization.hairStyle) }),
      ...(customization?.outfit && { outfit: mapOutfit(customization.outfit) }),
      bodyType: getBodyType(strength),
    })
    
    // For now, use a demo avatar - in production this would call RPM API
    return `https://models.readyplayer.me/6489a5f1c6b3f2d4e7a1b2c3.glb?${params.toString()}`
  }, [avatarId, customization, strength])

  // Size configurations
  const sizes = {
    sm: { width: 200, height: 250 },
    md: { width: 300, height: 375 },
    lg: { width: 400, height: 500 },
    xl: { width: 500, height: 625 },
  }

  const { width, height } = sizes[size]

  useEffect(() => {
    // Subscribe to RPM events
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.source === 'readyplayerme') {
        switch (event.data.eventName) {
          case 'v1.avatar.loaded':
            setIsLoading(false)
            onLoad?.()
            break
          case 'v1.frame.ready':
            // Frame is ready to receive commands
            break
        }
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [onLoad])

  return (
    <div 
      className="relative"
      style={{ width, height }}
    >
      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 rounded-xl z-10">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400 text-sm">Loading Avatar...</p>
          </div>
        </div>
      )}

      {/* Aura effect for high discipline */}
      {showAura && discipline > 40 && (
        <div 
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            background: `radial-gradient(circle at center, ${visualEffects.auraColor}40 0%, transparent 60%)`,
            filter: 'blur(30px)',
            animation: 'pulse 2s ease-in-out infinite',
          }}
        />
      )}

      {/* RPM Avatar Viewer */}
      <div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-b from-gray-800 to-gray-900">
        <iframe
          ref={iframeRef}
          src={`https://readyplayer.me/avatar?frameApi&transparent=true&${visualEffects.urlParams}`}
          className="w-full h-full border-0"
          allow="camera *; microphone *"
          onLoad={() => setTimeout(() => setIsLoading(false), 2000)}
        />

        {/* Stats overlay */}
        <div className="absolute bottom-4 left-4 right-4 z-20">
          <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-bold">Level {level}</span>
              <span className="text-purple-400 text-sm">
                {visualEffects.title}
              </span>
            </div>
            
            {/* Power bars */}
            <div className="space-y-1.5">
              <StatBar label="STR" value={strength} color="#FF6B6B" />
              <StatBar label="END" value={endurance} color="#4ECDC4" />
              <StatBar label="DIS" value={discipline} color="#FFE66D" />
            </div>
          </div>
        </div>

        {/* Glow border for high level */}
        {level >= 20 && (
          <div 
            className="absolute inset-0 pointer-events-none z-10 rounded-xl"
            style={{
              boxShadow: `inset 0 0 30px ${visualEffects.borderColor}, 0 0 30px ${visualEffects.borderColor}`,
            }}
          />
        )}
      </div>
    </div>
  )
}

// Helper: Calculate visual effects based on stats
function calculateVisualEffects(
  strength: number,
  endurance: number,
  discipline: number,
  level: number
) {
  const avgStats = (strength + endurance + discipline) / 3
  
  // Aura color based on discipline
  let auraColor = 'rgba(100, 100, 100, 0.3)'
  if (discipline >= 80) auraColor = 'rgba(168, 85, 247, 0.5)' // Legendary purple
  else if (discipline >= 60) auraColor = 'rgba(255, 215, 0, 0.4)' // Epic gold
  else if (discipline >= 40) auraColor = 'rgba(0, 217, 255, 0.3)' // Rare blue
  
  // Title based on stats
  let title = 'Novice'
  if (avgStats >= 80) title = 'Legend'
  else if (avgStats >= 60) title = 'Elite'
  else if (avgStats >= 40) title = 'Warrior'
  else if (avgStats >= 20) title = 'Trainee'
  
  // Border color based on level
  let borderColor = '#6B7280'
  if (level >= 30) borderColor = '#A855F7' // Mythic
  else if (level >= 20) borderColor = '#FFD700' // Legendary
  else if (level >= 15) borderColor = '#00D9FF' // Epic
  else if (level >= 10) borderColor = '#3B82F6' // Rare
  else if (level >= 5) borderColor = '#22C55E' // Uncommon
  
  // URL params for RPM
  const urlParams = new URLSearchParams({
    ...(strength > 70 && { muscle: 'large' }),
    ...(discipline > 60 && { glow: 'true' }),
  }).toString()
  
  return { auraColor, title, borderColor, urlParams }
}

// Helper: Map hair style to RPM format
function mapHairStyle(style: string): string {
  const map: Record<string, string> = {
    short: 'short',
    buzz: 'buzz',
    medium: 'medium',
    long: 'long',
    mohawk: 'mohawk',
    afro: 'afro',
    dreads: 'dreadlocks',
    ponytail: 'ponytail',
    spiky: 'spiky',
  }
  return map[style] || 'short'
}

// Helper: Map outfit to RPM format
function mapOutfit(outfit: string): string {
  const map: Record<string, string> = {
    tee: 'tshirt',
    tank: 'tanktop',
    compression: 'compression',
    hoodie: 'hoodie',
    jersey: 'jersey',
    muscle: 'muscle-shirt',
  }
  return map[outfit] || 'tshirt'
}

// Helper: Get body type from strength
function getBodyType(strength: number): string {
  if (strength >= 70) return 'muscular'
  if (strength >= 50) return 'athletic'
  if (strength >= 30) return 'average'
  return 'slim'
}

// Helper: Stat bar component
function StatBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-bold text-gray-400 w-8">{label}</span>
      <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-500"
          style={{ 
            width: `${Math.min(value, 100)}%`,
            backgroundColor: color,
            boxShadow: `0 0 10px ${color}`,
          }}
        />
      </div>
      <span className="text-xs text-white w-8 text-right">{value}</span>
    </div>
  )
}

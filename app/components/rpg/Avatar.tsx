'use client'

/**
 * Avatar Component - Wrapper with Premium/3D Toggle
 * Uses PremiumAvatar (2D stylized) by default for best aesthetics
 */

import { Suspense, lazy } from 'react'
import PremiumAvatar from './PremiumAvatar'
import type { AvatarCustomization } from '@/app/lib/rpg/customization'

// Lazy load 3D component (heavy, only if explicitly requested)
const Avatar3D = lazy(() => import('./Avatar3D'))

type AvatarProps = {
  level?: number
  strength: number
  endurance: number
  discipline: number
  colorScheme?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'share'
  use3D?: boolean
  autoRotate?: boolean
  customization?: AvatarCustomization
}

// Loading fallback for 3D
function Avatar3DFallback() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A2332]" />
    </div>
  )
}

export default function Avatar({
  level = 1,
  strength,
  endurance,
  discipline,
  colorScheme = 'navy',
  size = 'lg',
  use3D = false, // Default to Premium 2D for better aesthetics
  autoRotate = true,
  customization,
}: AvatarProps) {
  // Use 3D only if explicitly requested (for clients who want it)
  if (use3D) {
    return (
      <Suspense fallback={<Avatar3DFallback />}>
        <Avatar3D
          strength={strength}
          endurance={endurance}
          discipline={discipline}
          colorScheme={colorScheme}
          size={size === 'share' ? 'xl' : size}
          autoRotate={autoRotate}
          customization={customization}
        />
      </Suspense>
    )
  }
  
  // Default: Use Premium Avatar (beautiful 2D stylized)
  return (
    <PremiumAvatar
      level={level}
      strength={strength}
      endurance={endurance}
      discipline={discipline}
      colorScheme={colorScheme}
      size={size}
      customization={customization}
    />
  )
}

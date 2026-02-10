'use client'

/**
 * Avatar Component - Wrapper with 2D/3D Toggle
 * Easily switch between 2D SVG and 3D React Three Fiber
 */

import { Suspense, lazy } from 'react'
import Avatar2D from './Avatar2D'

// Lazy load 3D component (better performance)
const Avatar3D = lazy(() => import('./Avatar3D'))

type AvatarProps = {
  strength: number
  endurance: number
  discipline: number
  colorScheme?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  use3D?: boolean // Feature toggle
  autoRotate?: boolean // 3D only
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
  strength,
  endurance,
  discipline,
  colorScheme = 'navy',
  size = 'lg',
  use3D = true, // Default to 3D (set to false to use 2D)
  autoRotate = true,
}: AvatarProps) {
  // Use 3D by default, with easy toggle
  if (use3D) {
    return (
      <Suspense fallback={<Avatar3DFallback />}>
        <Avatar3D
          strength={strength}
          endurance={endurance}
          discipline={discipline}
          colorScheme={colorScheme}
          size={size}
          autoRotate={autoRotate}
        />
      </Suspense>
    )
  }
  
  // Fallback to 2D
  return (
    <Avatar2D
      strength={strength}
      endurance={endurance}
      discipline={discipline}
      colorScheme={colorScheme}
      size={size}
    />
  )
}

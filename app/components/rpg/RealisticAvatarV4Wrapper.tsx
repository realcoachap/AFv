'use client'

/**
 * Dynamic import wrapper for RealisticAvatarV4
 * Ensures the 3D component only loads on the client side
 */

import dynamic from 'next/dynamic'
import type { AvatarCustomization } from '@/app/lib/rpg/customization'

// Loading placeholder
function AvatarLoading() {
  return (
    <div className="flex items-center justify-center" style={{ width: 440, height: 640 }}>
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400">Loading Avatar...</p>
      </div>
    </div>
  )
}

// Dynamically import the actual component (no SSR)
const RealisticAvatarV4Component = dynamic(
  () => import('./RealisticAvatarV4'),
  {
    ssr: false,
    loading: AvatarLoading,
  }
)

// Props type matching the original component
type RealisticAvatarV4Props = {
  strength: number
  endurance: number
  discipline: number
  level: number
  colorScheme?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  autoRotate?: boolean
  customization?: AvatarCustomization
  showStats?: boolean
}

// Export wrapper component
export default function RealisticAvatarV4(props: RealisticAvatarV4Props) {
  return <RealisticAvatarV4Component {...props} />
}
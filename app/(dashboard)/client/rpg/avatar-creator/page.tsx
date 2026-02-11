'use client'

/**
 * Avatar Creator Page - Ready Player Me Integration
 * Users create realistic 3D avatars for their RPG character
 */

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import NavBar from '@/app/components/NavBar'

// RPM subdomain - you'd create this at readyplayer.me
const RPM_SUBDOMAIN = 'ascending-fitness' // Replace with your actual subdomain

export default function AvatarCreatorPage() {
  const router = useRouter()
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Listen for RPM events
    const handleMessage = (event: MessageEvent) => {
      // Validate origin
      if (event.origin !== 'https://readyplayer.me') return

      const { data } = event

      if (data?.source === 'readyplayerme') {
        switch (data.eventName) {
          case 'v1.avatar.exported':
            // Avatar was created/extracted
            console.log('Avatar exported:', data.data)
            setAvatarUrl(data.data.url)
            // Save to your database here
            saveAvatar(data.data.url, data.data.avatarId)
            break
            
          case 'v1.avatar.created':
            // New avatar created
            console.log('Avatar created:', data.data)
            break
            
          case 'v1.frame.ready':
            setIsLoading(false)
            break
        }
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [router])

  const saveAvatar = async (url: string, avatarId: string) => {
    try {
      // Save to your backend
      const response = await fetch('/api/avatar/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatarUrl: url, avatarId }),
      })

      if (response.ok) {
        // Redirect to profile or dashboard
        router.push('/client/rpg/profile')
      }
    } catch (error) {
      console.error('Failed to save avatar:', error)
    }
  }

  const creatorUrl = `https://${RPM_SUBDOMAIN}.readyplayer.me/avatar?frameApi&clearCache&bodyType=fullbody`

  return (
    <div className="min-h-screen bg-gray-900">
      <NavBar role="client" />
      
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Create Your Avatar</h1>
            <p className="text-gray-400 text-sm">Design your fitness warrior persona</p>
          </div>
          
          <button
            onClick={() => router.back()}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            ← Back
          </button>
        </div>
      </div>

      {/* RPM Avatar Creator */}
      <div className="max-w-7xl mx-auto p-4 h-[calc(100vh-80px)]">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-400">Loading Avatar Creator...</p>
            </div>
          </div>
        )}

        <div className="relative w-full h-full rounded-xl overflow-hidden">
          <iframe
            src={creatorUrl}
            className="w-full h-full border-0"
            allow="camera *; microphone *"
          />
        </div>
      </div>

      {/* Instructions overlay (fades out) */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-sm px-6 py-4 rounded-xl text-center">
        <p className="text-white font-medium mb-1">🎨 Customize your look</p>
        <p className="text-gray-400 text-sm">When done, click "Next" to save to your profile</p>
      </div>
    </div>
  )
}

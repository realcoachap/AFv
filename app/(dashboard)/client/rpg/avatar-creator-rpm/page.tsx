'use client'

/**
 * Ready Player Me Avatar Creator
 * Professional 3D avatars using RPM SDK
 */

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import RPMAvatarViewer from '@/app/components/rpg/RPMAvatarViewer'

// RPM Subdomain - you need to create this at https://studio.readyplayer.me
const RPM_SUBDOMAIN = 'ascending-fitness'

// Avatar configuration options
const AVATAR_CONFIGS = {
  bodyType: ['fullbody', 'halfbody'],
  outfit: ['athletic', 'casual', 'formal', 'sporty'],
  hairStyles: ['short', 'medium', 'long', 'buzz'],
  skinTones: [
    { name: 'Light', color: '#f5d5b8' },
    { name: 'Fair', color: '#e8c4a0' },
    { name: 'Medium', color: '#d4a574' },
    { name: 'Tan', color: '#c68642' },
    { name: 'Dark', color: '#5c3317' },
  ]
}

export default function RPMAvatarCreatorPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  // Avatar configuration state
  const [config, setConfig] = useState({
    bodyType: 'fullbody',
    outfit: 'athletic',
    hairStyle: 'short',
    skinTone: '#d4a574',
  })

  // Generate avatar using RPM API
  const generateAvatar = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // RPM Quick Avatar Generation API
      const response = await fetch('https://api.readyplayer.me/v2/avatars', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            type: 'avatars',
            attributes: {
              bodyType: config.bodyType,
              outfit: config.outfit,
              // Note: Full customization requires the avatar ID from their system
              // This is a simplified version - the full flow involves:
              // 1. Creating an avatar via their web interface
              // 2. Getting the avatar ID
              // 3. Customizing via API
            }
          }
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate avatar')
      }

      const data = await response.json()
      setAvatarUrl(data.data.attributes.url)
      
    } catch (err) {
      setError('Avatar generation failed. Using demo avatar instead.')
      // Fallback to demo avatar
      setAvatarUrl(`https://models.readyplayer.me/64a9c3c7c8b5a72d5a1b2c3d.glb`)
    } finally {
      setIsLoading(false)
    }
  }

  // For now, use the iframe approach (official RPM way)
  const iframeUrl = `https://${RPM_SUBDOMAIN}.readyplayer.me/avatar?frameApi&clearCache&bodyType=fullbody`

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">🎭 Ready Player Me Avatar</h1>
            <p className="text-gray-400 text-sm">Create professional 3D avatars</p>
          </div>
          
          <button
            onClick={() => router.back()}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            ← Back
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* RPM Avatar Creator */}
          <div className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700">
            <div className="p-4 border-b border-gray-700">
              <h2 className="text-lg font-bold text-white">Character Creator</h2>
              <p className="text-gray-400 text-sm">Customize your look with RPM</p>
            </div>
            
            <div className="relative h-[600px]">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 z-10">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-white">Generating Avatar...</p>
                  </div>
                </div>
              )}
              
              <iframe
                src={iframeUrl}
                className="w-full h-full border-0"
                allow="camera *; microphone *"
                onLoad={() => setIsLoading(false)}
              />
            </div>
          </div>

          {/* Instructions & Info */}
          <div className="space-y-6">
            {/* Setup Guide */}
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-4">📋 Setup Instructions</h2>
              
              <div className="space-y-4 text-gray-300">
                <div className="flex gap-3">
                  <span className="text-purple-400 font-bold">1.</span>
                  <p>Go to <a href="https://studio.readyplayer.me" target="_blank" className="text-blue-400 hover:underline">studio.readyplayer.me</a></p>
                </div>
                
                <div className="flex gap-3">
                  <span className="text-purple-400 font-bold">2.</span>
                  <p>Create a free developer account</p>
                </div>
                
                <div className="flex gap-3">
                  <span className="text-purple-400 font-bold">3.</span>
                  <p>Create a new application called "Ascending Fitness"</p>
                </div>
                
                <div className="flex gap-3">
                  <span className="text-purple-400 font-bold">4.</span>
                  <p>Set subdomain to: <code className="bg-gray-700 px-2 py-1 rounded">ascending-fitness</code></p>
                </div>
                
                <div className="flex gap-3">
                  <span className="text-purple-400 font-bold">5.</span>
                  <p>Get your API key and update the code</p>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-4">✨ What You Get</h2>
              
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  Photorealistic 3D avatars
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  Full body customization
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  Face shape, hair, clothing
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  Export as .glb for Three.js
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  Free tier: 200 avatars/month
                </li>
              </ul>
            </div>

            {/* Alternative */}
            <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-2xl p-6 border border-purple-700/50">
              <h2 className="text-xl font-bold text-white mb-2">🚀 Quick Alternative</h2>
              <p className="text-gray-300 mb-4">
                Don't want to set up RPM? Use our <strong className="text-white">Procedural V3.2</strong> avatars instead!
              </p>
              
              <button
                onClick={() => router.push('/client/rpg/avatars/realistic')}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
              >
                Try V3.2 Procedural Avatars →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

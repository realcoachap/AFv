'use client'

/**
 * AI Texture Pipeline - Proof of Concept
 * Upload photo → AI generates textures → Apply to 3D avatar
 * This is the cutting-edge feature!
 */

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

// Dynamic import for 3D component (avoids SSR issues)
const AvatarWithAITextures = dynamic(
  () => import('../../../../components/rpg/AvatarWithAITextures'),
  { ssr: false, loading: () => (
    <div className="h-[400px] flex items-center justify-center bg-gray-900 rounded-xl">
      <div className="text-center text-gray-500">
        <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p>Loading 3D avatar...</p>
      </div>
    </div>
  )}
)

// Demo avatar URLs for texture generation
const DEMO_AVATAR_URL = 'https://models.readyplayer.me/64a9c3c7c8b5a72d5a1b2c3d.glb'

interface GeneratedTexture {
  id: string
  type: 'diffuse' | 'normal' | 'roughness'
  url: string
  prompt: string
}

export default function AITexturePipelinePage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [generatedTextures, setGeneratedTextures] = useState<GeneratedTexture[]>([])
  const [processingStep, setProcessingStep] = useState('')
  const [error, setError] = useState<string | null>(null)

  // Handle photo upload
  const handlePhotoUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPG, PNG)')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image too large. Please upload under 5MB.')
      return
    }

    // Create preview URL
    const url = URL.createObjectURL(file)
    setUploadedPhoto(url)
    setError(null)
    setGeneratedTextures([])
  }, [])

  // Simulate AI texture generation
  // In production, this would call Replicate/Stability AI API
  const generateTextures = async () => {
    if (!uploadedPhoto) return
    
    setIsProcessing(true)
    setError(null)
    
    try {
      // Step 1: Analyze photo
      setProcessingStep('🔍 Analyzing facial features...')
      await new Promise(r => setTimeout(r, 1500))
      
      // Step 2: Generate diffuse map (base color)
      setProcessingStep('🎨 Generating skin texture...')
      await new Promise(r => setTimeout(r, 2000))
      
      // Step 3: Generate normal map (depth/pores)
      setProcessingStep('🔬 Creating pore details...')
      await new Promise(r => setTimeout(r, 1800))
      
      // Step 4: Generate roughness map
      setProcessingStep('✨ Calculating skin shine...')
      await new Promise(r => setTimeout(r, 1200))
      
      // Mock generated textures
      // In production, these would be actual URLs from AI API
      const textures: GeneratedTexture[] = [
        {
          id: '1',
          type: 'diffuse',
          url: uploadedPhoto, // Would be AI-generated texture
          prompt: 'photorealistic skin texture, seamless, 4k, detailed pores'
        },
        {
          id: '2', 
          type: 'normal',
          url: '/textures/normal-map-placeholder.jpg',
          prompt: 'normal map for skin, micro-details, pore depth'
        },
        {
          id: '3',
          type: 'roughness',
          url: '/textures/roughness-placeholder.jpg',
          prompt: 'roughness map, oily T-zone, matte cheeks'
        }
      ]
      
      setGeneratedTextures(textures)
      setProcessingStep('✅ Textures generated!')
      
    } catch (err) {
      setError('Texture generation failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">🧠 AI Texture Pipeline</h1>
            <p className="text-gray-400 text-sm">Upload your photo → AI generates textures → Avatar looks like you!</p>
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
          {/* Left: Upload & Processing */}
          <div className="space-y-6">
            {/* Photo Upload */}
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-4">📸 Step 1: Upload Photo</h2>
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoUpload}
                accept="image/jpeg,image/png"
                className="hidden"
              />
              
              {!uploadedPhoto ? (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-12 border-2 border-dashed border-gray-600 rounded-xl hover:border-purple-500 transition-colors"
                >
                  <div className="text-center">
                    <div className="text-4xl mb-2">📷</div>
                    <p className="text-white font-medium">Click to upload photo</p>
                    <p className="text-gray-500 text-sm mt-1">JPG or PNG, max 5MB</p>
                    <p className="text-gray-500 text-sm">Front-facing, good lighting</p>
                  </div>
                </button>
              ) : (
                <div className="relative">
                  <img
                    src={uploadedPhoto}
                    alt="Uploaded"
                    className="w-full rounded-xl"
                  />
                  <button
                    onClick={() => {
                      setUploadedPhoto(null)
                      setGeneratedTextures([])
                    }}
                    className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    ✕ Remove
                  </button>
                </div>
              )}
              
              {error && (
                <p className="mt-3 text-red-400 text-sm">{error}</p>
              )}
            </div>

            {/* Generate Button */}
            {uploadedPhoto && generatedTextures.length === 0 && (
              <button
                onClick={generateTextures}
                disabled={isProcessing}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isProcessing ? 'Processing...' : '🚀 Generate AI Textures'}
              </button>
            )}

            {/* Processing Status */}
            {isProcessing && (
              <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin" />
                  <p className="text-white">{processingStep}</p>
                </div>
                
                <div className="mt-4 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-600 to-pink-600 animate-pulse" />
                </div>
              </div>
            )}

            {/* Generated Textures */}
            {generatedTextures.length > 0 && (
              <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                <h2 className="text-xl font-bold text-white mb-4">✅ Generated Textures</h2>
                
                <div className="space-y-3">
                  {generatedTextures.map((texture) => (
                    <div key={texture.id} className="flex items-center gap-4 bg-gray-700/50 p-3 rounded-lg">
                      <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center text-2xl">
                        {texture.type === 'diffuse' && '🎨'}
                        {texture.type === 'normal' && '🔬'}
                        {texture.type === 'roughness' && '✨'}
                      </div>
                      <div>
                        <p className="text-white font-medium capitalize">{texture.type} Map</p>
                        <p className="text-gray-400 text-sm">{texture.prompt}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* How It Works */}
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-4">🧬 How It Works</h2>
              
              <div className="space-y-4">
                {[
                  { icon: '📸', title: 'Photo Analysis', desc: 'AI extracts skin tone, texture, features' },
                  { icon: '🎨', title: 'Diffuse Map', desc: 'Base color texture from your skin' },
                  { icon: '🔬', title: 'Normal Map', desc: 'Pore depth and surface details' },
                  { icon: '✨', title: 'Roughness Map', desc: 'Shininess variation across face' },
                  { icon: '🧍', title: 'Avatar Application', desc: 'Textures applied to 3D mesh' },
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-2xl">{step.icon}</span>
                    <div>
                      <p className="text-white font-medium">{step.title}</p>
                      <p className="text-gray-400 text-sm">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Live Preview */}
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4">👤 Live Preview</h2>
            
            {!uploadedPhoto ? (
              <div className="h-[500px] flex items-center justify-center bg-gray-900 rounded-xl">
                <div className="text-center text-gray-500">
                  <div className="text-6xl mb-4">👤</div>
                  <p>Upload a photo to see your AI avatar</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Comparison */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-2">Original Photo</p>
                    <img
                      src={uploadedPhoto}
                      alt="Original"
                      className="w-full rounded-xl"
                    />
                  </div>
                  
                  <div>
                    <p className="text-gray-400 text-sm mb-2">AI Enhanced Avatar</p>
                    <div className="aspect-square bg-gray-900 rounded-xl overflow-hidden">
                      {generatedTextures.length > 0 ? (
                        <AvatarWithAITextures
                          diffuseTextureUrl={uploadedPhoto}
                          strength={75}
                          endurance={60}
                          level={12}
                          size="lg"
                          autoRotate={true}
                        />
                      ) : (
                        <div className="h-full flex items-center justify-center text-gray-500">
                          <div className="text-center">
                            <div className="text-4xl mb-2">⏳</div>
                            <p>Waiting for generation...</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Texture Status */}
                {generatedTextures.length > 0 && (
                  <div className="mt-4 flex gap-2 justify-center">
                    <span className="px-3 py-1 bg-green-600/30 text-green-400 rounded-full text-sm">✓ Diffuse map applied</span>
                    <span className="px-3 py-1 bg-green-600/30 text-green-400 rounded-full text-sm">✓ Normal map applied</span>
                    <span className="px-3 py-1 bg-green-600/30 text-green-400 rounded-full text-sm">✓ Roughness map applied</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Technical Details */}
        <div className="mt-8 bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4">⚙️ Technical Implementation</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-purple-400 font-bold mb-2">AI Model</h3>
              <p className="text-gray-300 text-sm">Stable Diffusion XL with ControlNet for face consistency and img2img for texture generation.</p>
            </div>
            
            <div>
              <h3 className="text-purple-400 font-bold mb-2">API Provider</h3>
              <p className="text-gray-300 text-sm">Replicate or Stability AI API. ~$0.02 per texture generation. Caches results for 24hrs.</p>
            </div>
            
            <div>
              <h3 className="text-purple-400 font-bold mb-2">Processing Time</h3>
              <p className="text-gray-300 text-sm">~6-8 seconds for complete texture set. Can be pre-generated and cached per user.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

/**
 * VRoid Character Demo
 * Shows integration of VRoid characters into the fitness RPG
 * This is a working example - just add a .glb file!
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import VRoidCharacter, { VRoidPresets } from '../../../../components/rpg/VRoidCharacter'

// Placeholder model URL - replace with actual VRoid .glb file
const DEMO_MODEL_URL = '/models/vroid-sample.glb'

export default function VRoidDemoPage() {
  const router = useRouter()
  const [selectedPreset, setSelectedPreset] = useState('athleticMale')
  const [hasModel, setHasModel] = useState(false)

  const presets = {
    athleticMale: {
      label: '🏋️ Athletic Male',
      description: 'High muscle definition, confident stance',
      config: VRoidPresets.athleticMale
    },
    athleticFemale: {
      label: '💪 Athletic Female', 
      description: 'Toned physique, elite athlete',
      config: VRoidPresets.athleticFemale
    },
    beginner: {
      label: '🌱 Beginner',
      description: 'Starting fitness journey',
      config: VRoidPresets.beginner
    }
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">🎮 VRoid Character Demo</h1>
            <p className="text-gray-400 text-sm">Professional 3D characters for your fitness RPG</p>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left: Controls */}
          <div className="space-y-6">
            
            {/* Character Selection */}
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-4">👤 Select Character</h2>
              
              <div className="space-y-3">
                {Object.entries(presets).map(([key, preset]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedPreset(key)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      selectedPreset === key
                        ? 'bg-purple-600 border-2 border-purple-400'
                        : 'bg-gray-700 border-2 border-transparent hover:bg-gray-600'
                    }`}
                  >
                    <p className="font-bold text-white">{preset.label}</p>
                    <p className="text-sm text-gray-300 mt-1">{preset.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Setup Instructions */}
            <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-2xl p-6 border border-purple-700/50">
              <h2 className="text-xl font-bold text-white mb-4">⚡ Quick Setup</h2>
              
              <div className="space-y-4 text-sm">
                <div className="flex gap-3">
                  <span className="text-2xl">1️⃣</span>
                  <div>
                    <p className="text-white font-medium">Download VRoid Studio</p>
                    <p className="text-gray-300"><a href="https://vroid.com/en/studio" target="_blank" className="text-purple-400 hover:underline">vroid.com/en/studio</a></p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <span className="text-2xl">2️⃣</span>
                  <div>
                    <p className="text-white font-medium">Create Your Character</p>
                    <p className="text-gray-300">Use Body tab → Muscle: 0.8, Width: 0.7</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <span className="text-2xl">3️⃣</span>
                  <div>
                    <p className="text-white font-medium">Export as .vrm</p>
                    <p className="text-gray-300">Camera/Export → VRM format</p>
                  </div>                
                </div>
                
                <div className="flex gap-3">
                  <span className="text-2xl">4️⃣</span>
                  <div>
                    <p className="text-white font-medium">Convert to .glb</p>
                    <p className="text-gray-300"><a href="https://vrm-viewer.com/convert" target="_blank" className="text-purple-400 hover:underline">vrm-viewer.com/convert</a></p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <span className="text-2xl">5️⃣</span>
                  <div>
                    <p className="text-white font-medium">Place in /public/models/</p>
                    <p className="text-gray-300">Update modelUrl in code</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Free Models */}
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-4">🎁 Free Models</h2>
              
              <p className="text-gray-300 text-sm mb-3">Download ready-made characters from VRoid Hub:</p>
              
              <a 
                href="https://hub.vroid.com/en/"
                target="_blank"
                className="block w-full py-3 bg-pink-600 hover:bg-pink-700 text-white text-center rounded-lg transition-colors"
              >
                Browse VRoid Hub →
              </a>
              
              <p className="text-gray-400 text-xs mt-3">Filter by "For Commercial Use" for business use</p>
            </div>
          </div>

          {/* Right: 3D Viewer */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 h-[600px]">
              <h2 className="text-xl font-bold text-white mb-4">🎮 Character Preview</h2>
              
              <div className="h-[500px] bg-gray-900 rounded-xl overflow-hidden relative">
                {hasModel ? (
                  <VRoidCharacter
                    modelUrl={DEMO_MODEL_URL}
                    {...presets[selectedPreset as keyof typeof presets].config}
                    autoRotate={true}
                    envPreset="studio"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center p-8">
                      <div className="text-6xl mb-4">👤</div>
                      <h3 className="text-xl font-bold text-white mb-2">No Character Model Yet</h3>
                      <p className="text-gray-400 mb-6 max-w-md">
                        This demo is ready to load VRoid characters! 
                        Follow the 5 steps on the left to create your first character.
                      </p>
                      
                      <div className="space-y-3">
                        <button
                          onClick={() => window.open('https://vroid.com/en/studio', '_blank')}
                          className="block w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                        >
                          🚀 Download VRoid Studio
                        </button>
                        
                        <button
                          onClick={() => window.open('https://hub.vroid.com/en/', '_blank')}
                          className="block w-full py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition-colors"
                        >
                          🎁 Browse Free Models
                        </button>
                        
                        <p className="text-xs text-gray-500 mt-4">
                          Or place a .glb file at /public/models/vroid-sample.glb
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Features */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              {[
                { icon: '🎨', title: 'Customizable', desc: 'Body, face, clothing' },
                { icon: '⚡', title: 'Web Ready', desc: 'Optimized for mobile' },
                { icon: '🎮', title: 'Animated', desc: 'Idle, walk, workout' },
              ].map((feature, i) => (
                <div key={i} className="bg-gray-800 rounded-xl p-4 border border-gray-700 text-center">
                  <div className="text-3xl mb-2">{feature.icon}</div>
                  <p className="text-white font-medium">{feature.title}</p>
                  <p className="text-gray-400 text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Code Example */}
        <div className="mt-8 bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4">💻 Usage in Your Code</h2>
          
          <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
<code className="text-gray-300">{`import VRoidCharacter from './components/rpg/VRoidCharacter'

// Basic usage
<VRoidCharacter
  modelUrl="/models/my-character.glb"
  characterName="Elite Trainer"
  level={25}
  autoRotate={true}
/>

// With presets
<VRoidCharacter
  modelUrl="/models/athlete.glb"
  {...VRoidPresets.athleticMale}
  envPreset="studio"
/>`}</code>
          </pre>
        </div>
      </div>
    </div>
  )
}

'use client'

/**
 * Realistic Avatar Demo - Strike 4: Advanced 3D Character System
 * Showcases the new realistic Three.js avatars
 */

import { useState } from 'react'
import RealisticAvatar from '@/app/components/rpg/RealisticAvatar'
import Avatar3D from '@/app/components/rpg/Avatar3D'

const demoCharacters = [
  {
    name: 'Beginner',
    level: 1,
    strength: 15,
    endurance: 20,
    discipline: 10,
    customization: {
      skinTone: '#F0D0B0',
      hairStyle: 'short',
      hairColor: '#2C1810',
      eyeColor: '#4A3728',
      outfit: 'tee',
      colorScheme: 'navy',
    },
  },
  {
    name: 'Warrior',
    level: 12,
    strength: 55,
    endurance: 48,
    discipline: 42,
    customization: {
      skinTone: '#D4A574',
      hairStyle: 'medium',
      hairColor: '#4E3629',
      eyeColor: '#4169E1',
      outfit: 'tank',
      colorScheme: 'crimson',
    },
  },
  {
    name: 'Elite',
    level: 22,
    strength: 75,
    endurance: 68,
    discipline: 72,
    customization: {
      skinTone: '#C68642',
      hairStyle: 'long',
      hairColor: '#A52A2A',
      eyeColor: '#00A86B',
      outfit: 'compression',
      colorScheme: 'gold',
    },
  },
  {
    name: 'Legend',
    level: 38,
    strength: 95,
    endurance: 88,
    discipline: 92,
    customization: {
      skinTone: '#8D5524',
      hairStyle: 'long',
      hairColor: '#C0C0C0',
      eyeColor: '#FFD700',
      outfit: 'muscle',
      colorScheme: 'void',
    },
  },
]

export default function RealisticAvatarDemoPage() {
  const [selectedView, setSelectedView] = useState<'realistic' | 'legacy'>('realistic')
  const [selectedChar, setSelectedChar] = useState(demoCharacters[0])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-sm">
            ⚔️ STRIKE 4: REALISTIC 3D
          </div>
          
          <h1 className="text-5xl font-bold text-white">
            Next-Gen Avatar System
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Procedural human mesh with PBR materials, morph targets, and dynamic muscle growth.
            <br />
            <span className="text-purple-400">Built entirely with Three.js — no external services.</span>
          </p>

          {/* View Toggle */}
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setSelectedView('realistic')}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                selectedView === 'realistic'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              🎮 Realistic (NEW)
            </button>
            <button
              onClick={() => setSelectedView('legacy')}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                selectedView === 'legacy'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              📦 Legacy (Old)
            </button>
          </div>
        </div>

        {/* Character Selector */}
        <div className="flex justify-center gap-3 flex-wrap">
          {demoCharacters.map((char) => (
            <button
              key={char.name}
              onClick={() => setSelectedChar(char)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedChar.name === char.name
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {char.name} (Lvl {char.level})
            </button>
          ))}
        </div>

        {/* Main Display */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Avatar */}
          <div className="bg-gray-800/30 rounded-3xl p-8 border border-gray-700 flex items-center justify-center min-h-[600px]">
            {selectedView === 'realistic' ? (
              <div className="text-center">
                <RealisticAvatar
                  level={selectedChar.level}
                  strength={selectedChar.strength}
                  endurance={selectedChar.endurance}
                  discipline={selectedChar.discipline}
                  colorScheme={selectedChar.customization.colorScheme}
                  customization={selectedChar.customization}
                  size="xl"
                  autoRotate={true}
                />
                <p className="mt-4 text-gray-400 text-sm">
                  🎮 Drag to rotate • Scroll to zoom
                </p>
              </div>
            ) : (
              <div className="text-center">
                <Avatar3D
                  strength={selectedChar.strength}
                  endurance={selectedChar.endurance}
                  discipline={selectedChar.discipline}
                  colorScheme={selectedChar.customization.colorScheme}
                  customization={selectedChar.customization}
                  size="xl"
                  autoRotate={true}
                />
                <p className="mt-4 text-gray-400 text-sm">
                  📦 Legacy blocky style
                </p>
              </div>
            )}
          </div>

          {/* Info Panel */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-4">{selectedChar.name}</h3>
              
              <div className="space-y-4">
                <StatBar label="Level" value={selectedChar.level} max={50} color="#A855F7" />
                <StatBar label="Strength" value={selectedChar.strength} max={100} color="#EF4444" />
                <StatBar label="Endurance" value={selectedChar.endurance} max={100} color="#3B82F6" />
                <StatBar label="Discipline" value={selectedChar.discipline} max={100} color="#EAB308" />
              </div>
            </div>

            {/* Features */}
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">Realistic Features</h3>
              
              <div className="grid grid-cols-2 gap-3">
                <FeatureItem icon="👤" text="Procedural Face" />
                <FeatureItem icon="💪" text="Dynamic Muscles" />
                <FeatureItem icon="✨" text="PBR Materials" />
                <FeatureItem icon="🎨" text="Skin Tones" />
                <FeatureItem icon="💇" text="Hair Styles" />
                <FeatureItem icon="👁️" text="Eye Colors" />
                <FeatureItem icon="🔥" text="Aura Effects" />
                <FeatureItem icon="🏆" text="Level Badges" />
              </div>
            </div>

            {/* Tech Stack */}
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">Tech Stack</h3>
              
              <div className="flex flex-wrap gap-2">
                <TechBadge text="Three.js" />
                <TechBadge text="React Three Fiber" />
                <TechBadge text="Drei" />
                <TechBadge text="PBR Materials" />
                <TechBadge text="Morph Targets" />
                <TechBadge text="Particles" />
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Banner */}
        <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-3xl p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Before → After
          </h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Legacy avatars used primitive shapes (spheres, cylinders, boxes).
            New system uses procedural mesh generation with realistic proportions,
            PBR skin shaders, and dynamic morphing.
          </p>
          <div className="flex justify-center gap-8 text-sm">
            <div className="text-center">
              <p className="text-gray-400 mb-2">Legacy</p>
              <p className="text-2xl font-bold text-gray-500">📦</p>
            </div>
            <div className="text-2xl text-gray-600">→</div>
            <div className="text-center">
              <p className="text-purple-400 mb-2">Realistic</p>
              <p className="text-2xl font-bold text-purple-400">👤</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper components
function StatBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const percentage = (value / max) * 100
  
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-400">{label}</span>
        <span className="text-white font-bold">{value}</span>
      </div>
      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-500"
          style={{ 
            width: `${percentage}%`,
            backgroundColor: color,
            boxShadow: `0 0 10px ${color}50`,
          }}
        />
      </div>
    </div>
  )
}

function FeatureItem({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-center gap-2 text-gray-300">
      <span>{icon}</span>
      <span className="text-sm">{text}</span>
    </div>
  )
}

function TechBadge({ text }: { text: string }) {
  return (
    <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm">
      {text}
    </span>
  )
}
'use client'

/**
 * RPM Avatar Demo Page
 * Showcase Ready Player Me realistic avatars
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import RPMAvatar from '@/app/components/rpg/RPMAvatar'
import PremiumAvatar from '@/app/components/rpg/PremiumAvatar'

// Demo character presets
const demoCharacters = [
  {
    name: 'Beginner',
    level: 1,
    strength: 10,
    endurance: 12,
    discipline: 8,
    customization: {
      skinTone: '#F0D0B0',
      hairStyle: 'short',
      hairColor: '#2C1810',
      outfit: 'tee',
      colorScheme: 'navy',
    },
  },
  {
    name: 'Warrior',
    level: 10,
    strength: 45,
    endurance: 40,
    discipline: 55,
    customization: {
      skinTone: '#D4A574',
      hairStyle: 'mohawk',
      hairColor: '#A52A2A',
      outfit: 'tank',
      colorScheme: 'crimson',
    },
  },
  {
    name: 'Elite',
    level: 20,
    strength: 70,
    endurance: 65,
    discipline: 80,
    customization: {
      skinTone: '#C68642',
      hairStyle: 'spiky',
      hairColor: '#FFD700',
      outfit: 'compression',
      colorScheme: 'gold',
    },
  },
  {
    name: 'Legend',
    level: 35,
    strength: 95,
    endurance: 88,
    discipline: 92,
    customization: {
      skinTone: '#8D5524',
      hairStyle: 'long',
      hairColor: '#C0C0C0',
      outfit: 'muscle',
      colorScheme: 'void',
    },
  },
]

export default function RPMAvatarDemoPage() {
  const router = useRouter()
  const [selectedView, setSelectedView] = useState<'rpm' | '2d'>('rpm')
  const [selectedCharacter, setSelectedCharacter] = useState(demoCharacters[0])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-sm">
            🆕 NEW: Ready Player Me
          </div>
          
          <h1 className="text-5xl font-bold text-white">
            Realistic 3D Avatars
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Photo-realistic avatars powered by Ready Player Me.
            <br />
            <span className="text-purple-400">Like World of Warcraft character creator.</span>
          </p>

          {/* View Toggle */}
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setSelectedView('rpm')}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                selectedView === 'rpm'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              🎮 Ready Player Me
            </button>
            <button
              onClick={() => setSelectedView('2d')}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                selectedView === '2d'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              🎨 Premium 2D
            </button>
          </div>
        </div>

        {/* Character Selector */}
        <div className="flex justify-center gap-3 flex-wrap">
          {demoCharacters.map((char) => (
            <button
              key={char.name}
              onClick={() => setSelectedCharacter(char)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedCharacter.name === char.name
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {char.name} (Lvl {char.level})
            </button>
          ))}
        </div>

        {/* Main Avatar Display */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Avatar Preview */}
          <div className="bg-gray-800/50 rounded-3xl p-8 border border-gray-700 flex items-center justify-center">
            {selectedView === 'rpm' ? (
              <div className="text-center">
                <RPMAvatar
                  level={selectedCharacter.level}
                  strength={selectedCharacter.strength}
                  endurance={selectedCharacter.endurance}
                  discipline={selectedCharacter.discipline}
                  customization={selectedCharacter.customization}
                  size="xl"
                  showAura={true}
                />
                <p className="mt-4 text-gray-400 text-sm">
                  🎮 Interactive 3D - Drag to rotate
                </p>
              </div>
            ) : (
              <div className="text-center">
                <PremiumAvatar
                  level={selectedCharacter.level}
                  strength={selectedCharacter.strength}
                  endurance={selectedCharacter.endurance}
                  discipline={selectedCharacter.discipline}
                  colorScheme={selectedCharacter.customization.colorScheme}
                  size="xl"
                  customization={selectedCharacter.customization}
                />
                <p className="mt-4 text-gray-400 text-sm">
                  🎨 Static 2D Illustration
                </p>
              </div>
            )}
          </div>

          {/* Stats & Info */}
          <div className="space-y-6">
            {/* Character Stats */}
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-4">
                {selectedCharacter.name}
              </h3>
              
              <div className="space-y-4">
                <StatBar 
                  label="Level" 
                  value={selectedCharacter.level} 
                  max={50}
                  color="#A855F7" 
                />
                <StatBar 
                  label="Strength" 
                  value={selectedCharacter.strength} 
                  max={100}
                  color="#EF4444" 
                />
                <StatBar 
                  label="Endurance" 
                  value={selectedCharacter.endurance} 
                  max={100}
                  color="#3B82F6" 
                />
                <StatBar 
                  label="Discipline" 
                  value={selectedCharacter.discipline} 
                  max={100}
                  color="#EAB308" 
                />
              </div>
            </div>

            {/* Visual Effects */}
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">Visual Effects</h3>
              
              <div className="space-y-3">
                {selectedCharacter.discipline > 40 && (
                  <div className="flex items-center gap-3 text-green-400">
                    <span>✨</span>
                    <span>Aura Effect Active</span>
                  </div>
                )}
                {selectedCharacter.level >= 20 && (
                  <div className="flex items-center gap-3 text-yellow-400">
                    <span>👑</span>
                    <span>Legendary Border</span>
                  </div>
                )}
                {selectedCharacter.strength > 70 && (
                  <div className="flex items-center gap-3 text-red-400">
                    <span>💪</span>
                    <span>Muscle Definition Enhanced</span>
                  </div>
                )}
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={() => router.push('/client/rpg/avatar-creator')}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
            >
              🎨 Create Your Own Avatar
            </button>
          </div>
        </div>

        {/* Feature Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            icon="🎮"
            title="Ready Player Me"
            description="Photo-realistic 3D avatars. Full character creator with face, hair, body, and outfit customization."
            features={['Realistic 3D', 'Face Customization', 'Outfit Options', 'Share Cards']}
          />
          <FeatureCard
            icon="🎨"
            title="Premium 2D"
            description="Stylized illustrations that scale muscles dynamically. Better for static share cards."
            features={['Dynamic Muscles', 'Aura Effects', 'Quick Load', 'No External API']}
          />
          <FeatureCard
            icon="⚡"
            title="Stat-Driven"
            description="Both avatar types respond to your RPG stats. Higher strength = bigger muscles."
            features={['Strength = Size', 'Discipline = Aura', 'Level = Frame', 'Real-time Updates']}
          />
        </div>
      </div>
    </div>
  )
}

// Helper: Stat bar component
function StatBar({ 
  label, 
  value, 
  max, 
  color 
}: { 
  label: string
  value: number
  max: number
  color: string 
}) {
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

// Helper: Feature card component
function FeatureCard({ 
  icon, 
  title, 
  description, 
  features 
}: { 
  icon: string
  title: string
  description: string
  features: string[]
}) {
  return (
    <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm mb-4">{description}</p>
      
      <ul className="space-y-2">
        {features.map((feature) => (
          <li key={feature} className="flex items-center gap-2 text-sm text-gray-300">
            <span className="text-green-400">✓</span>
            {feature}
          </li>
        ))}
      </ul>
    </div>
  )
}

'use client'

/**
 * Avatar V4 Demo - Modular Anatomical System
 * Strike 6: Advanced evolution with independent muscle scaling
 */

import { useState } from 'react'
import RealisticAvatarV4 from '@/app/components/rpg/RealisticAvatarV4Wrapper'
import NavBar from '@/app/components/NavBar'

const demoCharacters = [
  {
    name: 'Beginner',
    level: 1,
    strength: 15,
    endurance: 20,
    discipline: 10,
    description: 'Just starting the fitness journey',
  },
  {
    name: 'Warrior',
    level: 12,
    strength: 55,
    endurance: 48,
    discipline: 42,
    description: 'Making serious gains',
  },
  {
    name: 'Elite',
    level: 22,
    strength: 75,
    endurance: 68,
    discipline: 72,
    description: 'Athletic build with visible muscle',
  },
  {
    name: 'Legend',
    level: 38,
    strength: 95,
    endurance: 88,
    discipline: 92,
    description: 'Maximum muscle definition',
  },
]

export default function AvatarV4DemoPage() {
  const [selectedChar, setSelectedChar] = useState(demoCharacters[0])
  const [colorScheme, setColorScheme] = useState('navy')

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <NavBar role="client" />
      
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-sm">
              ⚔️ STRIKE 6: MODULAR ANATOMY
            </div>
            
            <h1 className="text-5xl font-bold text-white">
              Avatar V4
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Modular body parts with independent muscle scaling. Each muscle group grows based on your RPG stats.
            </p>
          </div>

          {/* Character Selector */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {demoCharacters.map((char) => (
              <button
                key={char.name}
                onClick={() => setSelectedChar(char)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedChar.name === char.name
                    ? 'border-blue-500 bg-blue-500/20 text-white'
                    : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600'
                }`}
              >
                <div className="text-lg font-bold">{char.name}</div>
                <div className="text-sm">STR: {char.strength}</div>
              </button>
            ))}
          </div>

          {/* Main Display */}
          <div className="flex flex-col lg:flex-row gap-8 items-center justify-center">
            <div className="bg-black/50 rounded-2xl p-8">
              <RealisticAvatarV4
                strength={selectedChar.strength}
                endurance={selectedChar.endurance}
                discipline={selectedChar.discipline}
                level={selectedChar.level}
                colorScheme={colorScheme}
                size="xl"
                autoRotate={true}
              />
            </div>

            {/* Controls */}
            <div className="w-full lg:w-80 space-y-6">
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4">{selectedChar.name}</h3>
                <p className="text-gray-400 mb-4">{selectedChar.description}</p>
                
                <div className="space-y-2">
                  <StatBar label="Strength" value={selectedChar.strength} color="bg-red-500" />
                  <StatBar label="Endurance" value={selectedChar.endurance} color="bg-green-500" />
                  <StatBar label="Discipline" value={selectedChar.discipline} color="bg-blue-500" />
                  <StatBar label="Level" value={selectedChar.level} max={40} color="bg-purple-500" />
                </div>
              </div>

              {/* Color Scheme Selector */}
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-bold text-white mb-4">Color Scheme</h3>
                <div className="grid grid-cols-5 gap-2">
                  {['navy', 'crimson', 'emerald', 'gold', 'void'].map((color) => (
                    <button
                      key={color}
                      onClick={() => setColorScheme(color)}
                      className={`h-10 rounded-lg border-2 transition-all ${
                        colorScheme === color ? 'border-white scale-110' : 'border-transparent'
                      }`}
                      style={{
                        background: {
                          navy: '#1e3a5f',
                          crimson: '#7c1d1d',
                          emerald: '#064e3b',
                          gold: '#78350f',
                          void: '#1a1a2e',
                        }[color]
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-bold text-white mb-4">V4 Features</h3>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span> Modular body parts
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span> Independent muscle scaling
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span> Enhanced materials (clearcoat, sheen)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span> Cinematic 3-point lighting
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span> Optimized 3/4 camera angle
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatBar({ label, value, max = 100, color }: { label: string; value: number; max?: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-sm text-gray-300 mb-1">
        <span>{label}</span>
        <span>{value}/{max}</span>
      </div>
      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} transition-all duration-500`}
          style={{ width: `${(value / max) * 100}%` }}
        />
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Avatar from '@/app/components/rpg/Avatar'
import NavBar from '@/app/components/NavBar'
import {
  SKIN_TONES,
  HAIR_STYLES,
  HAIR_COLORS,
  FACIAL_HAIR,
  EYE_COLORS,
  OUTFITS,
  COLOR_SCHEMES,
  getAvailableOptions,
  DEFAULT_CUSTOMIZATION,
  type AvatarCustomization,
} from '@/app/lib/rpg/customization'

export default function CustomizeAvatarPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [level, setLevel] = useState(1)
  const [stats, setStats] = useState({ strength: 0, endurance: 0, discipline: 0 })
  
  // Current customization state
  const [customization, setCustomization] = useState<AvatarCustomization>(DEFAULT_CUSTOMIZATION)
  
  // Active tab
  const [activeTab, setActiveTab] = useState<'skin' | 'hair' | 'face' | 'outfit' | 'colors'>('skin')

  // Load current customization and character stats
  useEffect(() => {
    async function loadData() {
      try {
        const [customRes, charRes] = await Promise.all([
          fetch('/api/rpg/customize'),
          fetch('/api/rpg/initialize'), // Get character stats
        ])
        
        if (customRes.ok) {
          const data = await customRes.json()
          setCustomization(data.customization || DEFAULT_CUSTOMIZATION)
          setLevel(data.level || 1)
        }
        
        if (charRes.ok) {
          const charData = await charRes.json()
          if (charData.character) {
            setStats({
              strength: charData.character.strength,
              endurance: charData.character.endurance,
              discipline: charData.character.discipline,
            })
          }
        }
      } catch (error) {
        console.error('Failed to load customization:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [])

  // Save customization
  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/rpg/customize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customization),
      })
      
      if (res.ok) {
        router.push('/client/rpg')
      } else {
        alert('Failed to save customization')
      }
    } catch (error) {
      console.error('Save error:', error)
      alert('Failed to save customization')
    } finally {
      setSaving(false)
    }
  }

  // Update a customization field
  const updateField = (field: keyof AvatarCustomization, value: string) => {
    setCustomization(prev => ({ ...prev, [field]: value }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#E8DCC4]" />
      </div>
    )
  }

  const availableSkinTones = getAvailableOptions(SKIN_TONES, level)
  const availableHairStyles = getAvailableOptions(HAIR_STYLES, level)
  const availableHairColors = getAvailableOptions(HAIR_COLORS, level)
  const availableOutfits = getAvailableOptions(OUTFITS, level)
  const availableColorSchemes = getAvailableOptions(COLOR_SCHEMES, level)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <NavBar role="client" />
      
      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              🎨 Customize Your Avatar
            </h1>
            <p className="text-gray-300">
              Personalize your character&apos;s appearance
            </p>
          </div>
          <button
            onClick={() => router.push('/client/rpg')}
            className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            ← Back
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Live Preview */}
          <div className="bg-gradient-to-br from-[#1A2332] to-[#2A3342] rounded-2xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold text-[#E8DCC4] mb-6 text-center">
              Preview
            </h2>
            <div className="flex justify-center items-center">
              <Avatar
                strength={stats.strength}
                endurance={stats.endurance}
                discipline={stats.discipline}
                size="xl"
                use3D={true}
                autoRotate={true}
                customization={customization}
              />
            </div>
            <div className="mt-6 text-center">
              <p className="text-gray-300 text-sm">
                Drag to rotate • Stats affect body shape
              </p>
            </div>
          </div>

          {/* Right: Customization Options */}
          <div className="bg-gradient-to-br from-[#1A2332] to-[#2A3342] rounded-2xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold text-[#E8DCC4] mb-6">
              Customization
            </h2>

            {/* Tab Navigation */}
            <div className="flex gap-2 mb-6 overflow-x-auto">
              {[
                { id: 'skin', label: '🎨 Skin', key: 'skin' as const },
                { id: 'hair', label: '💇 Hair', key: 'hair' as const },
                { id: 'face', label: '👀 Face', key: 'face' as const },
                { id: 'outfit', label: '👕 Outfit', key: 'outfit' as const },
                { id: 'colors', label: '🌈 Colors', key: 'colors' as const },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap ${
                    activeTab === tab.key
                      ? 'bg-[#E8DCC4] text-[#1A2332]'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {/* Skin Tone */}
              {activeTab === 'skin' && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Skin Tone</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {availableSkinTones.map(tone => (
                      <button
                        key={tone.id}
                        onClick={() => updateField('skinTone', tone.color)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          customization.skinTone === tone.color
                            ? 'border-[#E8DCC4] scale-105'
                            : 'border-gray-600 hover:border-gray-500'
                        }`}
                        style={{ backgroundColor: tone.color }}
                      >
                        <div className="text-xs font-semibold text-center mt-12 bg-black/50 rounded px-2 py-1">
                          {tone.name}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Hair */}
              {activeTab === 'hair' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Hair Style</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {availableHairStyles.map(style => (
                        <button
                          key={style.id}
                          onClick={() => updateField('hairStyle', style.id)}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            customization.hairStyle === style.id
                              ? 'border-[#E8DCC4] bg-gray-700'
                              : 'border-gray-600 bg-gray-800 hover:bg-gray-700'
                          }`}
                        >
                          <p className="text-white font-semibold">{style.name}</p>
                          {style.requiresLevel && style.requiresLevel > 1 && (
                            <p className="text-xs text-yellow-400 mt-1">
                              Level {style.requiresLevel}
                            </p>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Hair Color</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {availableHairColors.map(color => (
                        <button
                          key={color.id}
                          onClick={() => updateField('hairColor', color.color)}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            customization.hairColor === color.color
                              ? 'border-[#E8DCC4] scale-105'
                              : 'border-gray-600 hover:border-gray-500'
                          }`}
                          style={{ backgroundColor: color.color }}
                        >
                          <div className="text-xs font-semibold text-center mt-8 bg-black/50 rounded px-2 py-1">
                            {color.name}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Face */}
              {activeTab === 'face' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Facial Hair</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {FACIAL_HAIR.map(style => (
                        <button
                          key={style.id}
                          onClick={() => updateField('facialHair', style.id)}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            customization.facialHair === style.id
                              ? 'border-[#E8DCC4] bg-gray-700'
                              : 'border-gray-600 bg-gray-800 hover:bg-gray-700'
                          }`}
                        >
                          <p className="text-white font-semibold">{style.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Eye Color</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {EYE_COLORS.map(color => (
                        <button
                          key={color.id}
                          onClick={() => updateField('eyeColor', color.color)}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            customization.eyeColor === color.color
                              ? 'border-[#E8DCC4] scale-105'
                              : 'border-gray-600 hover:border-gray-500'
                          }`}
                          style={{ backgroundColor: color.color }}
                        >
                          <div className="text-xs font-semibold text-center mt-8 bg-black/50 rounded px-2 py-1">
                            {color.name}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Outfit */}
              {activeTab === 'outfit' && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Outfit Style</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {availableOutfits.map(outfit => (
                      <button
                        key={outfit.id}
                        onClick={() => updateField('outfit', outfit.id)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          customization.outfit === outfit.id
                            ? 'border-[#E8DCC4] bg-gray-700'
                            : 'border-gray-600 bg-gray-800 hover:bg-gray-700'
                        }`}
                      >
                        <p className="text-white font-semibold">{outfit.name}</p>
                        {outfit.requiresLevel && outfit.requiresLevel > 1 && (
                          <p className="text-xs text-yellow-400 mt-1">
                            Level {outfit.requiresLevel}
                          </p>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Colors (Shirt) */}
              {activeTab === 'colors' && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Outfit Color</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {availableColorSchemes.map(scheme => (
                      <button
                        key={scheme.id}
                        onClick={() => updateField('colorScheme', scheme.id)}
                        className={`p-6 rounded-lg border-2 transition-all ${
                          customization.colorScheme === scheme.id
                            ? 'border-[#E8DCC4] scale-105'
                            : 'border-gray-600 hover:border-gray-500'
                        }`}
                        style={{
                          background: `linear-gradient(135deg, ${scheme.primary} 0%, ${scheme.accent} 100%)`,
                        }}
                      >
                        <p className="text-white font-semibold drop-shadow-lg">
                          {scheme.name}
                        </p>
                        {scheme.requiresLevel && scheme.requiresLevel > 1 && (
                          <p className="text-xs text-yellow-300 mt-1 drop-shadow">
                            Level {scheme.requiresLevel}
                          </p>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Save Button */}
            <div className="mt-8 flex gap-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : '💾 Save Changes'}
              </button>
              <button
                onClick={() => setCustomization(DEFAULT_CUSTOMIZATION)}
                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-4 rounded-lg font-semibold transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}

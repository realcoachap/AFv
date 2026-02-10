'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SetStatsButton({
  userId,
  userName,
  preset,
}: {
  userId: string
  userName: string
  preset: 'reset' | 'strength' | 'cardio' | 'balanced' | 'max'
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const presetConfigs = {
    reset: { strength: 0, endurance: 0, discipline: 0, label: 'Reset to 0', color: 'gray' },
    strength: { strength: 60, endurance: 10, discipline: 30, label: 'Strength Build', color: 'red' },
    cardio: { strength: 10, endurance: 60, discipline: 30, label: 'Cardio Build', color: 'blue' },
    balanced: { strength: 40, endurance: 40, discipline: 40, label: 'Balanced', color: 'purple' },
    max: { strength: 90, endurance: 90, discipline: 90, label: 'Max All', color: 'gold' },
  }

  const config = presetConfigs[preset]

  async function handleSet() {
    if (!confirm(`Set ${userName}'s stats to:\nStrength: ${config.strength}\nEndurance: ${config.endurance}\nDiscipline: ${config.discipline}`)) {
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/rpg/set-stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          strength: config.strength,
          endurance: config.endurance,
          discipline: config.discipline,
        }),
      })

      if (res.ok) {
        router.refresh()
      } else {
        alert('Failed to set stats')
      }
    } catch (error) {
      console.error(error)
      alert('Error setting stats')
    } finally {
      setLoading(false)
    }
  }

  const colorClasses = {
    gray: 'bg-gray-500 hover:bg-gray-600',
    red: 'bg-red-600 hover:bg-red-700',
    blue: 'bg-blue-600 hover:bg-blue-700',
    purple: 'bg-purple-600 hover:bg-purple-700',
    gold: 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600',
  }

  return (
    <button
      onClick={handleSet}
      disabled={loading}
      className={`px-3 py-1 ${colorClasses[config.color as keyof typeof colorClasses]} text-white rounded text-xs font-semibold transition-colors disabled:opacity-50`}
    >
      {loading ? '...' : config.label}
    </button>
  )
}

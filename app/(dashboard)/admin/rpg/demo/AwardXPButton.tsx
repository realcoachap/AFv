'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AwardXPButton({
  userId,
  userName,
  amount,
  label,
  variant = 'default',
}: {
  userId: string
  userName: string
  amount: number
  label: string
  variant?: 'default' | 'legendary'
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleAward() {
    setLoading(true)
    try {
      const res = await fetch('/api/rpg/award-xp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          amount,
          source: 'admin_manual',
          note: `Manual XP award by admin`,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        
        // Show level up alert if applicable
        if (data.didLevelUp) {
          alert(
            `🎉 ${userName} leveled up!\n\nLevel ${data.oldLevel} → Level ${data.newLevel}\n\n${data.unlocks.length > 0 ? 'Unlocks:\n' + data.unlocks.join('\n') : ''}`
          )
        }
        
        router.refresh()
      } else {
        alert('Failed to award XP')
      }
    } catch (error) {
      console.error(error)
      alert('Error awarding XP')
    } finally {
      setLoading(false)
    }
  }

  const buttonClass =
    variant === 'legendary'
      ? 'px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-400 text-sm font-bold transition-all shadow-lg'
      : 'px-4 py-2 bg-[#1A2332] text-white rounded hover:bg-[#2A3342] disabled:bg-gray-400 text-sm font-semibold transition-colors'

  return (
    <button onClick={handleAward} disabled={loading} className={buttonClass}>
      {loading ? '...' : label}
    </button>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function InitializeCharacterButton({ userId }: { userId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleInitialize() {
    setLoading(true)
    try {
      const res = await fetch('/api/rpg/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })

      if (res.ok) {
        router.refresh()
      } else {
        alert('Failed to initialize character')
      }
    } catch (error) {
      console.error(error)
      alert('Error initializing character')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleInitialize}
      disabled={loading}
      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 text-sm font-semibold transition-colors"
    >
      {loading ? 'Creating...' : '🎮 Initialize RPG'}
    </button>
  )
}

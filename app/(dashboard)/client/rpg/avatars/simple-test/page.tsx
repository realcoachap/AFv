'use client'

/**
 * Simple Avatar V4 Test - No 3D, just to verify page loads
 */

import { useState } from 'react'
import NavBar from '@/app/components/NavBar'

export default function SimpleAvatarTest() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <NavBar role="client" />
      
      <div className="p-6 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Avatar V4 Test Page</h1>
        <p className="text-gray-400 mb-8">If you can see this, the page is working!</p>
        
        <div className="bg-gray-800 rounded-xl p-8 max-w-md mx-auto">
          <p className="text-white text-2xl mb-4">Count: {count}</p>
          <button
            onClick={() => setCount(c => c + 1)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold"
          >
            Click Me
          </button>
        </div>
        
        <div className="mt-8">
          <a
            href="/client/rpg/avatars/v4"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            Try Avatar V4 (with 3D)
          </a>
        </div>
      </div>
    </div>
  )
}
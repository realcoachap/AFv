'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { APP_VERSION } from '@/app/lib/version'

interface NavBarProps {
  role: 'admin' | 'client'
  backLink?: string
  backText?: string
}

export default function NavBar({ role, backLink, backText }: NavBarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dashboardLink = role === 'admin' ? '/admin/dashboard' : '/client/dashboard'

  const rpgLinks = [
    { label: '🆕 Avatar V4', href: '/client/rpg/avatars/v4' },
    { label: '🧪 Enhancement Lab', href: '/client/rpg/avatar-lab' },
    { label: '🏋️ Mannequin.js', href: '/client/rpg/avatar-mannequin' },
    { label: '🎮 Avatars V3', href: '/client/rpg/avatars/realistic' },
    { label: '🧠 AI Texture', href: '/client/rpg/avatar-ai-texture' },
    { label: '🎭 VRoid Demo', href: '/client/rpg/vroid-demo' },
    { label: '⚔️ Agent Teams', href: '/client/rpg/agent-teams-demo' },
    { label: '🎯 Quests', href: '/client/rpg/quests' },
    { label: '📸 Share Cards', href: '/client/rpg/share-cards' },
    { label: '🔄 RPM Creator', href: '/client/rpg/avatar-creator-rpm' },
  ]

  return (
    <nav className="bg-[#1A2332] text-white p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href={dashboardLink}>
          <Image src="/logo.jpg" alt="Logo" width={48} height={48} className="w-12 h-12" priority />
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-4 text-sm sm:text-base">
          {role === 'client' && (
            <>
              <Link href="/client/resources" className="text-[#E8DCC4] hover:text-white font-medium">
                📚 Resources
              </Link>

              {/* RPG Features Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setIsOpen(!isOpen)}
                  className="text-gray-300 hover:text-white flex items-center gap-1"
                >
                  🎮 RPG Features {isOpen ? '▲' : '▼'}
                </button>
                
                {isOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#1A2332] border border-gray-700 rounded-lg shadow-xl z-50"
                  >
                    <div className="p-2">
                      {rpgLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setIsOpen(false)}
                          className="block px-3 py-2 text-sm text-[#E8DCC4] hover:bg-gray-800 hover:text-white rounded transition-colors"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Link href="/client/profile" className="text-gray-300 hover:text-white hidden sm:block">
                Profile
              </Link>
              <Link href="/client/schedule" className="text-gray-300 hover:text-white hidden sm:block">
                Schedule
              </Link>
            </>
          )}
          
          {backLink && (
            <Link href={backLink} className="text-gray-300 hover:text-white">
              {backText || '← Back'}
            </Link>
          )}
          
          <span className="text-xs text-gray-500 hidden sm:inline">v{APP_VERSION}</span>
        </div>
      </div>
    </nav>
  )
}

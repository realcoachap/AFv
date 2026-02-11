import Link from 'next/link'
import Image from 'next/image'

interface NavBarProps {
  role: 'admin' | 'client'
  backLink?: string
  backText?: string
}

export default function NavBar({ role, backLink, backText }: NavBarProps) {
  const dashboardLink = role === 'admin' ? '/admin/dashboard' : '/client/dashboard'
  const defaultBackText = backLink ? '← Back' : ''

  // Temporary dev links - all RPG features
  const devLinks = [
    { label: '🎮 Avatars V3', href: '/client/rpg/avatars/realistic' },
    { label: '🧠 AI Texture', href: '/client/rpg/avatar-ai-texture' },
    { label: '🎭 VRoid Demo', href: '/client/rpg/vroid-demo' },
    { label: '⚔️ Agent Teams', href: '/client/rpg/agent-teams-demo' },
    { label: '🎯 Quests', href: '/client/rpg/quests' },
    { label: '📸 Share Cards', href: '/client/rpg/share-cards' },
    { label: '🔄 RPM Creator', href: '/client/rpg/avatar-creator-rpm' },
  ]

  return (
    <nav className="bg-[#1A2332] text-white p-3 sm:p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo Only - No Text */}
        <Link href={dashboardLink} className="flex items-center hover:opacity-80 transition-opacity">
          <Image 
            src="/logo.jpg" 
            alt="Ascending Fitness" 
            width={48} 
            height={48} 
            className="object-contain w-12 h-12 sm:w-14 sm:h-14" 
            priority
          />
        </Link>

        <div className="flex items-center gap-4">
          {/* TEMPORARY: Dev Links Dropdown */}
          <div className="relative group">
            <button className="text-[#E8DCC4] hover:text-white text-sm sm:text-base flex items-center gap-1">
              🎮 RPG Features ▼
            </button>
            
            <div className="absolute right-0 mt-2 w-56 bg-[#1A2332] border border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <div className="p-2">
                <p className="text-xs text-gray-500 px-3 py-1 border-b border-gray-700 mb-1">Temporary Dev Links</p>
                {devLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-3 py-2 text-sm text-[#E8DCC4] hover:bg-gray-800 hover:text-white rounded transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Back Link - Compact on mobile */}
          {backLink && (
            <Link href={backLink} className="text-[#E8DCC4] hover:underline text-sm sm:text-base">
              {backText || defaultBackText}
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

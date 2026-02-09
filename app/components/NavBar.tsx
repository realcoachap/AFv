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

        {/* Back Link - Compact on mobile */}
        {backLink && (
          <Link href={backLink} className="text-[#E8DCC4] hover:underline text-sm sm:text-base">
            {backText || defaultBackText}
          </Link>
        )}
      </div>
    </nav>
  )
}

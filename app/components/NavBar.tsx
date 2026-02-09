import Link from 'next/link'
import Logo from './Logo'

interface NavBarProps {
  role: 'admin' | 'client'
  backLink?: string
  backText?: string
}

export default function NavBar({ role, backLink, backText }: NavBarProps) {
  const dashboardLink = role === 'admin' ? '/admin/dashboard' : '/client/dashboard'
  const defaultBackText = backLink ? '← Back' : ''

  return (
    <nav className="bg-[#1A2332] text-white p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href={dashboardLink} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <Logo size="sm" showText={false} />
          <span className="text-xl font-bold">Ascending Fitness</span>
          {role === 'admin' && <span className="text-[#E8DCC4] text-sm">— Admin</span>}
        </Link>

        {/* Back Link */}
        {backLink && (
          <Link href={backLink} className="text-[#E8DCC4] hover:underline">
            {backText || defaultBackText}
          </Link>
        )}
      </div>
    </nav>
  )
}

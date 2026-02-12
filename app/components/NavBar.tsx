'use client'

import Link from 'next/link'
import Image from 'next/image'
import { APP_VERSION } from '@/app/lib/version'

interface NavBarProps {
  role: 'admin' | 'client'
  backLink?: string
  backText?: string
}

export default function NavBar({ role, backLink, backText }: NavBarProps) {
  const dashboardLink = role === 'admin' ? '/admin/dashboard' : '/client/dashboard'

  return (
    <nav className="bg-[#1A2332] text-white p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <!-- Logo -->
        <Link href={dashboardLink}>
          <Image src="/logo.jpg" alt="Logo" width={48} height={48} className="w-12 h-12" priority />
        </Link>

        <!-- Nav Links -->
        <div className="flex items-center gap-4">
          <Link href="/client/resources" className="text-gray-300 hover:text-white">Resources</Link>
          
          {backLink && (
            <Link href={backLink} className="text-gray-300 hover:text-white">{backText || '← Back'}</Link>
          )}
          
          <span className="text-xs text-gray-500">v{APP_VERSION}</span>
        </div>
      </div>
    </nav>
  )
}

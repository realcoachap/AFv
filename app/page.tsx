import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default async function Home() {
  const session = await auth()

  // If logged in, redirect to appropriate dashboard
  if (session) {
    if (session.user.role === 'ADMIN') {
      redirect('/admin/dashboard')
    } else {
      redirect('/client/dashboard')
    }
  }

  // If not logged in, show landing page
  return (
    <div className="min-h-screen bg-[#1A2332] text-white">
      <div className="max-w-6xl mx-auto px-4 py-16 sm:py-24">
        <div className="text-center">
          <Image
            src="/branding/logo.jpg"
            alt="Ascending Fitness"
            width={300}
            height={300}
            className="mx-auto mb-8"
            priority
          />
          <h1 className="text-5xl font-bold text-[#E8DCC4] mb-4">
            Ascending Fitness
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Reach new heights with personalized training
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/register"
              className="bg-[#E8DCC4] text-[#1A2332] px-8 py-3 rounded-lg font-semibold hover:bg-[#D8CCA4] transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="border-2 border-[#E8DCC4] text-[#E8DCC4] px-8 py-3 rounded-lg font-semibold hover:bg-[#E8DCC4] hover:text-[#1A2332] transition-colors"
            >
              Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

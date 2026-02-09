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
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Image
            src="/logo.jpg"
            alt="Ascending Fitness"
            width={320}
            height={320}
            className="mx-auto mb-8 w-80 h-auto"
            priority
          />
          <h1 className="text-5xl sm:text-6xl font-bold text-[#E8DCC4] mb-6">
            Transform Your Fitness Journey
          </h1>
          <p className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Personalized training, expert guidance, and the tools you need to reach new heights
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-[#E8DCC4] text-[#1A2332] px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#D8CCA4] transition-all hover:scale-105"
            >
              Get Started →
            </Link>
            <Link
              href="/login"
              className="border-2 border-[#E8DCC4] text-[#E8DCC4] px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#E8DCC4] hover:text-[#1A2332] transition-all"
            >
              Member Login
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <Feature
            title="Personalized Training"
            description="One-on-one sessions tailored to your goals, fitness level, and schedule"
          />
          <Feature
            title="Easy Scheduling"
            description="Book sessions, track progress, and manage your fitness journey in one place"
          />
          <Feature
            title="Expert Guidance"
            description="Professional coaching to help you achieve results safely and effectively"
          />
        </div>

        {/* Footer */}
        <div className="text-center mt-20 text-gray-400 text-sm">
          <p>© 2026 Ascending Fitness. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

function Feature({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-[#2A3342] rounded-lg p-6 text-center hover:bg-[#3A4352] transition-colors">
      <h3 className="text-xl font-bold text-[#E8DCC4] mb-3">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  )
}

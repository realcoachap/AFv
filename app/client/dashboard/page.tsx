import { auth, signOut } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import VersionFooter from '@/app/components/VersionFooter'

export default async function ClientDashboard() {
  const session = await auth()

  if (!session || session.user.role !== 'CLIENT') {
    redirect('/login')
  }

  // Fetch client profile and upcoming sessions
  const [profile, upcomingCount] = await Promise.all([
    prisma.clientProfile.findUnique({
      where: { userId: session.user.id },
    }),
    prisma.appointment.count({
      where: {
        clientId: session.user.id,
        dateTime: { gte: new Date() },
        status: { in: ['CONFIRMED', 'PENDING_APPROVAL'] },
      },
    }),
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      <VersionFooter />
      <nav className="bg-[#1A2332] text-white p-3 sm:p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/client/dashboard" className="flex items-center hover:opacity-80 transition-opacity">
            <Image 
              src="/logo.jpg" 
              alt="Ascending Fitness" 
              width={56} 
              height={56} 
              className="object-contain w-14 h-14 sm:w-16 sm:h-16" 
              priority
            />
          </Link>
          <div className="flex gap-3 sm:gap-4 items-center text-sm sm:text-base">
            <Link
              href="/client/profile"
              className="hover:text-[#E8DCC4] transition-colors"
            >
              Profile
            </Link>
            <Link
              href="/client/schedule"
              className="hover:text-[#E8DCC4] transition-colors"
            >
              Schedule
            </Link>
            <Link
              href="/client/rpg"
              className="hover:text-[#E8DCC4] transition-colors font-bold"
            >
              🎮 RPG
            </Link>
            <Link
              href="/client/calculator"
              className="hover:text-[#E8DCC4] transition-colors"
            >
              Calculator
            </Link>
            <form
              action={async () => {
                'use server'
                await signOut()
              }}
            >
              <button
                type="submit"
                className="bg-[#E8DCC4] text-[#1A2332] px-4 py-2 rounded hover:bg-[#D8CCA4] transition-colors"
              >
                Logout
              </button>
            </form>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#1A2332] mb-2">
            Welcome, {profile?.fullName || 'Client'}! 💪
          </h2>
          <p className="text-gray-600">
            Ready to reach new heights with your fitness journey!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Link href="/client/profile" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">My Profile</h3>
            <p className="text-gray-600 mb-4 text-sm">
              {profile?.fullName || 'Complete your profile'}
            </p>
            <span className="text-[#E8DCC4] font-medium text-sm">
              View/Edit Profile →
            </span>
          </Link>

          <Link href="/client/schedule" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Upcoming Sessions</h3>
            <p className="text-4xl font-bold text-[#10B981]">{upcomingCount}</p>
            <p className="text-sm text-gray-500 mt-2">
              {upcomingCount === 0 ? 'Book your first session' : 'sessions coming up'}
            </p>
            <span className="mt-4 inline-block text-[#E8DCC4] font-medium text-sm">
              View Schedule →
            </span>
          </Link>

          <Link href="/client/calculator" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Calorie Calculator</h3>
            <p className="text-4xl font-bold text-[#6366F1]">🔢</p>
            <p className="text-sm text-gray-500 mt-2">Calculate your macros</p>
            <span className="mt-4 inline-block text-[#E8DCC4] font-medium text-sm">
              Calculate Now →
            </span>
          </Link>
        </div>

        {/* RPG Feature Highlight */}
        <Link 
          href="/client/rpg" 
          className="mt-6 block bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-2xl p-8 text-white hover:from-purple-700 hover:to-pink-700 transition-all"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                🎮 YOUR CHARACTER
              </h3>
              <p className="text-lg mb-3 opacity-90">
                Track your fitness journey with an RPG-style character! Gain XP, level up, and watch your avatar evolve as you train.
              </p>
              <span className="inline-block bg-white text-purple-700 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors shadow-lg">
                View Your Character →
              </span>
            </div>
            <div className="hidden sm:block text-8xl">
              ⚡
            </div>
          </div>
        </Link>
      </main>
    </div>
  )
}

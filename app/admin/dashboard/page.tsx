import { auth, signOut } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import VersionFooter from '@/app/components/VersionFooter'

export default async function AdminDashboard() {
  const session = await auth()

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/login')
  }

  // Get stats
  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  
  const [clientCount, todaySessions, pendingApprovals] = await Promise.all([
    prisma.user.count({
      where: { role: 'CLIENT' },
    }),
    prisma.appointment.count({
      where: {
        dateTime: {
          gte: startOfToday,
          lt: new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000),
        },
        status: { in: ['CONFIRMED', 'PENDING_APPROVAL'] },
      },
    }),
    prisma.appointment.count({
      where: { status: 'PENDING_APPROVAL' },
    }),
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      <VersionFooter />
      <nav className="bg-[#1A2332] text-white p-3 sm:p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/admin/dashboard" className="flex items-center hover:opacity-80 transition-opacity">
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
              href="/admin/clients"
              className="hover:text-[#E8DCC4] transition-colors"
            >
              Clients
            </Link>
            <Link
              href="/admin/schedule"
              className="hover:text-[#E8DCC4] transition-colors"
            >
              Schedule
            </Link>
            <Link
              href="/admin/calculator"
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
          <h2 className="text-2xl font-bold text-[#1A2332] mb-2 flex items-center gap-2">
            Welcome, Coach! 💪
          </h2>
          <p className="text-gray-600">
            Ready to help your clients crush their goals today
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Link href="/admin/clients" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Clients</h3>
            <p className="text-4xl font-bold text-[#1A2332]">{clientCount}</p>
            <p className="text-sm text-[#E8DCC4] mt-2 font-medium">View All →</p>
          </Link>

          <Link href="/admin/schedule?status=PENDING_APPROVAL" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Pending Approvals</h3>
            <p className="text-4xl font-bold text-[#F59E0B]">{pendingApprovals}</p>
            <p className="text-sm text-[#E8DCC4] font-medium mt-2">
              {pendingApprovals > 0 ? 'Review Now →' : 'All clear!'}
            </p>
          </Link>

          <Link href="/admin/schedule" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Today's Sessions</h3>
            <p className="text-4xl font-bold text-[#10B981]">{todaySessions}</p>
            <p className="text-sm text-[#E8DCC4] font-medium mt-2">View Schedule →</p>
          </Link>

          <Link href="/admin/calculator" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Calorie Calculator</h3>
            <p className="text-4xl font-bold text-[#6366F1]">🔢</p>
            <p className="text-sm text-[#E8DCC4] font-medium mt-2">Calculate Macros →</p>
          </Link>
        </div>

        {/* RPG Demo Card */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-300 rounded-lg p-6 mt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-purple-900 mb-2">
                🎮 NEW: RPG System Demo
              </h3>
              <p className="text-purple-700 mb-3">
                Test the gamification system! Award XP, view stats, and see the magic in action.
              </p>
              <Link
                href="/admin/rpg/demo"
                className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-bold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
              >
                Open RPG Demo →
              </Link>
            </div>
            <div className="hidden sm:block text-6xl">
              🏆
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            🎉 Phase 2 Complete!
          </h3>
          <p className="text-blue-800 mb-4">
            Authentication system is working! You're logged in as an admin.
          </p>
          <ul className="list-disc list-inside text-blue-700 space-y-1">
            <li>✅ Login page working</li>
            <li>✅ Registration page working</li>
            <li>✅ Role-based dashboards</li>
            <li>✅ Password hashing enabled</li>
            <li>✅ Protected routes active</li>
          </ul>
          <p className="text-blue-800 mt-4 font-medium">
            Next: Phase 3 - Build out these dashboards!
          </p>
        </div>
      </main>
    </div>
  )
}

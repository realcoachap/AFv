import { auth, signOut } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

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
      <nav className="bg-[#1A2332] text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">🏋️ Ascending Fitness</h1>
          <div className="flex gap-4 items-center">
            <Link
              href="/client/profile"
              className="hover:text-[#E8DCC4] transition-colors"
            >
              My Profile
            </Link>
            <Link
              href="/client/schedule"
              className="hover:text-[#E8DCC4] transition-colors"
            >
              Schedule
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/client/profile" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">My Profile</h3>
            <p className="text-gray-600 mb-4">
              {profile?.fullName || 'Not set'}<br />
              {profile?.phone || 'No phone'}<br />
              {session.user.email}
            </p>
            <span className="text-[#1A2332] font-medium hover:underline">
              View/Edit Profile →
            </span>
          </Link>

          <Link href="/client/schedule" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Upcoming Sessions</h3>
            <p className="text-4xl font-bold text-[#1A2332]">{upcomingCount}</p>
            <p className="text-sm text-gray-500 mt-2">
              {upcomingCount === 0 ? 'No sessions scheduled' : `${upcomingCount} session${upcomingCount !== 1 ? 's' : ''} coming up`}
            </p>
            <span className="mt-4 inline-block text-[#1A2332] font-medium hover:underline">
              View Schedule →
            </span>
          </Link>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold text-green-900 mb-2">
            🎉 Welcome to Ascending Fitness!
          </h3>
          <p className="text-green-800 mb-4">
            Your account has been created successfully. You're logged in!
          </p>
          <ul className="list-disc list-inside text-green-700 space-y-1">
            <li>✅ Account registered</li>
            <li>✅ Logged in successfully</li>
            <li>⏳ Complete your profile (coming soon)</li>
            <li>⏳ Book your first session (coming soon)</li>
          </ul>
        </div>
      </main>
    </div>
  )
}

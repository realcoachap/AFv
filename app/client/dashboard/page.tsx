import { auth, signOut } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export default async function ClientDashboard() {
  const session = await auth()

  if (!session || session.user.role !== 'CLIENT') {
    redirect('/login')
  }

  // Fetch client profile
  const profile = await prisma.clientProfile.findUnique({
    where: { userId: session.user.id },
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-[#1A2332] text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Ascending Fitness</h1>
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
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">My Profile</h3>
            <p className="text-gray-600 mb-4">
              {profile?.fullName || 'Not set'}<br />
              {profile?.phone || 'No phone'}<br />
              {session.user.email}
            </p>
            <button className="text-[#1A2332] font-medium hover:underline">
              Edit Profile → (Coming in Phase 4)
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Upcoming Sessions</h3>
            <p className="text-4xl font-bold text-[#1A2332]">0</p>
            <p className="text-sm text-gray-500 mt-2">No sessions scheduled</p>
            <button className="mt-4 text-[#1A2332] font-medium hover:underline">
              Book Session → (Coming in Phase 5)
            </button>
          </div>
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

import { auth, signOut } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function AdminDashboard() {
  const session = await auth()

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/login')
  }

  // Get client count
  const clientCount = await prisma.user.count({
    where: { role: 'CLIENT' },
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-[#1A2332] text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Ascending Fitness - Admin</h1>
          <div className="flex gap-4 items-center">
            <Link
              href="/admin/clients"
              className="hover:text-[#E8DCC4] transition-colors"
            >
              Clients
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
            Welcome, Coach! 👋
          </h2>
          <p className="text-gray-600">
            Logged in as: <span className="font-medium">{session.user.email}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/admin/clients" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Clients</h3>
            <p className="text-4xl font-bold text-[#1A2332]">{clientCount}</p>
            <p className="text-sm text-[#E8DCC4] mt-2 font-medium">View All →</p>
          </Link>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Pending Approvals</h3>
            <p className="text-4xl font-bold text-[#F59E0B]">0</p>
            <p className="text-sm text-gray-500 mt-2">Coming in Phase 5</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Today's Sessions</h3>
            <p className="text-4xl font-bold text-[#10B981]">0</p>
            <p className="text-sm text-gray-500 mt-2">Coming in Phase 5</p>
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

import { auth, signOut } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>
}) {
  const session = await auth()

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/login')
  }

  // Fetch clients
  const params = await searchParams
  const searchQuery = params.search || ''
  const response = await fetch(
    `${process.env.NEXTAUTH_URL}/api/admin/clients?search=${searchQuery}`,
    {
      headers: {
        Cookie: `authjs.session-token=${session.user.id}`, // Pass session
      },
      cache: 'no-store',
    }
  ).catch(() => null)

  let clients: any[] = []
  if (response && response.ok) {
    const data = await response.json()
    clients = data.clients || []
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-[#1A2332] text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Ascending Fitness - Admin</h1>
          <div className="flex gap-4 items-center">
            <Link
              href="/admin/dashboard"
              className="hover:text-[#E8DCC4] transition-colors"
            >
              Dashboard
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
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#1A2332]">Clients</h2>
            <div className="text-sm text-gray-600">
              {clients.length} client{clients.length !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Search */}
          <form className="mb-6">
            <input
              type="text"
              name="search"
              defaultValue={searchQuery}
              placeholder="Search by name or email..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E8DCC4] focus:border-transparent"
            />
          </form>

          {/* Client List */}
          {clients.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg mb-2">No clients yet</p>
              <p className="text-gray-500">
                Clients will appear here after they register
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {clients.map((client: any) => (
                <div
                  key={client.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-[#E8DCC4] transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[#1A2332]">
                        {client.clientProfile?.fullName || 'No name provided'}
                      </h3>
                      <p className="text-gray-600">
                        {client.email}
                        {client.clientProfile?.phone && (
                          <> • {client.clientProfile.phone}</>
                        )}
                      </p>
                      <div className="flex gap-4 mt-2 text-sm text-gray-500">
                        <span>
                          Profile: {client.profileCompletion}% complete
                        </span>
                        <span>
                          Joined:{' '}
                          {new Date(client.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {/* Profile Completion Bar */}
                      <div className="w-48 bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className={`h-2 rounded-full ${
                            client.profileCompletion >= 80
                              ? 'bg-[#10B981]'
                              : client.profileCompletion >= 50
                              ? 'bg-[#F59E0B]'
                              : 'bg-[#EF4444]'
                          }`}
                          style={{ width: `${client.profileCompletion}%` }}
                        ></div>
                      </div>
                    </div>
                    <Link
                      href={`/admin/clients/${client.id}`}
                      className="bg-[#E8DCC4] text-[#1A2332] px-4 py-2 rounded font-semibold hover:bg-[#D8CCA4] transition-colors whitespace-nowrap"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

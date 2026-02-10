import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Avatar from '@/app/components/rpg/Avatar'
import { calculatePowerLevel } from '@/app/lib/rpg/stats'

export default async function AdminAvatarsPage() {
  const session = await auth()

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/login')
  }

  // Get all clients with RPG characters
  const clients = await prisma.user.findMany({
    where: {
      role: 'CLIENT',
      rpgCharacter: {
        isNot: null,
      },
    },
    include: {
      rpgCharacter: true,
      clientProfile: true,
    },
    orderBy: {
      email: 'asc',
    },
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            🎮 Client Avatars
          </h1>
          <p className="text-gray-300">
            View all your clients&apos; 3D RPG characters
          </p>
        </div>

        {clients.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <p className="text-gray-500 text-lg">
              No clients have RPG characters yet.
            </p>
            <p className="text-gray-400 mt-2">
              Characters are created automatically when clients complete their first session.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {clients.map((client) => {
              const char = client.rpgCharacter!
              const powerLevel = calculatePowerLevel(
                char.strength,
                char.endurance,
                char.discipline
              )

              return (
                <div
                  key={client.id}
                  className="bg-gradient-to-br from-[#1A2332] to-[#2A3342] rounded-2xl shadow-2xl p-6 text-white"
                >
                  {/* Avatar */}
                  <div className="flex justify-center mb-4">
                    <Avatar
                      strength={char.strength}
                      endurance={char.endurance}
                      discipline={char.discipline}
                      colorScheme="navy"
                      size="lg"
                      use3D={true}
                      autoRotate={true}
                    />
                  </div>

                  {/* Client Info */}
                  <div className="text-center mb-4">
                    <h3 className="text-2xl font-bold text-[#E8DCC4] mb-1">
                      {client.clientProfile?.fullName || client.email}
                    </h3>
                    <div className="inline-flex items-center gap-2 bg-[#E8DCC4] text-[#1A2332] px-4 py-1 rounded-full font-bold">
                      <span>⚡</span>
                      <span>LEVEL {char.level}</span>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-red-600/20 border border-red-500/30 rounded-lg p-3 text-center">
                      <p className="text-xs opacity-75 mb-1">💪 Strength</p>
                      <p className="text-xl font-bold">{char.strength}</p>
                    </div>
                    <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-3 text-center">
                      <p className="text-xs opacity-75 mb-1">🏃 Endurance</p>
                      <p className="text-xl font-bold">{char.endurance}</p>
                    </div>
                    <div className="bg-yellow-600/20 border border-yellow-500/30 rounded-lg p-3 text-center">
                      <p className="text-xs opacity-75 mb-1">🎯 Discipline</p>
                      <p className="text-xl font-bold">{char.discipline}</p>
                    </div>
                    <div className="bg-purple-600/20 border border-purple-500/30 rounded-lg p-3 text-center">
                      <p className="text-xs opacity-75 mb-1">⚡ Power</p>
                      <p className="text-xl font-bold">{powerLevel}</p>
                    </div>
                  </div>

                  {/* Streak */}
                  <div className="mt-4 bg-gradient-to-r from-orange-600/20 to-red-600/20 border border-orange-500/30 rounded-lg p-3 text-center">
                    <p className="text-sm opacity-75 mb-1">Current Streak</p>
                    <p className="text-2xl font-bold">
                      🔥 {char.currentStreak} days
                    </p>
                  </div>

                  {/* View Full Profile Link */}
                  <div className="mt-4">
                    <a
                      href={`/admin/clients/${client.id}`}
                      className="block text-center bg-[#E8DCC4] text-[#1A2332] px-4 py-2 rounded-lg font-semibold hover:bg-[#d4c2aa] transition-colors"
                    >
                      View Full Profile
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

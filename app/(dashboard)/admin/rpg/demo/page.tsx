import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { calculateLevel, getLevelProgress } from '@/app/lib/rpg/levels'
import { calculatePowerLevel } from '@/app/lib/rpg/stats'
import Link from 'next/link'
import InitializeCharacterButton from './InitializeCharacterButton'
import AwardXPButton from './AwardXPButton'

export default async function AdminRPGDemoPage() {
  const session = await auth()

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/login')
  }

  // Get all clients
  const clients = await prisma.user.findMany({
    where: { role: 'CLIENT' },
    include: {
      clientProfile: true,
      rpgCharacter: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-[#1A2332] text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">🎮 RPG System Demo (Admin)</h1>
          <Link
            href="/admin/dashboard"
            className="text-[#E8DCC4] hover:underline"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#1A2332] mb-2">
            RPG System Test Dashboard
          </h2>
          <p className="text-gray-600 mb-4">
            Backend systems are live! This demo page lets you test XP awarding,
            character initialization, and stat tracking.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded p-4">
            <p className="text-sm text-blue-800">
              <strong>Status:</strong> Database schema deployed ✓ | Core logic
              complete ✓ | Frontend UI coming next!
            </p>
          </div>
        </div>

        {/* Client List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-[#1A2332] mb-4">
            Client RPG Characters ({clients.length})
          </h3>

          <div className="space-y-4">
            {clients.map((client) => {
              const character = client.rpgCharacter
              const hasCharacter = !!character

              // Calculate derived values if character exists
              const level = hasCharacter
                ? character.level
                : calculateLevel(0)
              const progress = hasCharacter
                ? getLevelProgress(character.xp)
                : { current: 0, required: 100, percentage: 0 }
              const powerLevel = hasCharacter
                ? calculatePowerLevel(
                    character.strength,
                    character.endurance,
                    character.discipline
                  )
                : 0

              return (
                <div
                  key={client.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-[#E8DCC4] transition-colors"
                >
                  <div className="flex justify-between items-start">
                    {/* Client Info */}
                    <div className="flex-1">
                      <h4 className="font-bold text-lg text-[#1A2332]">
                        {client.clientProfile?.fullName || client.email}
                      </h4>
                      <p className="text-sm text-gray-500">{client.email}</p>

                      {hasCharacter ? (
                        <div className="mt-3 space-y-2">
                          {/* Level & XP */}
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-[#1A2332]">
                                Level {level}
                              </span>
                              <span className="text-sm text-gray-600">
                                ({character.xp} total XP)
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div
                                className="bg-gradient-to-r from-[#1A2332] to-[#E8DCC4] h-3 rounded-full transition-all duration-300"
                                style={{ width: `${progress.percentage}%` }}
                              />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {progress.current}/{progress.required} XP to Level{' '}
                              {level + 1} ({progress.percentage}%)
                            </p>
                          </div>

                          {/* Stats */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">
                            <div className="bg-red-50 p-2 rounded">
                              <p className="text-xs text-red-600 font-semibold">
                                💪 STRENGTH
                              </p>
                              <p className="text-lg font-bold text-red-700">
                                {character.strength}
                              </p>
                            </div>
                            <div className="bg-blue-50 p-2 rounded">
                              <p className="text-xs text-blue-600 font-semibold">
                                🏃 ENDURANCE
                              </p>
                              <p className="text-lg font-bold text-blue-700">
                                {character.endurance}
                              </p>
                            </div>
                            <div className="bg-yellow-50 p-2 rounded">
                              <p className="text-xs text-yellow-600 font-semibold">
                                🎯 DISCIPLINE
                              </p>
                              <p className="text-lg font-bold text-yellow-700">
                                {character.discipline}
                              </p>
                            </div>
                            <div className="bg-purple-50 p-2 rounded">
                              <p className="text-xs text-purple-600 font-semibold">
                                ⚡ POWER
                              </p>
                              <p className="text-lg font-bold text-purple-700">
                                {powerLevel}
                              </p>
                            </div>
                          </div>

                          {/* Streak */}
                          <div className="flex gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">
                                Current Streak:
                              </span>{' '}
                              <span className="font-semibold text-orange-600">
                                🔥 {character.currentStreak} days
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600">
                                Best Streak:
                              </span>{' '}
                              <span className="font-semibold text-orange-600">
                                🏆 {character.longestStreak} days
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-3">
                          <p className="text-sm text-gray-500 italic">
                            No RPG character yet
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 ml-4">
                      {!hasCharacter ? (
                        <InitializeCharacterButton userId={client.id} />
                      ) : (
                        <>
                          <AwardXPButton
                            userId={client.id}
                            userName={
                              client.clientProfile?.fullName || client.email
                            }
                            amount={100}
                            label="+ 100 XP"
                          />
                          <AwardXPButton
                            userId={client.id}
                            userName={
                              client.clientProfile?.fullName || client.email
                            }
                            amount={500}
                            label="+ 500 XP"
                          />
                          <AwardXPButton
                            userId={client.id}
                            userName={
                              client.clientProfile?.fullName || client.email
                            }
                            amount={1000}
                            label="+ 1000 XP"
                            variant="legendary"
                          />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}

            {clients.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No clients found</p>
                <p className="text-sm text-gray-400 mt-2">
                  Register a test client to see RPG system in action
                </p>
              </div>
            )}
          </div>
        </div>

        {/* System Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h3 className="text-xl font-bold text-[#1A2332] mb-4">
            System Status
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 border border-green-200 rounded p-4">
              <h4 className="font-semibold text-green-800 mb-2">
                ✅ Database Schema
              </h4>
              <p className="text-sm text-green-700">
                6 RPG tables deployed to production
              </p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded p-4">
              <h4 className="font-semibold text-green-800 mb-2">
                ✅ Core Logic
              </h4>
              <p className="text-sm text-green-700">
                XP, Levels, Stats, Avatar systems ready
              </p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">
                🚧 Frontend UI
              </h4>
              <p className="text-sm text-yellow-700">
                Coming next (character dashboard, quests, etc.)
              </p>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h3 className="text-xl font-bold text-[#1A2332] mb-4">
            🚀 Next Steps (Days 2-3)
          </h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-[#E8DCC4]">▸</span>
              <span>
                Connect sessions to RPG system (auto-award XP on completion)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#E8DCC4]">▸</span>
              <span>Build streak tracking logic</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#E8DCC4]">▸</span>
              <span>
                Create character dashboard UI (for clients to see their stats)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#E8DCC4]">▸</span>
              <span>Design quest system</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

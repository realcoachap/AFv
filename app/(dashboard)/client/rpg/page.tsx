import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import CharacterCard from '@/app/components/rpg/CharacterCard'
import { initializeCharacter } from '@/app/lib/rpg/xp'
import NavBar from '@/app/components/NavBar'
import VersionFooter from '@/app/components/VersionFooter'

export default async function ClientRPGPage() {
  const session = await auth()

  if (!session || session.user.role !== 'CLIENT') {
    redirect('/login')
  }

  // Get or create RPG character
  let character = await prisma.rPGCharacter.findUnique({
    where: { userId: session.user.id },
  })

  // Auto-initialize if doesn't exist
  if (!character) {
    const result = await initializeCharacter(session.user.id)
    if (result.success && result.character) {
      character = result.character
    } else {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-md p-8 max-w-md">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
            <p className="text-gray-700">
              Failed to initialize RPG character. Please contact support.
            </p>
          </div>
        </div>
      )
    }
  }

  // Get user profile for display name
  const profile = await prisma.clientProfile.findUnique({
    where: { userId: session.user.id },
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <VersionFooter />
      
      {/* Navigation */}
      <NavBar role="client" backLink="/client/dashboard" backText="← Back to Dashboard" />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">
            🎮 YOUR CHARACTER
          </h1>
          <p className="text-gray-400 text-lg">
            Level up by completing sessions and crushing your goals!
          </p>
        </div>

        {/* Character Card */}
        <CharacterCard
          level={character.level}
          xp={character.xp}
          strength={character.strength}
          endurance={character.endurance}
          discipline={character.discipline}
          currentStreak={character.currentStreak}
          longestStreak={character.longestStreak}
          userName={profile?.fullName}
        />

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* How to Gain XP */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-[#1A2332] mb-4 flex items-center gap-2">
              ⚡ Earn XP
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">+100</span>
                <span>Complete a training session</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">+50</span>
                <span>Complete daily quests</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">+150</span>
                <span>Maintain a 7-day streak</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">+500</span>
                <span>Maintain a 30-day streak</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">+50</span>
                <span>Hit a new personal record</span>
              </li>
            </ul>
          </div>

          {/* Stats Explained */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-[#1A2332] mb-4 flex items-center gap-2">
              📊 Your Stats
            </h3>
            <ul className="space-y-3 text-sm text-gray-700">
              <li>
                <span className="font-bold text-red-600">💪 Strength</span>
                <p className="text-xs text-gray-600">
                  Grows with resistance training
                </p>
              </li>
              <li>
                <span className="font-bold text-blue-600">🏃 Endurance</span>
                <p className="text-xs text-gray-600">
                  Grows with cardio workouts
                </p>
              </li>
              <li>
                <span className="font-bold text-yellow-600">🎯 Discipline</span>
                <p className="text-xs text-gray-600">
                  Grows with consistency streaks
                </p>
              </li>
              <li>
                <span className="font-bold text-purple-600">⚡ Power</span>
                <p className="text-xs text-gray-600">
                  Your overall fitness level
                </p>
              </li>
            </ul>
          </div>

          {/* Avatar Evolution */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-[#1A2332] mb-4 flex items-center gap-2">
              🎨 Avatar Evolution
            </h3>
            <p className="text-sm text-gray-700 mb-3">
              Your avatar changes as you progress:
            </p>
            <ul className="space-y-2 text-xs text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-red-600">●</span>
                <span>
                  <strong>High Strength:</strong> Muscular build
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">●</span>
                <span>
                  <strong>High Endurance:</strong> Lean physique
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600">●</span>
                <span>
                  <strong>High Discipline:</strong> Glowing aura
                </span>
              </li>
            </ul>
            <p className="text-xs text-gray-500 mt-3 italic">
              Watch yourself transform as you train!
            </p>
          </div>
        </div>

        {/* Coming Soon */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-3">🚀 Coming Soon</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-bold mb-1">🎯 Daily Quests</p>
              <p className="text-xs opacity-90">
                Complete challenges for bonus XP
              </p>
            </div>
            <div>
              <p className="font-bold mb-1">🏆 Leaderboards</p>
              <p className="text-xs opacity-90">
                Compete with other clients
              </p>
            </div>
            <div>
              <p className="font-bold mb-1">🏅 Achievements</p>
              <p className="text-xs opacity-90">
                Unlock badges and rewards
              </p>
            </div>
          </div>
        </div>

        {/* Back to Dashboard */}
        <div className="text-center">
          <Link
            href="/client/dashboard"
            className="inline-block bg-[#E8DCC4] text-[#1A2332] px-8 py-3 rounded-lg font-bold hover:bg-[#D8CCA4] transition-colors shadow-lg"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </main>
    </div>
  )
}

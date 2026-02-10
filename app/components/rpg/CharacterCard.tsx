import Avatar from './Avatar'
import { getLevelProgress } from '@/app/lib/rpg/levels'
import { calculatePowerLevel } from '@/app/lib/rpg/stats'

type CharacterCardProps = {
  level: number
  xp: number
  strength: number
  endurance: number
  discipline: number
  currentStreak: number
  longestStreak: number
  userName?: string
  use3D?: boolean
}

export default function CharacterCard({
  level,
  xp,
  strength,
  endurance,
  discipline,
  currentStreak,
  longestStreak,
  userName,
  use3D = true,
}: CharacterCardProps) {
  const progress = getLevelProgress(xp)
  const powerLevel = calculatePowerLevel(strength, endurance, discipline)

  return (
    <div className="bg-gradient-to-br from-[#1A2332] to-[#2A3342] rounded-2xl shadow-2xl p-8 text-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Avatar & Name */}
        <div className="flex flex-col items-center justify-center">
          <div className="mb-4">
            <Avatar
              strength={strength}
              endurance={endurance}
              discipline={discipline}
              colorScheme="navy"
              size="xl"
              use3D={use3D}
              autoRotate={true}
            />
          </div>
          {userName && (
            <h2 className="text-2xl font-bold text-[#E8DCC4] mb-2">
              {userName}
            </h2>
          )}
          <div className="flex items-center gap-2 bg-[#E8DCC4] text-[#1A2332] px-6 py-2 rounded-full font-bold text-xl">
            <span>⚡</span>
            <span>LEVEL {level}</span>
          </div>
        </div>

        {/* Right: Stats & Progress */}
        <div className="flex flex-col justify-center space-y-6">
          {/* XP Progress */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-[#E8DCC4]">
                EXPERIENCE
              </span>
              <span className="text-sm text-gray-300">
                {progress.current}/{progress.required} XP
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
              <div
                className="h-4 bg-gradient-to-r from-[#00D9FF] to-[#E8DCC4] transition-all duration-500 ease-out relative"
                style={{ width: `${progress.percentage}%` }}
              >
                <div className="absolute inset-0 bg-white opacity-30 animate-pulse" />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-1 text-right">
              {progress.percentage}% to Level {level + 1}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Strength */}
            <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-lg p-4 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold opacity-90">
                  💪 STRENGTH
                </span>
                <span className="text-2xl font-bold">{strength}</span>
              </div>
              <div className="w-full bg-red-900 rounded-full h-2">
                <div
                  className="h-2 bg-white rounded-full transition-all duration-300"
                  style={{ width: `${strength}%` }}
                />
              </div>
            </div>

            {/* Endurance */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-4 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold opacity-90">
                  🏃 ENDURANCE
                </span>
                <span className="text-2xl font-bold">{endurance}</span>
              </div>
              <div className="w-full bg-blue-900 rounded-full h-2">
                <div
                  className="h-2 bg-white rounded-full transition-all duration-300"
                  style={{ width: `${endurance}%` }}
                />
              </div>
            </div>

            {/* Discipline */}
            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg p-4 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold opacity-90">
                  🎯 DISCIPLINE
                </span>
                <span className="text-2xl font-bold">{discipline}</span>
              </div>
              <div className="w-full bg-yellow-700 rounded-full h-2">
                <div
                  className="h-2 bg-white rounded-full transition-all duration-300"
                  style={{ width: `${discipline}%` }}
                />
              </div>
            </div>

            {/* Power Level */}
            <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg p-4 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold opacity-90">
                  ⚡ POWER
                </span>
                <span className="text-2xl font-bold">{powerLevel}</span>
              </div>
              <div className="w-full bg-purple-900 rounded-full h-2">
                <div
                  className="h-2 bg-white rounded-full transition-all duration-300"
                  style={{ width: `${powerLevel}%` }}
                />
              </div>
            </div>
          </div>

          {/* Streaks */}
          <div className="flex gap-4 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg p-4 shadow-lg">
            <div className="flex-1 text-center">
              <p className="text-sm opacity-90 mb-1">Current Streak</p>
              <p className="text-3xl font-bold">🔥 {currentStreak}</p>
              <p className="text-xs opacity-75">days</p>
            </div>
            <div className="w-px bg-white opacity-30" />
            <div className="flex-1 text-center">
              <p className="text-sm opacity-90 mb-1">Best Streak</p>
              <p className="text-3xl font-bold">🏆 {longestStreak}</p>
              <p className="text-xs opacity-75">days</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

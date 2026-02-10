'use client'

/**
 * Quest Log Component - Complete quest management interface
 */

import { useState, useEffect } from 'react'
import QuestCard from './QuestCard'
import { Sparkles, Target, Calendar, Trophy } from 'lucide-react'

type Quest = {
  id: string
  title: string
  description: string
  type: 'daily' | 'weekly' | 'monthly' | 'personal'
  progress: { current: number; target: number }
  reward: { xp: number; coins?: number; bonus?: string }
  isCompleted: boolean
  completedAt?: Date
}

type QuestLogProps = {
  userId: string
}

// Mock quest data - in production this comes from API
const mockQuests: Quest[] = [
  // Daily Quests
  {
    id: 'daily-1',
    title: 'Morning Warrior',
    description: 'Complete a training session before 10 AM',
    type: 'daily',
    progress: { current: 1, target: 1 },
    reward: { xp: 50, coins: 10 },
    isCompleted: true,
    completedAt: new Date(),
  },
  {
    id: 'daily-2',
    title: 'Hydration Station',
    description: 'Drink 8 glasses of water today',
    type: 'daily',
    progress: { current: 6, target: 8 },
    reward: { xp: 25, coins: 5 },
    isCompleted: false,
  },
  {
    id: 'daily-3',
    title: 'Protein Power',
    description: 'Hit your protein goal for the day',
    type: 'daily',
    progress: { current: 0, target: 1 },
    reward: { xp: 30, coins: 8 },
    isCompleted: false,
  },
  
  // Weekly Quests
  {
    id: 'weekly-1',
    title: 'Three-Peat',
    description: 'Complete 3 training sessions this week',
    type: 'weekly',
    progress: { current: 2, target: 3 },
    reward: { xp: 200, coins: 50, bonus: '2x XP Weekend' },
    isCompleted: false,
  },
  {
    id: 'weekly-2',
    title: 'Cardio King',
    description: 'Do 150 minutes of cardio this week',
    type: 'weekly',
    progress: { current: 90, target: 150 },
    reward: { xp: 150, coins: 40 },
    isCompleted: false,
  },
  {
    id: 'weekly-3',
    title: 'Perfect Week',
    description: 'Maintain your streak all week',
    type: 'weekly',
    progress: { current: 5, target: 7 },
    reward: { xp: 300, coins: 100, bonus: 'Legendary Aura' },
    isCompleted: false,
  },
  
  // Monthly Quests
  {
    id: 'monthly-1',
    title: 'Monthly Master',
    description: 'Complete 12 sessions this month',
    type: 'monthly',
    progress: { current: 8, target: 12 },
    reward: { xp: 1000, coins: 500, bonus: 'Exclusive Outfit' },
    isCompleted: false,
  },
  {
    id: 'monthly-2',
    title: 'Century Club',
    description: 'Log 100 total workouts',
    type: 'monthly',
    progress: { current: 87, target: 100 },
    reward: { xp: 800, coins: 300, bonus: 'Century Badge' },
    isCompleted: false,
  },
]

export default function QuestLog({ userId }: QuestLogProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'daily' | 'weekly' | 'monthly'>('all')
  const [quests, setQuests] = useState<Quest[]>(mockQuests)
  const [totalXP, setTotalXP] = useState(0)
  const [showCelebration, setShowCelebration] = useState(false)

  // Filter quests by tab
  const filteredQuests = activeTab === 'all' 
    ? quests 
    : quests.filter(q => q.type === activeTab)

  // Calculate stats
  const stats = {
    total: quests.length,
    completed: quests.filter(q => q.isCompleted).length,
    inProgress: quests.filter(q => !q.isCompleted && q.progress.current > 0).length,
    available: quests.filter(q =㸊  0).length,
  }

  const completionRate = Math.round((stats.completed / stats.total) * 100)

  // Handle quest completion
  const handleComplete = (questId: string) => {
    const quest = quests.find(q => q.id === questId)
    if (!quest) return

    setQuests(prev => prev.map(q => 
      q.id === questId 
        ? { ...q, isCompleted: true, completedAt: new Date() }
        : q
    ))

    setTotalXP(prev => prev + quest.reward.xp)
    setShowCelebration(true)
    
    setTimeout(() => setShowCelebration(false), 3000)
  }

  // Tab icons
  const tabs = [
    { id: 'all', label: 'All Quests', icon: Target, count: stats.total },
    { id: 'daily', label: 'Daily', icon: Sparkles, count: quests.filter(q => q.type === 'daily').length },
    { id: 'weekly', label: 'Weekly', icon: Calendar, count: quests.filter(q => q.type === 'weekly').length },
    { id: 'monthly', label: 'Monthly', icon: Trophy, count: quests.filter(q => q.type === 'monthly').length },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="text-center animate-bounce">
            <div className="text-8xl mb-4">🎉</div>
            <div className="text-4xl font-bold text-white mb-2">Quest Complete!</div>
            <div className="text-2xl text-yellow-400">+{totalXP} XP Earned</div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-sm">
            <Sparkles className="w-4 h-4" />
            QUEST LOG
          </div>
          
          <h1 className="text-5xl font-bold text-white">
            Your Missions
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Complete quests to earn XP, coins, and exclusive rewards. 
            Daily quests reset at midnight!
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard 
            label="Total Quests" 
            value={stats.total} 
            icon={Target}
            color="blue"
          />
          <StatCard 
            label="Completed" 
            value={stats.completed} 
            icon={Trophy}
            color="green"
            highlight={stats.completed > 0}
          />
          <StatCard 
            label="In Progress" 
            value={stats.inProgress} 
            icon={Sparkles}
            color="purple"
          />
          <StatCard 
            label="Completion Rate" 
            value={`${completionRate}%`} 
            icon={Calendar}
            color="amber"
          />
        </div>

        {/* Progress Bar */}
        <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-400">Weekly Progress</span>
            <span className="text-white font-bold">{stats.completed} / {stats.total} Quests</span>
          </div>
          <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            >
              <div className="h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
            </div>
          </div>          
          {completionRate === 100 && (
            <div className="mt-4 text-center text-green-400 font-bold animate-pulse">
              🎉 All quests completed! Amazing work!
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all
                  ${isActive 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30' 
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
                <span 
                  className={`
                    px-2 py-0.5 rounded-full text-xs
                    ${isActive ? 'bg-white/20' : 'bg-gray-700'}
                  `}
                >
                  {tab.count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Quests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredQuests.map((quest) => (
            <QuestCard
              key={quest.id}
              {...quest}
              onComplete={() => handleComplete(quest.id)}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredQuests.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-bold text-white mb-2">No quests available</h3>
            <p className="text-gray-400">Check back later for new missions!</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Stat Card Component
function StatCard({ 
  label, 
  value, 
  icon: Icon, 
  color,
  highlight = false,
}: { 
  label: string
  value: string | number
  icon: React.ElementType
  color: 'blue' | 'green' | 'purple' | 'amber'
  highlight?: boolean
}) {
  const colors = {
    blue: 'from-blue-600/20 to-blue-800/20 border-blue-500/30',
    green: 'from-green-600/20 to-green-800/20 border-green-500/30',
    purple: 'from-purple-600/20 to-purple-800/20 border-purple-500/30',
    amber: 'from-amber-600/20 to-amber-800/20 border-amber-500/30',
  }

  return (
    <div 
      className={`
        p-4 rounded-xl border bg-gradient-to-br ${colors[color]}
        ${highlight ? 'shadow-lg shadow-green-500/20' : ''}
      `}
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-white/10">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="text-2xl font-bold text-white">{value}</div>
          <div className="text-sm text-gray-400">{label}</div>
        </div>
      </div>
    </div>
  )
}

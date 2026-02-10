import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import ShareCard from '@/app/components/rpg/ShareCard'
import NavBar from '@/app/components/NavBar'

export default async function ShareCardDemoPage() {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  // Demo scenarios
  const demos = [
    {
      name: 'Newbie Gains',
      userName: 'Alex Chen',
      level: 3,
      strength: 12,
      endurance: 15,
      discipline: 8,
      streak: 5,
      longestStreak: 5,
      colorScheme: 'navy',
      achievement: undefined,
    },
    {
      name: '7-Day Warrior',
      userName: 'Sarah Martinez',
      level: 8,
      strength: 35,
      endurance: 42,
      discipline: 38,
      streak: 7,
      longestStreak: 7,
      colorScheme: 'emerald',
      achievement: '7-Day Streak!',
    },
    {
      name: 'Beast Mode',
      userName: 'Marcus Johnson',
      level: 15,
      strength: 68,
      endurance: 55,
      discipline: 62,
      streak: 21,
      longestStreak: 21,
      colorScheme: 'crimson',
      achievement: '21-Day Streak Master',
    },
    {
      name: 'Legend Status',
      userName: 'Emma Williams',
      level: 25,
      strength: 82,
      endurance: 78,
      discipline: 88,
      streak: 45,
      longestStreak: 45,
      colorScheme: 'gold',
      achievement: '45 Days Unstoppable!',
    },
    {
      name: 'Mythic Tier',
      userName: 'David Kim',
      level: 32,
      strength: 95,
      endurance: 88,
      discipline: 92,
      streak: 60,
      longestStreak: 60,
      colorScheme: 'void',
      achievement: '60 Day LEGEND',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-950">
      <NavBar 
        role={session.user.role} 
        backLink={session.user.role === 'ADMIN' ? '/admin/dashboard' : '/client/dashboard'}
        backText="← Back to Dashboard"
      />

      <main className="max-w-7xl mx-auto p-6 space-y-16 pb-20">
        {/* Hero */}
        <div className="text-center space-y-6 pt-8">
          <div className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-sm mb-4">
            ⚔️ ARMINIUS EDITION
          </div>
          
          <h1 className="text-6xl font-bold text-white">
            📱 Share Cards
          </h1>
          <p className="text-2xl text-gray-400 max-w-2xl mx-auto">
            Instagram-worthy progress cards that your clients will <span className="text-pink-400 font-bold">WANT</span> to post.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <span className="px-4 py-2 bg-gray-800 rounded-full text-gray-300">✨ Three formats</span>
            <span className="px-4 py-2 bg-gray-800 rounded-full text-gray-300">🎨 Five themes</span>
            <span className="px-4 py-2 bg-gray-800 rounded-full text-gray-300">💾 One-click save</span>
            <span className="px-4 py-2 bg-gray-800 rounded-full text-gray-300">🐦 Tweet button</span>
          </div>
        </div>

        {/* Portrait Cards */}
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
            <h2 className="text-3xl font-bold text-white text-center">
              Portrait Format (Stories)
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
          </div>
          
          <p className="text-center text-gray-500">
            Perfect for Instagram Stories, TikTok, Snapchat
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            {demos.map((demo) => (
              <div key={demo.name} className="space-y-4">
                <ShareCard {...demo} variant="portrait" />
                <p className="text-center text-gray-500 text-sm font-medium">{demo.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Square Cards */}
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
            <h2 className="text-3xl font-bold text-white text-center">
              Square Format (Feed Posts)
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
          </div>
          
          <p className="text-center text-gray-500">
            Perfect for Instagram Feed, Facebook, LinkedIn
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {demos.slice(0, 3).map((demo) => (
              <div key={`square-${demo.name}`} className="space-y-4">
                <ShareCard {...demo} variant="square" />
                <p className="text-center text-gray-500 text-sm font-medium">{demo.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Landscape Cards */}
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-pink-500 to-transparent" />
            <h2 className="text-3xl font-bold text-white text-center">
              Landscape Format (Twitter/Discord)
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-pink-500 to-transparent" />
          </div>
          
          <p className="text-center text-gray-500">
            Perfect for Twitter/X, Discord, Desktop wallpapers
          </p>

          <div className="space-y-8 max-w-4xl mx-auto">
            {demos.slice(2, 4).map((demo) => (
              <div key={`landscape-${demo.name}`} className="space-y-4">
                <ShareCard {...demo} variant="landscape" />
                <p className="text-center text-gray-500 text-sm font-medium">{demo.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Feature Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            icon="📸"
            title="Auto-Generated Images"
            description="Click 'Save Image' to generate a PNG perfect for any social platform."
          />
          <FeatureCard
            icon="🎨"
            title="5 Color Themes"
            description="Navy, Crimson, Emerald, Gold, and Void - match your vibe."
          />
          <FeatureCard
            icon="🏆"
            title="Achievement Banners"
            description="Hit a streak milestone? Shows off your achievement front and center."
          />
          <FeatureCard
            icon="🔥"
            title="PB Detection"
            description="Personal Best streak? Gets a special celebration banner."
          />
        </section>

        {/* Call to Action */}
        <section className="text-center space-y-6 bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-3xl p-12">
          <h2 className="text-4xl font-bold text-white">
            Ready to go viral? 🚀
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Every share is free marketing. When clients post their progress, 
            their friends see your brand. It's the ultimate referral engine.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="px-6 py-3 bg-white/10 rounded-xl">
              <p className="text-3xl font-bold text-white">3</p>
              <p className="text-sm text-gray-400">Card Formats</p>
            </div>
            <div className="px-6 py-3 bg-white/10 rounded-xl">
              <p className="text-3xl font-bold text-white">5</p>
              <p className="text-sm text-gray-400">Color Themes</p>
            </div>
            <div className="px-6 py-3 bg-white/10 rounded-xl">
              <p className="text-3xl font-bold text-white">1</p>
              <p className="text-sm text-gray-400">Click to Share</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="bg-gray-900 rounded-xl p-6 space-y-4 border border-gray-800 hover:border-purple-500/50 transition-colors">
      <div className="text-4xl">{icon}</div>
      <h3 className="text-xl font-bold text-white">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  )
}

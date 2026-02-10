import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Avatar from '@/app/components/rpg/Avatar'
import ShareCard from '@/app/components/rpg/ShareCard'
import NavBar from '@/app/components/NavBar'

export default async function AvatarDemoPage() {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  // Demo characters with different stat combinations
  const demoCharacters = [
    {
      name: 'New Client (Level 1)',
      level: 1,
      strength: 5,
      endurance: 5,
      discipline: 0,
      streak: 0,
      colorScheme: 'navy',
      description: 'Just starting out - lean build, no aura yet',
    },
    {
      name: 'Regular (Level 5)',
      level: 5,
      strength: 25,
      endurance: 30,
      discipline: 20,
      streak: 7,
      colorScheme: 'emerald',
      description: 'Building consistency - athletic build, faint aura',
    },
    {
      name: 'Dedicated (Level 10)',
      level: 10,
      strength: 45,
      endurance: 50,
      discipline: 45,
      streak: 14,
      colorScheme: 'crimson',
      description: 'Getting strong - defined muscles, uncommon frame',
    },
    {
      name: 'Beast Mode (Level 20)',
      level: 20,
      strength: 75,
      endurance: 60,
      discipline: 70,
      streak: 30,
      colorScheme: 'gold',
      description: 'Elite athlete - muscular build, rare frame, bright aura',
    },
    {
      name: 'Legend (Level 30)',
      level: 30,
      strength: 95,
      endurance: 85,
      discipline: 90,
      streak: 60,
      colorScheme: 'void',
      description: 'Maximum level - beast mode, legendary frame, radiant aura',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-900">
      <NavBar 
        role={session.user.role} 
        backLink={session.user.role === 'ADMIN' ? '/admin/dashboard' : '/client/dashboard'}
        backText="← Back to Dashboard"
      />

      <main className="max-w-7xl mx-auto p-6 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-white">
            ✨ Premium Avatar System
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Beautiful, shareable character portraits that evolve with your clients' progress. 
            Watch them transform from lean beginners to legendary beasts.
          </p>
        </div>

        {/* Avatar Showcase */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-white text-center">
            Character Evolution
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            {demoCharacters.map((char) => (
              <div key={char.name} className="space-y-4">
                <div className="flex justify-center">
                  <Avatar
                    level={char.level}
                    strength={char.strength}
                    endurance={char.endurance}
                    discipline={char.discipline}
                    colorScheme={char.colorScheme}
                    size="lg"
                  />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-white font-bold">{char.name}</h3>
                  <p className="text-sm text-gray-400">{char.description}</p>
                  <div className="flex justify-center gap-2 text-xs">
                    <span className="px-2 py-1 bg-red-900/50 text-red-300 rounded">
                      💪 {char.strength}
                    </span>
                    <span className="px-2 py-1 bg-blue-900/50 text-blue-300 rounded">
                      🏃 {char.endurance}
                    </span>
                    <span className="px-2 py-1 bg-yellow-900/50 text-yellow-300 rounded">
                      🎯 {char.discipline}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Share Card Demo */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-white text-center">
            Share Cards
          </h2>
          <p className="text-center text-gray-400">
            Clients can screenshot and share their progress on social media
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <ShareCard
              userName="Alex Johnson"
              level={12}
              strength={55}
              endurance={48}
              discipline={52}
              currentStreak={21}
              colorScheme="navy"
              achievement="30-Day Streak Master"
            />

            <ShareCard
              userName="Maria Garcia"
              level={18}
              strength={70}
              endurance={75}
              discipline={65}
              currentStreak={45}
              colorScheme="crimson"
            />
          </div>
        </section>

        {/* Size Variations */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-white text-center">
            Size Variations
          </h2>
          
          <div className="flex flex-wrap items-end justify-center gap-8">
            {(['sm', 'md', 'lg', 'xl'] as const).map((size) => (
              <div key={size} className="text-center space-y-2">
                <Avatar
                  level={15}
                  strength={60}
                  endurance={55}
                  discipline={50}
                  size={size}
                  colorScheme="gold"
                />
                <p className="text-gray-400 text-sm font-mono">
                  Size: {size}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Color Schemes */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-white text-center">
            Color Themes
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {['navy', 'crimson', 'emerald', 'gold', 'void'].map((scheme) => (
              <div key={scheme} className="text-center space-y-2">
                <Avatar
                  level={20}
                  strength={70}
                  endurance={65}
                  discipline={75}
                  size="md"
                  colorScheme={scheme}
                />
                <p className="text-gray-400 text-sm capitalize">{scheme}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Feature Highlights */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            icon="🎨"
            title="Dynamic Physique"
            description="Muscles grow visibly with strength stat. Watch arms get bigger and chest expand!"
          />
          <FeatureCard
            icon="✨"
            title="Aura Effects"
            description="Discipline unlocks glowing auras. Higher discipline = more intense glow."
          />
          <FeatureCard
            icon="🖼️"
            title="Frame Upgrades"
            description="Level up unlocks fancier frames. Common → Uncommon → Rare → Epic → Legendary"
          />
          <FeatureCard
            icon="📱"
            title="Shareable Cards"
            description="One-click sharing for Instagram, TikTok, or any social platform."
          />
        </section>

        {/* Technical Notes */}
        <section className="bg-gray-800 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-4">What Changed?</h2>
          <div className="space-y-3 text-gray-300">
            <p>
              ✅ <strong className="text-white">Premium 2D Avatars:</strong>{' '}
              Replaced basic blocky SVGs with stylized, anatomically-proportioned characters
            </p>
            <p>
              ✅ <strong className="text-white">Visual Progression:</strong>{' '}
              Muscle width scales with strength (1.0x to 1.35x). Leanness adjusts with endurance.
            </p>
            <p>
              ✅ <strong className="text-white">Frame Tiers:</strong>{' '}
              6 border styles that unlock based on level (Common at L1 → Divine at L30+)
            </p>
            <p>
              ✅ <strong className="text-white">Aura System:</strong>{' '}
              Discipline stat creates glowing effects. 40+ discipline = visible aura.
            </p>
            <p>
              ✅ <strong className="text-white">5 Color Schemes:</strong>{' '}
              Navy, Crimson, Emerald, Gold, and Void themes
            </p>
            <p>
              ✅ <strong className="text-white">Share Cards:</strong>{' '}
              Instagram-ready cards with stats, achievements, and branding
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="bg-gray-800 rounded-xl p-6 space-y-3">
      <div className="text-4xl">{icon}</div>
      <h3 className="text-xl font-bold text-white">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  )
}

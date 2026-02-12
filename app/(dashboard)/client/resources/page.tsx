import Link from 'next/link'
import NavBar from '@/app/components/NavBar'

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar role="client" />
      
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Resources</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Calculator */}
          <Link href="/client/calculator" className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">🧮 Calorie Calculator</h2>
            <p className="text-gray-600">Calculate your daily calorie and macro targets</p>
          </Link>

          {/* Schedule */}
          <Link href="/client/schedule" className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">📅 My Schedule</h2>
            <p className="text-gray-600">View upcoming sessions and book appointments</p>
          </Link>

          {/* Profile */}
          <Link href="/client/profile" className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">👤 My Profile</h2>
            <p className="text-gray-600">View and update your profile information</p>
          </Link>

          {/* RPG */}
          <Link href="/client/rpg" className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">🎮 RPG Fitness</h2>
            <p className="text-gray-600">Level up your fitness with quests and avatars</p>
          </Link>

        </div>

        <div className="mt-8 text-center text-sm text-gray-400">
          v0.5.1
        </div>
      </main>
    </div>
  )
}

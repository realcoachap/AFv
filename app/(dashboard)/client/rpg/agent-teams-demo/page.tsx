'use client'

/**
 * Agent Teams Demo
 * Showcase the LEGION parallel agent system
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AGENT_DEFINITIONS, DEFAULT_AGENT_TEAMS } from '../../../lib/agents'

export default function AgentTeamsDemoPage() {
  const router = useRouter()
  const [selectedTeam, setSelectedTeam] = useState('feature')
  const [mission, setMission] = useState('Build a quest reward system with 3D trophy')
  const [isDeploying, setIsDeploying] = useState(false)
  const [results, setResults] = useState<any>(null)

  const teams = {
    feature: {
      name: '⚡ Quick Feature',
      description: 'Standard CRUD feature with UI + API + Tests',
      agents: DEFAULT_AGENT_TEAMS.feature,
      time: '~5 minutes'
    },
    threeD: {
      name: '🎨 3D Feature', 
      description: '3D graphics feature with avatar components',
      agents: DEFAULT_AGENT_TEAMS.threeD,
      time: '~7 minutes'
    },
    api: {
      name: '🔧 API Only',
      description: 'Backend API endpoints only',
      agents: DEFAULT_AGENT_TEAMS.api,
      time: '~3 minutes'
    },
    ui: {
      name: '🎭 UI Only',
      description: 'Frontend components only',
      agents: DEFAULT_AGENT_TEAMS.ui,
      time: '~3 minutes'
    },
    production: {
      name: '🚀 Full Production',
      description: 'Complete feature + deployment',
      agents: DEFAULT_AGENT_TEAMS.production,
      time: '~10 minutes'
    }
  }

  const handleDeploy = async () => {
    setIsDeploying(true)
    
    // In real implementation, this would call the AgentTeam system
    // For demo, simulate the process
    await new Promise(r => setTimeout(r, 3000))
    
    setResults({
      mission,
      team: selectedTeam,
      agents: teams[selectedTeam as keyof typeof teams].agents,
      status: 'deployed',
      message: 'This is a demo. In production, this would spawn real agents!'
    })
    
    setIsDeploying(false)
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">⚔️ LEGION Agent Teams</h1>
            <p className="text-gray-400 text-sm">Parallel multi-agent development system</p>
          </div>
          
          <button
            onClick={() => router.back()}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            ← Back
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left: Mission Control */}
          <div className="space-y-6">
            
            {/* Mission Input */}
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-4">🎯 Mission Briefing</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-gray-400 text-sm">Mission Description</label>
                  <textarea
                    value={mission}
                    onChange={(e) => setMission(e.target.value)}
                    className="w-full mt-2 p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                    rows={3}
                    placeholder="Describe what you want to build..."
                  />
                </div>
              </div>
            </div>

            {/* Team Selection */}
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-4">🛡️ Select Strike Team</h2>
              
              <div className="space-y-3">
                {Object.entries(teams).map(([key, team]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedTeam(key)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      selectedTeam === key
                        ? 'bg-purple-600 border-2 border-purple-400'
                        : 'bg-gray-700 border-2 border-transparent hover:bg-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-white">{team.name}</p>
                        <p className="text-sm text-gray-300 mt-1">{team.description}</p>
                      </div>
                      <span className="text-xs text-purple-400">{team.time}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Deploy Button */}
            <button
              onClick={handleDeploy}
              disabled={isDeploying}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isDeploying ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Deploying Legion...
                </>
              ) : (
                <>⚔️ Deploy Strike Team</>
              )}
            </button>
          </div>

          {/* Right: Agent Roster */}
          <div className="space-y-6">
            
            {/* Selected Team */}
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-4">👥 Strike Team Roster</h2>
              
              <div className="space-y-3">
                {teams[selectedTeam as keyof typeof teams].agents.map((agentType) => {
                  const agent = AGENT_DEFINITIONS[agentType]
                  return (
                    <div key={agentType} className="flex items-start gap-4 bg-gray-700/50 p-4 rounded-lg">
                      <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center text-2xl">
                        {agentType === 'architect' && '🏛️'}
                        {agentType === 'frontliner' && '⚔️'}
                        {agentType === 'apismith' && '🔨'}
                        {agentType === 'artisan' && '🎨'}
                        {agentType === 'scout' && '🔍'}
                        {agentType === 'quartermaster' && '🏗️'}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-bold">{agent.name}</p>
                        <p className="text-purple-400 text-sm">{agent.codename}</p>
                        <p className="text-gray-400 text-sm mt-1">{agent.specialty}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Results */}
            {results && (
              <div className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 rounded-2xl p-6 border border-green-700/50">
                <h2 className="text-xl font-bold text-white mb-4">✅ Mission Status</h2>
                
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-400">Mission:</span> <span className="text-white">{results.mission}</span></p>
                  <p><span className="text-gray-400">Team:</span> <span className="text-white">{results.team}</span></p>
                  <p><span className="text-gray-400">Agents Deployed:</span> <span className="text-white">{results.agents.length}</span></p>
                  <p className="text-green-400 mt-4">{results.message}</p>
                </div>
              </div>
            )}

            {/* All Agents Reference */}
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-4">📚 Full Legion Roster</h2>
              
              <div className="grid grid-cols-2 gap-3">
                {Object.values(AGENT_DEFINITIONS).map((agent) => (
                  <div key={agent.type} className="bg-gray-700/50 p-3 rounded-lg text-center">
                    <p className="text-white font-medium text-sm">{agent.name}</p>
                    <p className="text-gray-400 text-xs">{agent.type}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Code Example */}
        <div className="mt-8 bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4">💻 Usage Example</h2>
          
          <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
<code className="text-gray-300">{`import { legion } from '@/lib/agents'

// Deploy a strike team
const result = await legion.deploy(
  'Build quest reward system with 3D trophy',
  ['architect', 'frontliner', 'artisan', 'scout']
)

// Quick feature preset
const result = await legion.feature('User profile page')

// 3D feature preset  
const result = await legion.threeD('Avatar customization')

// Full production deploy
const result = await legion.production('Complete RPG system')`}</code>
          </pre>
        </div>
      </div>
    </div>
  )
}

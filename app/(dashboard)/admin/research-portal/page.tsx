// v0.6.4 - Admin Research Portal
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function ResearchPortalPage() {
  const session = await auth()
  
  // Protect admin-only access
  if (!session || session.user?.role !== 'ADMIN') {
    redirect('/')
  }

  const factions = [
    {
      icon: '🎨',
      title: 'Avatar Division',
      subtitle: '5 Agents',
      docs: [
        {
          title: '50+ Character Creator Solutions',
          desc: 'Comprehensive comparison of MakeHuman alternatives, avatar systems, and evolution approaches.',
          path: '/research/LEGION_CHARACTER_RESEARCH_COMPLETE.md',
          meta: '50+ solutions analyzed',
          status: 'complete'
        },
        {
          title: 'Procedural Texture Generation',
          desc: 'Skin pores, fabric weaves, animated sweat using noise functions and Canvas API.',
          path: '/research/procedural-texture-research.md',
          meta: 'simplex-noise, webgl-noise',
          status: 'complete'
        },
        {
          title: 'Cinematic Lighting & Post-Processing',
          desc: '3-point lighting, HDRIs, bloom, SSAO, color grading, and complete FitnessAppRenderer class.',
          path: '/research/lighting-postprocessing-research.md',
          meta: 'Production-ready code',
          status: 'complete'
        },
        {
          title: 'Animation Systems',
          desc: 'Breathing, flexing, victory poses, smooth transitions, and fitness-specific movements.',
          path: '/research/fitness_avatar_animation_research.md',
          meta: '10k+ animation resources',
          status: 'complete'
        }
      ]
    },
    {
      icon: '🧪',
      title: 'Nutrition Division',
      subtitle: '4 Agents',
      docs: [
        {
          title: '🧪 The Alchemist: Nutrition Guidance',
          desc: 'Macro calculators, meal timing, hydration protocols, and budget meal generator with USDA API integration.',
          path: '/research/nutrition-guidance-systems.md',
          meta: 'TypeScript implementation included',
          status: 'complete'
        },
        {
          title: '💊 The Apothecary: Supplement Stacks',
          desc: 'Evidence-based stacks: Creatine, protein, caffeine, ashwagandha. Cost: $35-50/month foundation.',
          path: '/research/supplement_research_guide.md',
          meta: 'NSF/Informed Sport certified',
          status: 'complete'
        },
        {
          title: '🧬 The Gene-Weaver: PEDs & SARMs',
          desc: 'SAFETY FOCUS: YK-11 neurotoxicity, BPC-157 risks, harm reduction protocols, blood work monitoring.',
          path: '/research/research_performance_enhancement_compounds.md',
          meta: 'Educational/Harm reduction',
          status: 'complete',
          warning: true
        },
        {
          title: '🌿 The Purifier: Fasting Protocols',
          desc: 'Juice fasting myths debunked. Autophagy science. Refeeding syndrome risks. Intermittent fasting recommended.',
          path: '/research/fasting_research_report.md',
          meta: 'NIH/Harvard/Mayo verified',
          status: 'complete'
        }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center py-8 border-b-2 border-[#e8dcc4] mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#e8dcc4] mb-2">
            ⚔️ LEGION Research Portal
          </h1>
          <p className="text-slate-400">Admin-Only Access</p>
          <span className="inline-block mt-3 px-4 py-1 bg-[#e8dcc4] text-slate-900 rounded-full text-sm font-bold">
            v0.6.4
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-800/50 rounded-xl p-4 text-center border border-slate-700">
            <div className="text-2xl font-bold text-[#e8dcc4]">9</div>
            <div className="text-sm text-slate-400">Research Docs</div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 text-center border border-slate-700">
            <div className="text-2xl font-bold text-[#e8dcc4]">200+</div>
            <div className="text-sm text-slate-400">Pages</div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 text-center border border-slate-700">
            <div className="text-2xl font-bold text-[#e8dcc4]">9</div>
            <div className="text-sm text-slate-400">LEGION Agents</div>
          </div>
        </div>

        {/* Factions */}
        {factions.map((faction) => (
          <div key={faction.title} className="mb-8">
            <div className="flex items-center gap-3 mb-4 p-4 bg-slate-800/30 rounded-xl border-l-4 border-[#e8dcc4]">
              <span className="text-2xl">{faction.icon}</span>
              <span className="text-xl font-bold text-[#e8dcc4]">{faction.title}</span>
              <span className="ml-auto text-sm text-slate-500">{faction.subtitle}</span>
            </div>

            <div className="space-y-3">
              {faction.docs.map((doc) => (
                <a
                  key={doc.path}
                  href={doc.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block p-5 rounded-xl border transition-all duration-200 hover:translate-x-2 ${
                    doc.warning
                      ? 'bg-red-950/20 border-red-800/50 hover:border-red-600'
                      : 'bg-slate-800/50 border-slate-700 hover:border-[#e8dcc4]'
                  }`}
                >
                  <div className={`text-lg font-bold mb-2 ${doc.warning ? 'text-red-300' : 'text-[#e8dcc4]'}`}>
                    {doc.title}
                    {doc.warning && (
                      <span className="ml-2 text-xs bg-red-900/50 text-red-300 px-2 py-1 rounded">
                        ⚠️ ADMIN ONLY
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed mb-3">
                    {doc.desc}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <span className="text-green-400">✓</span> {doc.status}
                    </span>
                    <span>{doc.meta}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        ))}

        {/* Warning Box */}
        <div className="mt-8 p-6 bg-amber-950/20 border border-amber-800/50 rounded-xl">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h3 className="font-bold text-amber-400 mb-2">Confidential Research</h3>
              <p className="text-sm text-amber-200/70 leading-relaxed">
                Some documents contain information about performance-enhancing compounds, 
                SARMs, and peptides for educational/harm-reduction purposes. This content 
                is restricted to admin access only and should not be shared publicly.
              </p>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-[#e8dcc4] transition-colors"
          >
            ← Back to Admin Dashboard
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
          <p>Built by Arminius ⚔️</p>
          <p className="mt-2">LEGION Deployment System • 9 Agents • Parallel Research</p>
        </div>
      </div>
    </div>
  )
}
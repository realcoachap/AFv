'use client'

import Link from 'next/link'

const researchDocs = [
  { 
    id: 'ai-tools-comprehensive', 
    title: 'AI Tools Comprehensive Research', 
    category: '🎨 Avatar Division',
    summary: '25+ AI tools for web development, graphic design, video, and audio. Includes pricing, use cases, and integration guides.'
  },
  { 
    id: 'ai-coding-assistants', 
    title: 'AI Coding Assistants 2026', 
    category: '🎨 Avatar Division',
    summary: 'Comparison of Cursor, Claude Code, GitHub Copilot, and more. Best practices for Next.js/React development.'
  },
  { 
    id: 'ai-tools-fitness', 
    title: 'AI Tools for Fitness Apps', 
    category: '💪 Fitness Division',
    summary: 'Nutrition APIs, workout generation AI, WhatsApp bots, gamification systems. Full integration stack for AFv.'
  },
  { 
    id: 'tinyfish-seedance', 
    title: 'Tinyfish.AI & Seedance 2', 
    category: '🎨 Avatar Division',
    summary: 'Tinyfish: Enterprise web automation ($47M funded). Seedance 2: ByteDance AI video generator with native audio.'
  },
  { 
    id: 'lighting-postprocessing', 
    title: 'Cinematic Lighting & Post-Processing', 
    category: '🎨 Avatar Division',
    summary: 'Three.js lighting rigs, HDRIs, bloom, SSAO effects. Complete FitnessAppRenderer implementation guide.'
  },
  { 
    id: 'nutrition-guidance', 
    title: 'Nutrition Guidance Systems', 
    category: '🧪 Nutrition Division',
    summary: 'Macro calculators, meal timing, USDA API integration. Full TypeScript implementation with $35-50/mo supplement stacks.'
  },
]

export default function ResearchPortalPage() {
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
            v0.8.6
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-800/50 rounded-xl p-4 text-center border border-slate-700">
            <div className="text-2xl font-bold text-[#e8dcc4]">{researchDocs.length}</div>
            <div className="text-sm text-slate-400">Research Docs</div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 text-center border border-slate-700">
            <div className="text-2xl font-bold text-[#e8dcc4]">25+</div>
            <div className="text-sm text-slate-400">AI Tools</div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 text-center border border-slate-700">
            <div className="text-2xl font-bold text-[#e8dcc4]">11</div>
            <div className="text-sm text-slate-400">LEGION Agents</div>
          </div>
        </div>

        {/* Document List */}
        <div className="space-y-4">
          {researchDocs.map((doc) => (
            <div
              key={doc.id}
              className="p-5 bg-slate-800/50 rounded-xl border border-slate-700"
            >
              <div className="text-xs text-slate-500 mb-1">{doc.category}</div>
              <h3 className="text-lg font-bold text-[#e8dcc4] mb-2">{doc.title}</h3>
              <p className="text-slate-400 text-sm mb-3">{doc.summary}</p>
              <a
                href={`/research/${doc.id === 'ai-tools-fitness' ? 'AI_TOOLS_FITNESS_APP' : doc.id === 'tinyfish-seedance' ? 'tinyfish_seedance_research' : doc.id + '-research'}.md`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm"
              >
                📄 View Full Research →
              </a>
            </div>
          ))}
        </div>

        {/* Note */}
        <div className="mt-8 p-4 bg-amber-950/20 border border-amber-800/50 rounded-xl">
          <p className="text-sm text-amber-200/70">
            💡 All research documents are available as markdown files. Click "View Full Research" to open the raw document.
            For better viewing, download and open in a markdown viewer or VS Code.
          </p>
        </div>
      </div>
    </div>
  )
}
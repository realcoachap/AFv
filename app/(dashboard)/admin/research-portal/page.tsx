'use server'

import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { readFileSync } from 'fs'
import { join } from 'path'
import Link from 'next/link'

// List all available research documents
const researchDocs = [
  // Avatar Division
  { id: 'ai-tools-comprehensive', title: 'AI Tools Comprehensive Research', category: '🎨 Avatar Division', path: 'ai-tools-comprehensive-research.md' },
  { id: 'ai-coding-assistants', title: 'AI Coding Assistants 2026', category: '🎨 Avatar Division', path: 'ai-coding-assistants-2026.md' },
  { id: 'ai-tools-fitness', title: 'AI Tools for Fitness Apps', category: '🎨 Avatar Division', path: 'AI_TOOLS_FITNESS_APP.md' },
  { id: 'tinyfish-seedance', title: 'Tinyfish.AI & Seedance 2', category: '🎨 Avatar Division', path: 'tinyfish_seedance_research.md' },
  { id: 'lighting-postprocessing', title: 'Cinematic Lighting & Post-Processing', category: '🎨 Avatar Division', path: 'lighting-postprocessing-research.md' },
  
  // Nutrition Division
  { id: 'nutrition-guidance', title: '🧪 The Alchemist: Nutrition Guidance', category: '🧪 Nutrition Division', path: 'nutrition-guidance-systems.md' },
]

export default async function ResearchPortalPage() {
  const session = await auth()
  
  if (!session || session.user?.role !== 'ADMIN') {
    redirect('/')
  }

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
            v0.8.5
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-800/50 rounded-xl p-4 text-center border border-slate-700">
            <div className="text-2xl font-bold text-[#e8dcc4]">{researchDocs.length}</div>
            <div className="text-sm text-slate-400">Research Docs</div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 text-center border border-slate-700">
            <div className="text-2xl font-bold text-[#e8dcc4]">15+</div>
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
            <Link
              key={doc.id}
              href={`/admin/research-portal/view?id=${doc.id}`}
              className="block p-5 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-[#e8dcc4] transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs text-slate-500 mb-1">{doc.category}</div>
                  <h3 className="text-lg font-bold text-[#e8dcc4]">{doc.title}</h3>
                </div>
                <span className="text-slate-500">→</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Note */}
        <div className="mt-8 p-4 bg-amber-950/20 border border-amber-800/50 rounded-xl">
          <p className="text-sm text-amber-200/70">
            💡 Click any document to view the full research. All documents are markdown format 
            and include detailed implementation guides, pricing, and integration instructions.
          </p>
        </div>
      </div>
    </div>
  )
}
'use server'

import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { readFileSync } from 'fs'
import { join } from 'path'
import Link from 'next/link'

// Map of document IDs to files
const docMap: Record<string, { title: string; file: string }> = {
  'ai-tools-comprehensive': { title: 'AI Tools Comprehensive Research', file: 'ai-tools-comprehensive-research.md' },
  'ai-coding-assistants': { title: 'AI Coding Assistants 2026', file: 'ai-coding-assistants-2026.md' },
  'ai-tools-fitness': { title: 'AI Tools for Fitness Apps', file: 'AI_TOOLS_FITNESS_APP.md' },
  'tinyfish-seedance': { title: 'Tinyfish.AI & Seedance 2', file: 'tinyfish_seedance_research.md' },
  'lighting-postprocessing': { title: 'Cinematic Lighting & Post-Processing', file: 'lighting-postprocessing-research.md' },
  'nutrition-guidance': { title: 'Nutrition Guidance Systems', file: 'nutrition-guidance-systems.md' },
}

function parseMarkdown(content: string) {
  // Simple markdown parsing for display
  const lines = content.split('\n')
  const elements: JSX.Element[] = []
  let key = 0
  
  for (const line of lines) {
    const trimmed = line.trim()
    
    // Headers
    if (trimmed.startsWith('# ')) {
      elements.push(
        <h1 key={key++} className="text-3xl font-bold text-[#e8dcc4] mt-8 mb-4">{trimmed.slice(2)}</h1>
      )
    } else if (trimmed.startsWith('## ')) {
      elements.push(
        <h2 key={key++} className="text-2xl font-bold text-[#e8dcc4] mt-6 mb-3">{trimmed.slice(3)}</h2>
      )
    } else if (trimmed.startsWith('### ')) {
      elements.push(
        <h3 key={key++} className="text-xl font-bold text-[#e8dcc4] mt-4 mb-2">{trimmed.slice(4)}</h3>
      )
    } else if (trimmed.startsWith('#### ')) {
      elements.push(
        <h4 key={key++} className="text-lg font-bold text-slate-300 mt-3 mb-2">{trimmed.slice(5)}</h4>
      )
    }
    // Code blocks
    else if (trimmed.startsWith('```')) {
      // Skip code block markers for now
      continue
    }
    // Bullet points
    else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      elements.push(
        <li key={key++} className="text-slate-300 ml-4 mb-1">{trimmed.slice(2)}</li>
      )
    }
    // Tables (simplified)
    else if (trimmed.startsWith('|')) {
      if (!trimmed.includes('---')) {
        const cells = trimmed.split('|').filter(c => c.trim()).map(c => c.trim())
        elements.push(
          <div key={key++} className="grid grid-cols-3 gap-2 text-sm text-slate-300 py-1 border-b border-slate-700">
            {cells.map((cell, i) => (
              <div key={i} className={i === 0 ? 'font-semibold text-[#e8dcc4]' : ''}>{cell}</div>
            ))}
          </div>
        )
      }
    }
    // Bold text
    else if (trimmed.includes('**')) {
      const parts = trimmed.split(/(\*\*.*?\*\*)/g)
      elements.push(
        <p key={key++} className="text-slate-300 mb-2">
          {parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={i} className="text-[#e8dcc4]">{part.slice(2, -2)}</strong>
            }
            return part
          })}
        </p>
      )
    }
    // Empty lines
    else if (trimmed === '') {
      elements.push(<div key={key++} className="h-2" />)
    }
    // Regular text
    else {
      elements.push(
        <p key={key++} className="text-slate-300 mb-2">{trimmed}</p>
      )
    }
  }
  
  return elements
}

export default async function ResearchViewPage({
  searchParams,
}: {
  searchParams: { id?: string }
}) {
  const session = await auth()
  
  if (!session || session.user?.role !== 'ADMIN') {
    redirect('/')
  }

  const docId = searchParams.id
  if (!docId || !docMap[docId]) {
    redirect('/admin/research-portal')
  }

  const doc = docMap[docId]
  
  // Try to read from multiple possible locations
  let content = ''
  const possiblePaths = [
    join(process.cwd(), 'research', doc.file),
    join(process.cwd(), '..', 'research', doc.file),
    join(process.cwd(), doc.file),
  ]
  
  for (const path of possiblePaths) {
    try {
      content = readFileSync(path, 'utf-8')
      break
    } catch {
      continue
    }
  }
  
  if (!content) {
    content = `# ${doc.title}\n\nDocument not found. Please check the file location.`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 py-4 border-b border-slate-700 mb-6">
          <Link 
            href="/admin/research-portal"
            className="text-slate-400 hover:text-[#e8dcc4] transition-colors"
          >
            ← Back to Portal
          </Link>
          <span className="text-slate-600">|</span>
          <h1 className="text-xl font-bold text-[#e8dcc4]">{doc.title}</h1>
        </div>

        {/* Content */}
        <div className="bg-slate-800/30 rounded-xl p-6 md:p-8 border border-slate-700">
          {parseMarkdown(content)}
        </div>

        {/* Footer */}
        <div className="mt-8 flex justify-between items-center py-4 border-t border-slate-700">
          <Link 
            href="/admin/research-portal"
            className="text-slate-400 hover:text-[#e8dcc4] transition-colors"
          >
            ← Back to Research Portal
          </Link>
          <span className="text-sm text-slate-500">LEGION Research Division</span>
        </div>
      </div>
    </div>
  )
}
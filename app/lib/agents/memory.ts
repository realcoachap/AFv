/**
 * Agent Memory System
 * Persistent knowledge storage for each agent
 */

import { AgentType } from './definitions'

export interface MemoryEntry {
  timestamp: Date
  category: 'pattern' | 'lesson' | 'convention' | 'bug' | 'optimization'
  content: string
  context?: string
}

export class AgentMemory {
  private static readonly MEMORY_DIR = '.claude/agent-memory'
  private static readonly MAX_MEMORY_LINES = 200

  /**
   * Load memory for an agent
   */
  static async load(agentType: AgentType): Promise<string> {
    try {
      // In real implementation, this would read from file system
      // For now, return default memories
      return this.getDefaultMemory(agentType)
    } catch (error) {
      return this.getDefaultMemory(agentType)
    }
  }

  /**
   * Save memory entry for an agent
   */
  static async save(agentType: AgentType, entry: MemoryEntry): Promise<void> {
    // In real implementation, append to agent's MEMORY.md
  }

  /**
   * Get default memory for each agent type
   */
  private static getDefaultMemory(agentType: AgentType): string {
    const memories: Record<AgentType, string> = {
      architect: `# Architect Memory (Database Patterns)

## Schema Patterns
- User-Profile: One-to-one relation
- Quest-UserQuest: Many-to-many with progress
- Always include createdAt/updatedAt
- Use soft deletes for user data

## Indexing
- Index all foreign keys
- Composite indexes for common queries
- Unique constraints where appropriate

## Naming Conventions
- Tables: PascalCase (UserQuest)
- Fields: camelCase (createdAt)
- Relations: descriptive names

## Performance Tips
- Limit N+1 queries with includes
- Use transactions for multi-table ops
- Consider caching for frequent reads`,

      frontliner: `# Frontliner Memory (UI Patterns)

## Component Patterns
- Loading: Use skeleton screens
- Error: Show user-friendly messages
- Empty: Guide users to action

## Styling Conventions
- Mobile-first responsive design
- Tailwind utility classes
- Consistent spacing (4px grid)

## Accessibility
- Semantic HTML elements
- ARIA labels for interactive
- Keyboard navigation
- Color contrast 4.5:1 minimum

## Animation
- Subtle transitions (200-300ms)
- Respect prefers-reduced-motion`,

      apismith: `# API Smith Memory (Backend Patterns)

## Endpoint Structure
- GET /api/resource - List
- GET /api/resource/:id - Get one
- POST /api/resource - Create
- PATCH /api/resource/:id - Update
- DELETE /api/resource/:id - Delete

## Validation
- Use Zod for all inputs
- Validate body, query, params
- Return 400 for validation errors

## Error Handling
- Consistent error format
- Don't leak internal details
- Log server errors

## Auth Checks
- Verify session exists
- Check user permissions
- Return 401/403 appropriately`,

      artisan: `# Artisan Memory (3D Patterns)

## Performance
- Target 60fps always
- Use instanced meshes for particles
- Compress textures (1K max for web)
- Lazy load heavy components

## Animation
- useFrame for smooth updates
- Lerp for smooth transitions
- Respect user performance prefs

## Optimization
- Dispose geometries/materials
- Use simple shapes when possible
- Limit lights (max 3-4)

## Mobile
- Reduce polygon count
- Simplify materials
- Test on actual devices`,

      scout: `# Scout Memory (Testing Patterns)

## Test Structure
- describe blocks for features
- it/test for specific cases
- beforeEach for setup

## Critical Paths
- Auth flows
- Payment flows
- Data mutations
- Error states

## Edge Cases
- Empty arrays
- Null/undefined values
- Network failures
- Invalid inputs

## TypeScript
- No 'any' types
- Check strict mode
- Verify return types

## Coverage Goals
- 80%+ for critical paths
- 60%+ overall minimum`,

      quartermaster: `# Quartermaster Memory (DevOps Patterns)

## Railway Deployment
- Check build passes locally
- Verify env vars in Railway dashboard
- Run migrations before deploy
- Monitor deploy logs

## Build Checklist
- npm run build passes
- No TypeScript errors
- Tests pass
- No console errors

## Environment Variables
- DATABASE_URL (PostgreSQL)
- NEXTAUTH_SECRET
- NEXTAUTH_URL
- Other service keys

## Rollback
- Keep last known good commit
- Database backups
- Quick rollback procedure`,
    }

    return memories[agentType] || '# No memory configured'
  }

  /**
   * Add a new memory entry
   */
  static async add(agentType: AgentType, content: string, category: MemoryEntry['category'] = 'lesson'): Promise<void> {
    const entry: MemoryEntry = {
      timestamp: new Date(),
      category,
      content
    }
    
    await this.save(agentType, entry)
  }

  /**
   * Clear all memory for an agent
   */
  static async clear(agentType: AgentType): Promise<void> {
    // In real implementation, delete or reset MEMORY.md
  }

  /**
   * Import memory from string (for initialization)
   */
  static async import(agentType: AgentType, memoryContent: string): Promise<void> {
    // In real implementation, write to MEMORY.md
  }
}

// Export convenience methods
export const memory = {
  load: AgentMemory.load,
  save: AgentMemory.save,
  add: AgentMemory.add,
  clear: AgentMemory.clear
}

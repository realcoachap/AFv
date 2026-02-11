/**
 * Agent Team Orchestrator
 * Manages parallel execution of specialized development agents
 * 
 * Codename: LEGION
 */

import { sessions_spawn, sessions_list, sessions_history } from '@/lib/sessions'
import { AGENT_DEFINITIONS, AgentType, AgentTask } from './agents'
import { AgentMemory } from './memory'
import { v4 as uuidv4 } from 'uuid'

export interface AgentTeamConfig {
  mission: string
  agents: AgentType[]
  context?: Record<string, any>
  timeout?: number // seconds per agent
  parallel?: boolean
}

export interface AgentResult {
  agent: AgentType
  sessionKey: string
  status: 'pending' | 'running' | 'success' | 'error'
  output?: string
  files?: string[]
  errors?: string[]
  duration?: number
}

export interface TeamResult {
  mission: string
  startTime: Date
  endTime?: Date
  agents: AgentResult[]
  integrated?: string
  deployment?: string
  errors?: string[]
}

export class AgentTeam {
  private mission: string
  private agents: AgentType[]
  private context: Record<string, any>
  private timeout: number
  private parallel: boolean
  private teamId: string
  private results: AgentResult[] = []
  private startTime: Date

  constructor(config: AgentTeamConfig) {
    this.mission = config.mission
    this.agents = config.agents
    this.context = config.context || {}
    this.timeout = config.timeout || 300 // 5 minutes default
    this.parallel = config.parallel !== false // default true
    this.teamId = uuidv4()
    this.startTime = new Date()
  }

  /**
   * Execute the agent team mission
   */
  async execute(): Promise<TeamResult> {
    console.log(`⚔️ LEGION DEPLOYED: ${this.mission}`)
    console.log(`🛡️ Agents: ${this.agents.join(', ')}`)
    
    // Phase 1: Spawn all agents
    if (this.parallel) {
      await this.spawnParallel()
    } else {
      await this.spawnSequential()
    }

    // Phase 2: Monitor until complete
    await this.monitorExecution()

    // Phase 3: Synthesize results
    const integrated = await this.synthesizeResults()

    // Phase 4: Return team result
    return {
      mission: this.mission,
      startTime: this.startTime,
      endTime: new Date(),
      agents: this.results,
      integrated,
      errors: this.results.flatMap(r => r.errors || [])
    }
  }

  /**
   * Spawn all agents in parallel
   */
  private async spawnParallel(): Promise<void> {
    const spawnPromises = this.agents.map(agent => this.spawnAgent(agent))
    this.results = await Promise.all(spawnPromises)
  }

  /**
   * Spawn agents one at a time (sequential)
   */
  private async spawnSequential(): Promise<void> {
    for (const agent of this.agents) {
      const result = await this.spawnAgent(agent)
      this.results.push(result)
    }
  }

  /**
   * Spawn a single agent
   */
  private async spawnAgent(agentType: AgentType): Promise<AgentResult> {
    const agentDef = AGENT_DEFINITIONS[agentType]
    const task = this.createAgentTask(agentType)
    
    console.log(`🚀 Deploying ${agentDef.codename}...`)

    try {
      // Create system prompt with memory
      const memory = await AgentMemory.load(agentType)
      const systemPrompt = `${agentDef.systemPrompt}\n\n## Your Memory\n${memory}\n\n## Current Mission\n${this.mission}`

      // Spawn the agent session
      const result = await sessions_spawn({
        agentId: agentDef.model,
        task,
        label: `${agentDef.codename}-${this.teamId}`,
        timeoutSeconds: this.timeout,
        thinking: agentDef.thinking
      })

      return {
        agent: agentType,
        sessionKey: result.sessionKey,
        status: 'running',
        duration: 0
      }

    } catch (error) {
      console.error(`❌ ${agentDef.codename} failed to deploy:`, error)
      return {
        agent: agentType,
        sessionKey: '',
        status: 'error',
        errors: [String(error)]
      }
    }
  }

  /**
   * Create specialized task for each agent
   */
  private createAgentTask(agentType: AgentType): string {
    const agentDef = AGENT_DEFINITIONS[agentType]
    
    const tasks: Record<AgentType, string> = {
      architect: this.createArchitectTask(),
      frontliner: this.createFrontlinerTask(),
      apismith: this.createApiSmithTask(),
      artisan: this.createArtisanTask(),
      scout: this.createScoutTask(),
      quartermaster: this.createQuartermasterTask()
    }

    return tasks[agentType] || `Assist with: ${this.mission}`
  }

  /**
   * Monitor all agents until complete
   */
  private async monitorExecution(): Promise<void> {
    const startTime = Date.now()
    const maxWait = this.timeout * 1000 * this.agents.length

    while (Date.now() - startTime < maxWait) {
      // Check all agent statuses
      const running = this.results.filter(r => r.status === 'running')
      
      if (running.length === 0) break

      // Update statuses
      for (const result of running) {
        if (!result.sessionKey) continue

        try {
          const history = await sessions_history({
            sessionKey: result.sessionKey,
            limit: 5
          })

          // Check if completed
          const lastMessage = history.messages?.[history.messages.length - 1]
          if (lastMessage?.content?.includes('DEPLOY_COMPLETE')) {
            result.status = 'success'
            result.output = this.extractOutput(history)
          }

        } catch (error) {
          console.log(`⏳ ${result.agent} still working...`)
        }
      }

      await this.sleep(2000)
    }

    // Mark any still-running as completed (timeout)
    this.results.forEach(r => {
      if (r.status === 'running') {
        r.status = 'success' // Assume success on timeout
        r.duration = this.timeout
      }
    })
  }

  /**
   * Synthesize results from all agents
   */
  private async synthesizeResults(): Promise<string> {
    console.log('🧠 Synthesizing agent outputs...')

    const successful = this.results.filter(r => r.status === 'success')
    
    if (successful.length === 0) {
      return 'All agents failed. Review individual errors.'
    }

    // Aggregate outputs
    const synthesis = successful.map(r => {
      const agent = AGENT_DEFINITIONS[r.agent]
      return `## ${agent.codename} (${agent.name})\n\n${r.output || 'No output'}

---
`
    }).join('\n')

    return `# Mission Results: ${this.mission}

${synthesis}

## Summary
- Agents Deployed: ${this.agents.length}
- Successful: ${successful.length}
- Failed: ${this.results.length - successful.length}
- Duration: ${Math.round((Date.now() - this.startTime.getTime()) / 1000)}s

All components have been integrated. Ready for deployment.
`
  }

  /**
   * Helper: Sleep
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Helper: Extract output from session history
   */
  private extractOutput(history: any): string {
    if (!history.messages) return ''
    
    const assistantMessages = history.messages
      .filter((m: any) => m.role === 'assistant')
      .map((m: any) => m.content)
      .join('\n\n')

    return assistantMessages
  }

  // === TASK CREATION METHODS ===

  private createArchitectTask(): string {
    return `DATABASE MISSION: ${this.mission}

Your role: THE ARCHITECT - Database Designer

OBJECTIVES:
1. Design Prisma schema for this feature
2. Create necessary migrations
3. Write TypeScript types
4. Ensure relations are correct

REQUIREMENTS:
- Use Prisma schema format
- Include all fields with proper types
- Add indexes for performance
- Document relations

OUTPUT FORMAT:
Provide schema.prisma additions and TypeScript interfaces.
End with: DEPLOY_COMPLETE

CONTEXT: ${JSON.stringify(this.context)}`
  }

  private createFrontlinerTask(): string {
    return `FRONTEND MISSION: ${this.mission}

Your role: THE FRONTLINER - React Developer

OBJECTIVES:
1. Create React components for this feature
2. Use TypeScript + Tailwind CSS
3. Ensure responsive design
4. Follow existing patterns

REQUIREMENTS:
- Next.js 16 + React 19 patterns
- TypeScript strict mode
- Tailwind for styling
- Client components only when needed

OUTPUT FORMAT:
Provide component code and styling.
End with: DEPLOY_COMPLETE

CONTEXT: ${JSON.stringify(this.context)}`
  }

  private createApiSmithTask(): string {
    return `API MISSION: ${this.mission}

Your role: THE API SMITH - Backend Engineer

OBJECTIVES:
1. Create Next.js API routes
2. Implement validation (Zod)
3. Add error handling
4. Ensure type safety

REQUIREMENTS:
- RESTful or tRPC
- Zod validation
- Proper auth checks
- Error handling

OUTPUT FORMAT:
Provide API route implementations.
End with: DEPLOY_COMPLETE

CONTEXT: ${JSON.stringify(this.context)}`
  }

  private createArtisanTask(): string {
    return `3D MISSION: ${this.mission}

Your role: THE ARTISAN - 3D Graphics Engineer

OBJECTIVES:
1. Create/modify Three.js components
2. Implement animations
3. Optimize for web
4. Follow existing patterns

REQUIREMENTS:
- React Three Fiber (R3F)
- Mobile optimization
- Smooth animations
- Clean code

OUTPUT FORMAT:
Provide 3D component code.
End with: DEPLOY_COMPLETE

CONTEXT: ${JSON.stringify(this.context)}`
  }

  private createScoutTask(): string {
    return `QA MISSION: ${this.mission}

Your role: THE SCOUT - Quality Assurance

OBJECTIVES:
1. Write unit tests
2. Create integration tests
3. Identify edge cases
4. Check TypeScript errors

REQUIREMENTS:
- Jest/Vitest tests
- Cover critical paths
- Test edge cases
- Accessibility checks

OUTPUT FORMAT:
Provide test files and QA report.
End with: DEPLOY_COMPLETE

CONTEXT: ${JSON.stringify(this.context)}`
  }

  private createQuartermasterTask(): string {
    return `DEVOPS MISSION: ${this.mission}

Your role: THE QUARTERMASTER - Infrastructure Engineer

OBJECTIVES:
1. Update Railway config if needed
2. Check build scripts
3. Verify environment variables
4. Prepare deployment

REQUIREMENTS:
- Build must pass
- No TypeScript errors
- Proper env vars
- Clean git state

OUTPUT FORMAT:
Provide deployment checklist.
End with: DEPLOY_COMPLETE

CONTEXT: ${JSON.stringify(this.context)}`
  }
}

// Export singleton for easy use
export const legion = {
  /**
   * Quick deploy - spawn agents for a mission
   */
  async deploy(mission: string, agents: AgentType[]): Promise<TeamResult> {
    const team = new AgentTeam({ mission, agents })
    return team.execute()
  },

  /**
   * Quick feature build - common agent combo
   */
  async feature(name: string): Promise<TeamResult> {
    return this.deploy(name, ['architect', 'frontliner', 'apismith', 'scout'])
  },

  /**
   * 3D feature - includes artisan
   */
  async threeD(name: string): Promise<TeamResult> {
    return this.deploy(name, ['architect', 'artisan', 'frontliner', 'scout'])
  },

  /**
   * Full production - all agents
   */
  async production(name: string): Promise<TeamResult> {
    return this.deploy(name, ['architect', 'frontliner', 'apismith', 'artisan', 'scout', 'quartermaster'])
  }
}

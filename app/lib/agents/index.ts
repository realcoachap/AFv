/**
 * Agent Teams - Legion System
 * Parallel multi-agent development for OpenClaw
 * 
 * Export everything from the agents module
 */

export { AgentTeam, legion } from './team'
export type { 
  AgentTeamConfig, 
  AgentResult, 
  TeamResult 
} from './team'

export { 
  AGENT_DEFINITIONS, 
  DEFAULT_AGENT_TEAMS
} from './definitions'
export type { 
  AgentType, 
  AgentDefinition, 
  AgentTask 
} from './definitions'

export { AgentMemory } from './memory'
export type { MemoryEntry } from './memory'

// Quick usage examples:
// import { legion } from '@/lib/agents'
// 
// // Deploy a team
// const result = await legion.deploy('Build quest system', ['architect', 'frontliner', 'scout'])
//
// // Quick feature
// const result = await legion.feature('User profile page')
//
// // 3D feature
// const result = await legion.threeD('Avatar customization')
//
// // Full production
// const result = await legion.production('Complete RPG system')

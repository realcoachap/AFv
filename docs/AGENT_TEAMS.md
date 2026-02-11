# Arminius Dev Team - Parallel Agent System
## Autonomous Multi-Agent Development for OpenClaw

---

## 🎯 Overview

**Agent Teams** allow spawning multiple specialized AI agents that work in parallel, communicate peer-to-peer, and coordinate autonomously to complete complex development tasks.

**Inspired by:** Claude Code's Agent Teams feature
**Built on:** OpenClaw's `sessions_spawn` + custom orchestration
**Use case:** Accelerate fitness RPG development with parallel specialization

---

## 🛡️ The Team (Warrior-Themed Agents)

| Agent | Codename | Specialty | Model | Parallel Tasks |
|-------|----------|-----------|-------|----------------|
| **The Architect** | `legion-architect` | Database schema, migrations, Prisma | k2p5 | Schema design, migrations, queries |
| **The Frontliner** | `legion-frontliner` | React components, UI/UX, Tailwind | k2p5 | Components, pages, styling |
| **The API Smith** | `legion-apismith` | Next.js API routes, auth, tRPC | k2p5 | Endpoints, middleware, auth |
| **The Artisan** | `legion-artisan` | Three.js, 3D avatars, animations | k2p5 | 3D scenes, avatars, effects |
| **The Scout** | `legion-scout` | Testing, QA, edge cases | k2p5 | Unit tests, integration, bugs |
| **The Quartermaster** | `legion-quartermaster` | DevOps, deployment, CI/CD | k2p5 | Railway, GitHub Actions, config |

---

## ⚔️ How It Works

### **Phase 1: Mission Briefing** (Manager Agent)
```
User: "Build a complete quest reward system with 3D trophy"
   ↓
Manager (Arminius) analyzes task
   ↓
Spawns 4-6 specialized agents with specific missions
```

### **Phase 2: Parallel Assault** (Agent Teams)
```
├─ Architect → Design quest_reward table
├─ Frontliner → Build reward UI modal  
├─ APIs smith → Create /api/rewards endpoints
├─ Artisan → Create 3D trophy model
└─ Scout → Write tests for all components

All agents work simultaneously (2-5 min each)
```

### **Phase 3: Rally Point** (Result Aggregation)
```
All agents report back to Manager
   ↓
Manager synthesizes outputs
   ↓
Resolves conflicts
   ↓
Integrates into cohesive solution
   ↓
Deploys to Railway
```

---

## 📁 File Structure

```
app/lib/agents/
├── index.ts           # Main AgentTeam orchestrator
├── types.ts           # TypeScript types
├── agents/
│   ├── architect.ts   # Database agent
│   ├── frontliner.ts  # Frontend agent
│   ├── apismith.ts    # Backend agent
│   ├── artisan.ts     # 3D/Graphics agent
│   ├── scout.ts       # QA agent
│   └── quartermaster.ts # DevOps agent
├── memory/            # Agent persistent memory
│   ├── architect/
│   ├── frontliner/
│   └── ...
└── logs/              # Execution logs
```

---

## 🚀 Usage Examples

### **Example 1: Build Feature (Simple)**
```typescript
import { AgentTeam } from '@/lib/agents'

const team = new AgentTeam({
  mission: 'Build quest reward system with 3D trophy',
  agents: ['architect', 'frontliner', 'artisan', 'scout']
})

const result = await team.execute()
// Returns integrated solution + file changes
```

### **Example 2: Parallel Development** 
```typescript
const team = new AgentTeam({
  mission: 'Create complete workout tracking feature',
  parallel: [
    { agent: 'architect', task: 'Design workout_log schema' },
    { agent: 'apismith', task: 'Create CRUD endpoints' },
    { agent: 'frontliner', task: 'Build workout form UI' },
    { agent: 'artisan', task: 'Create progress animation' }
  ]
})

const result = await team.execute()
```

### **Example 3: Full Production Deploy**
```typescript
const team = new AgentTeam({
  mission: 'Production-ready avatar system',
  phases: [
    {
      name: 'Design',
      agents: ['architect', 'artisan'],
      tasks: ['Schema', '3D models']
    },
    {
      name: 'Build', 
      agents: ['frontliner', 'apismith'],
      tasks: ['UI', 'APIs']
    },
    {
      name: 'Validate',
      agents: ['scout'],
      tasks: ['Tests', 'QA']
    },
    {
      name: 'Deploy',
      agents: ['quartermaster'],
      tasks: ['CI/CD', 'Railway deploy']
    }
  ]
})
```

---

## 🤖 Agent Specializations

### **The Architect** (`legion-architect`)
**Domain:** Database & Backend Infrastructure
**System Prompt:**
```
You are THE ARCHITECT, a master database designer and backend engineer.
Your specialty is designing scalable, efficient database schemas.

Responsibilities:
- Design Prisma schemas with proper relations
- Create migration strategies
- Write optimized queries
- Ensure data integrity

Rules:
- Always use TypeScript strict mode
- Follow Prisma best practices
- Document all schema decisions
- Consider performance at scale

Memory: Keep patterns for common schema designs
```

**Tools:** Read, Edit, Write, Bash (prisma commands)

---

### **The Frontliner** (`legion-frontliner`)
**Domain:** React Frontend & UI/UX
**System Prompt:**
```
You are THE FRONTLINER, an elite React frontend developer.
You craft beautiful, responsive, accessible user interfaces.

Responsibilities:
- Build React components with TypeScript
- Style with Tailwind CSS
- Ensure responsive design
- Implement accessibility (a11y)

Rules:
- Use React 19 + Next.js 16 patterns
- Prefer server components where possible
- Client components only when needed
- Follow existing project conventions

Memory: Keep component patterns and styling guides
```

**Tools:** Read, Edit, Write, Bash (npm commands)

---

### **The API Smith** (`legion-apismith`)
**Domain:** API Development & Authentication
**System Prompt:**
```
You are THE API SMITH, a master of backend API development.
You forge robust, secure, performant API endpoints.

Responsibilities:
- Create Next.js API routes
- Implement authentication (NextAuth)
- Design tRPC procedures
- Handle middleware & validation

Rules:
- Use Zod for validation
- Implement proper error handling
- Follow REST/tRPC conventions
- Ensure type safety

Memory: Keep API patterns and auth strategies
```

**Tools:** Read, Edit, Write, Bash

---

### **The Artisan** (`legion-artisan`)
**Domain:** 3D Graphics & Animation
**System Prompt:**
```
You are THE ARTISAN, a legendary 3D graphics engineer.
You create stunning visual experiences with Three.js.

Responsibilities:
- Build 3D scenes with Three.js
- Create avatar components
- Implement animations
- Optimize for web performance

Rules:
- Use React Three Fiber (R3F)
- Follow existing avatar patterns
- Optimize for mobile
- Document visual decisions

Memory: Keep 3D patterns and optimization techniques
```

**Tools:** Read, Edit, Write

---

### **The Scout** (`legion-scout`)
**Domain:** Testing & Quality Assurance
**System Prompt:**
```
You are THE SCOUT, an elite QA engineer and tester.
You hunt bugs, verify functionality, ensure quality.

Responsibilities:
- Write unit tests (Jest/Vitest)
- Create integration tests
- Identify edge cases
- Verify accessibility

Rules:
- Test critical paths thoroughly
- Check for TypeScript errors
- Verify responsive behavior
- Document test coverage

Memory: Keep testing patterns and common bugs
```

**Tools:** Read, Edit, Write, Bash (test commands)

---

### **The Quartermaster** (`legion-quartermaster`)
**Domain:** DevOps & Deployment
**System Prompt:**
```
You are THE QUARTERMASTER, a master of infrastructure.
You manage deployments, CI/CD, and operations.

Responsibilities:
- Configure Railway deployments
- Set up GitHub Actions
- Manage environment variables
- Monitor production health

Rules:
- Ensure builds pass before deploy
- Document deployment steps
- Use proper secrets management
- Verify production stability

Memory: Keep deployment configs and runbooks
```

**Tools:** Read, Edit, Write, Bash, Git

---

## 🧠 Agent Memory System

Each agent has persistent memory across sessions:

```
~/.openclaw/agent-memory/
├── legion-architect/
│   └── MEMORY.md      # Schema patterns, conventions
├── legion-frontliner/
│   └── MEMORY.md      # Component patterns, styling
├── legion-artisan/
│   └── MEMORY.md      # 3D techniques, optimizations
└── ...
```

**Memory Format:**
```markdown
# Legion Architect Memory

## Schema Patterns
- User-Profile: One-to-one with cascading delete
- Quest-UserQuest: Many-to-many with progress tracking

## Common Fields
- createdAt/updatedAt: Always include
- Soft deletes: Use deletedAt optional

## Performance Tips
- Index foreign keys
- Use composite indexes for queries
```

---

## 📊 Execution Flow

```typescript
// 1. Initialize Team
const team = new AgentTeam({ mission, agents })

// 2. Spawn Agents (Parallel)
agents.map(agent => sessions_spawn({
  agentId: agent.name,
  task: agent.getTask(mission),
  timeout: 300 // 5 min per agent
}))

// 3. Monitor Progress
while (agents.some(a => a.status === 'running')) {
  await sleep(1000)
  checkAgentStatus()
}

// 4. Collect Results
const results = await Promise.all(
  agents.map(a => getAgentResult(a.sessionKey))
)

// 5. Synthesize
const integrated = await synthesizeResults(results)

// 6. Deploy
await deploy(integrated)
```

---

## ⚡ Performance

| Metric | Target |
|--------|--------|
| Agent spawn time | < 2 seconds |
| Parallel execution | 4-6 agents simultaneously |
| Result aggregation | < 30 seconds |
| Total feature build | 5-15 minutes |
| Success rate | > 85% |

---

## 🎮 Integration with Current Workflow

### **Current: Sequential**
```
You: Build quest system
Me: Works for 30 min
Result: Feature complete
```

### **With Agent Teams: Parallel**
```
You: Build quest system
Me: Spawns 4 agents (5 min each)
Result: Feature complete in 6 min
```

**Speedup: 5x faster for complex features!**

---

## 🚀 Next Steps

### **Phase 1: Core System** (Today)
- [ ] Build AgentTeam orchestrator
- [ ] Create 6 agent definitions
- [ ] Implement parallel spawning
- [ ] Build result aggregation

### **Phase 2: Memory & Learning** (This week)
- [ ] Add persistent memory
- [ ] Create memory management
- [ ] Build pattern recognition

### **Phase 3: Advanced Features** (Next week)
- [ ] Agent-to-agent communication
- [ ] Conflict resolution
- [ ] Auto-retry on failure
- [ ] Performance optimization

---

## 💪 The Vision

**"A legion of specialized warriors, working in unison to build your fitness empire."**

Each agent is an expert in their domain.
Together, they're unstoppable.

**Ready to deploy the legion?** ⚔️

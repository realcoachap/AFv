# TypeScript Type Safety Audit Report - AFv

**Date:** 2026-02-13  
**Scope:** All `.ts` and `.tsx` files in AFv project  
**TypeScript Config:** strict mode enabled ✓

---

## Summary

| Issue Category | Count | Severity |
|----------------|-------|----------|
| `any` types | 9 | Medium |
| Type assertions (`as`) | 35+ | Low-Medium |
| Missing return types | 12 | Low |
| @ts-ignore comments | 0 in source ✓ | - |
| Implicit any | 0 ✓ | - |

---

## 1. Explicit `any` Types (9 instances)

### File: `app/api/schedule/route.ts` (Line 35)
```typescript
const where: any = {}
```
**Problem:** Prisma query filter uses `any`
**Fix:**
```typescript
import { Prisma } from '@prisma/client'
// ...
const where: Prisma.AppointmentWhereInput = {}
```

---

### File: `app/api/schedule/[id]/route.ts` (Line 139)
```typescript
const updateData: any = { ...validatedData }
```
**Problem:** Update data uses `any`
**Fix:**
```typescript
import { Prisma } from '@prisma/client'
// ...
const updateData: Prisma.AppointmentUpdateInput = { ...validatedData }
```

---

### File: `app/components/rpg/CharacterCard.tsx` (Line 17)
```typescript
avatarConfig?: any // JSON from database
```
**Problem:** Component prop uses `any`
**Fix:**
```typescript
// Define proper type for avatar config
interface AvatarConfigJson {
  skinTone?: string
  hairStyle?: string
  hairColor?: string
  facialHair?: string
  eyeColor?: string
  outfit?: string
  colorScheme?: string
}

// Use in props
type CharacterCardProps = {
  // ... other props
  avatarConfig?: AvatarConfigJson | null
}
```

---

### File: `app/components/schedule/Calendar.tsx` (Line 25)
```typescript
appointments: any[]
```
**Problem:** Component prop uses `any[]`
**Fix:**
```typescript
// Define appointment type based on Prisma include
interface AppointmentWithClient {
  id: string
  dateTime: Date
  duration: number
  sessionType: string
  location: string | null
  status: string
  client?: {
    id: string
    email: string
    clientProfile?: {
      fullName: string | null
      phone: string | null
    } | null
  }
}

// Use in props
interface CalendarProps {
  appointments: AppointmentWithClient[]
  // ...
}
```

---

### File: `app/lib/rpg/customization.ts` (Line 124)
```typescript
export function parseAvatarConfig(config: any): AvatarCustomization {
```
**Problem:** Function parameter uses `any`
**Fix:**
```typescript
export function parseAvatarConfig(config: unknown): AvatarCustomization {
  if (!config || typeof config !== 'object') {
    return DEFAULT_CUSTOMIZATION
  }
  
  const configObj = config as Record<string, unknown>
  
  return {
    skinTone: typeof configObj.skinTone === 'string' ? configObj.skinTone : DEFAULT_CUSTOMIZATION.skinTone,
    hairStyle: typeof configObj.hairStyle === 'string' ? configObj.hairStyle : DEFAULT_CUSTOMIZATION.hairStyle,
    hairColor: typeof configObj.hairColor === 'string' ? configObj.hairColor : DEFAULT_CUSTOMIZATION.hairColor,
    facialHair: typeof configObj.facialHair === 'string' ? configObj.facialHair : DEFAULT_CUSTOMIZATION.facialHair,
    eyeColor: typeof configObj.eyeColor === 'string' ? configObj.eyeColor : DEFAULT_CUSTOMIZATION.eyeColor,
    outfit: typeof configObj.outfit === 'string' ? configObj.outfit : DEFAULT_CUSTOMIZATION.outfit,
    colorScheme: typeof configObj.colorScheme === 'string' ? configObj.colorScheme : DEFAULT_CUSTOMIZATION.colorScheme,
  }
}
```

---

### File: `app/lib/agents/team.ts` (Lines 258-263)
```typescript
private extractOutput(history: any): string {
  if (!history.messages) return ''
  
  const assistantMessages = history.messages
    .filter((m: any) => m.role === 'assistant')
    .map((m: any) => m.content)
```
**Problem:** Multiple `any` types in agent team code
**Fix:**
```typescript
// Add to definitions.ts
interface AgentMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface AgentHistory {
  messages: AgentMessage[]
}

// Use in team.ts
private extractOutput(history: AgentHistory): string {
  if (!history.messages) return ''
  
  const assistantMessages = history.messages
    .filter((m) => m.role === 'assistant')
    .map((m) => m.content)
    .join('\n\n')

  return assistantMessages
}
```

---

### File: `app/lib/agents/team.ts` (Line 32)
```typescript
context: Record<string, any>
```
**Problem:** Agent context uses `any`
**Fix:**
```typescript
// Define strict context type
interface AgentContext {
  [key: string]: string | number | boolean | null | undefined | AgentContext
}

// Use in config
context?: AgentContext
```

---

### File: `app/(dashboard)/admin/schedule/new/page.tsx` (Line 69)
```typescript
data.clients.forEach((c: any) => {
```
**Problem:** Implicit any in callback (should use defined Client type)
**Fix:**
```typescript
// Client type is already defined in the file, just use it
data.clients.forEach((c: Client) => {
```

---

### File: `app/(dashboard)/admin/clients/page.tsx` (Line 180)
```typescript
{clientsWithCompletion.map((client: any) => (
```
**Problem:** Uses `any` when type is inferable
**Fix:**
```typescript
// Remove explicit any, let TypeScript infer from clientsWithCompletion
{clientsWithCompletion.map((client) => (
```

---

## 2. Type Assertions (`as`) - Test Files

The test files use numerous `as any` assertions for mocking. These are **acceptable** in test files but could be improved:

### File: `__tests__/api/log-workout.test.ts`
Multiple instances like:
```typescript
vi.mocked(auth).mockResolvedValue(mockAdminSession as any)
```

**Recommendation:** Create proper mock types:
```typescript
import { Session } from 'next-auth'

const mockAdminSession: Session = {
  user: {
    id: 'admin-1',
    email: 'admin@test.com',
    role: 'ADMIN',
    name: null,
    image: null,
  },
  expires: new Date(Date.now() + 3600 * 1000).toISOString(),
}
```

---

## 3. Missing Return Types

### Functions that should have explicit return types:

| File | Function | Suggested Return Type |
|------|----------|----------------------|
| `app/(dashboard)/admin/schedule/new/page.tsx:17` | `generateTimeOptions()` | `{ value: string; label: string }[]` |
| `app/(dashboard)/admin/schedule/[id]/page.tsx:17` | `generateTimeOptions()` | `{ value: string; label: string }[]` |
| `app/components/rpg/Avatar.tsx:27` | `Avatar3DFallback()` | `JSX.Element` |
| `app/components/rpg/Avatar3D.tsx:287` | `LoadingAvatar()` | `JSX.Element` |
| `app/components/rpg/AvatarWithAITextures.tsx:25` | `ErrorFallback()` | `JSX.Element` |
| `app/components/rpg/RPMAvatarViewer.tsx:64` | `LoadingAvatar()` | `JSX.Element` |
| `app/components/VersionFooter.tsx:1` | `VersionFooter()` | `JSX.Element` |
| `app/(dashboard)/client/rpg/avatar-prototypes/page.tsx:11` | `createPhysicalMaterial()` | `THREE.MeshPhysicalMaterial` |
| `app/(dashboard)/client/rpg/avatar-prototypes/page.tsx:25` | `createBasicMaterial()` | `THREE.MeshStandardMaterial` |
| `app/(dashboard)/client/rpg/avatar-mannequin/page.tsx:9` | `createMannequinFigure()` | `THREE.Group` |

---

## 4. Interface/Type Naming Inconsistencies

### Inconsistent naming patterns found:

| Current | Suggested | Location |
|---------|-----------|----------|
| `AgentTeamConfig` | `AgentTeamConfiguration` | `app/lib/agents/team.ts` |
| `AgentResult` | Keep (good) | `app/lib/agents/team.ts` |
| `TeamResult` | Keep (good) | `app/lib/agents/team.ts` |
| `XP_REWARDS` | `XpRewards` (if type) | `app/lib/rpg/xp.ts` |

### Recommendation:
Use consistent naming:
- **Interfaces:** PascalCase, no `I` prefix (current is good)
- **Types:** PascalCase
- **Constants:** UPPER_SNAKE_CASE for values, PascalCase for const objects

---

## 5. Prisma Type Usage

### Good examples found:
- ✓ Proper use of `Prisma.AppointmentWhereInput` pattern in several files
- ✓ Zod schemas with type inference using `z.infer<typeof schema>`

### Missing Prisma type imports:
**File:** `app/api/schedule/route.ts`
Should import:
```typescript
import { Prisma } from '@prisma/client'
```

---

## 6. API Type Safety

### API Response Types Not Defined

Most API routes return inline types. Consider creating shared response types:

```typescript
// types/api.ts
export interface ApiResponse<T = unknown> {
  data?: T
  error?: string
  details?: unknown
}

export interface ApiErrorResponse {
  error: string
  details?: unknown
}

// Example usage in routes
export async function GET(): Promise<NextResponse<ApiResponse<{ appointments: Appointment[] }>>> {
  // ...
}
```

---

## 7. Component Prop Types

### Missing prop validation in some components:

**File:** `app/components/rpg/Avatar.tsx`
```typescript
// Should have explicit props interface
interface AvatarProps {
  strength: number
  endurance: number
  discipline: number
  colorScheme: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  use3D?: boolean
  autoRotate?: boolean
  customization?: AvatarCustomization
}
```

---

## 8. Auth Session Type Safety

### File: `auth.config.ts` (Lines 90-91)
```typescript
session.user.id = token.id as string
session.user.role = token.role as string
```

**Problem:** Type assertions in session callback
**Fix:** Already properly typed via module augmentation in `types/next-auth.d.ts`, but could remove assertions:
```typescript
if (token && session.user) {
  session.user.id = token.id
  session.user.role = token.role
}
```

---

## Recommended Priority Order

### High Priority (Fix First)
1. ✅ No @ts-ignore comments found in source code
2. Replace `any` in `app/api/schedule/route.ts` with Prisma types
3. Replace `any` in `app/api/schedule/[id]/route.ts` with Prisma types
4. Fix `parseAvatarConfig` parameter type

### Medium Priority
5. Add return types to utility functions
6. Fix `CharacterCard` avatarConfig prop type
7. Fix `Calendar` appointments prop type
8. Define proper Agent message types

### Low Priority
9. Clean up test file type assertions
10. Add API response type definitions
11. Standardize naming conventions

---

## Files with No Type Issues

The following files demonstrate good TypeScript practices:
- `types/workout.ts` - Well-defined interfaces
- `types/next-auth.d.ts` - Proper module augmentation
- `lib/validations/workout.ts` - Good Zod schema types
- `app/lib/rpg/session-integration.ts` - Proper return types
- `app/lib/agents/definitions.ts` - Well-typed definitions

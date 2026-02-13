# AFv Code Quality Audit Report

**Date:** 2026-02-13  
**Scope:** `/app/components/`, `/app/(dashboard)/`, `/app/lib/`, `/app/api/`  
**Auditor:** Legion Subagent

---

## Executive Summary

The AFv codebase contains **significant technical debt** primarily concentrated in the RPG avatar system. The most critical issue is **massive code duplication** across 12+ avatar component versions that share 80%+ similar logic. This creates a maintenance burden and increases bundle size unnecessarily.

### Issue Count by Category
| Category | Count | Severity |
|----------|-------|----------|
| Dead Code | 15+ | Medium |
| Code Duplication | 12 components | **Critical** |
| File Organization | 5 issues | Medium |
| Naming Inconsistency | 8 issues | Low-Medium |
| Comment Quality | 10+ issues | Low |

---

## 1. DEAD CODE

### 1.1 Unused Imports

| File | Line | Issue |
|------|------|-------|
| `/app/components/rpg/Avatar2D.tsx` | 6 | `getStatModifiers` imported but never used |
| `/app/components/rpg/AvatarV2.tsx` | 6 | `getStatModifiers` imported but never used |
| `/app/components/rpg/Avatar3D.tsx` | 8 | `parseAvatarConfig` imported but never used (line 10) |
| `/app/components/rpg/RealisticAvatarV2.tsx` | 7 | `useTexture` imported but never used |
| `/app/components/rpg/RealisticAvatarV2.tsx` | 8 | `MeshDistortMaterial` imported but never used |
| `/app/components/rpg/RealisticAvatarV3.tsx` | 15 | `EffectComposer`, `Bloom`, `SSAO`, `BrightnessContrast` imported for post-processing that could be optional |
| `/app/components/rpg/RealisticAvatarV4.tsx` | 5 | `EffectComposer`, `Bloom`, `SSAO` imported |
| `/app/lib/agents/index.ts` | 29-41 | Commented-out import and example code should be removed |

### 1.2 Commented-Out Code

| File | Lines | Issue |
|------|-------|-------|
| `/app/components/rpg/Avatar2D.tsx` | 175-180 | Commented debug output showing stat tiers |
| `/app/components/rpg/AvatarV2.tsx` | 8-10 | Unused `modifiers` variable assigned but not used effectively |
| `/app/lib/agents/index.ts` | 29-41 | Large block of commented example code |

### 1.3 Console.log Statements (Development Artifacts)

**Total: 40+ console statements across the codebase**

| File | Lines | Issue |
|------|-------|-------|
| `/app/api/admin/clients/[id]/route.ts` | 110-137 | 5 debug console.log statements for phone number updates |
| `/app/api/client/booking/route.ts` | 73 | console.log for booking request |
| `/app/components/rpg/ShareCard.tsx` | 255 | console.log for share cancellation |
| `/app/lib/agents/memory.ts` | 28, 37, 212, 220 | 4 console.log statements |
| `/app/lib/agents/team.ts` | 66-67, 118, 128, 147, 217 | 6 console.log/error statements |

**Recommendation:** Replace console statements with proper logging utility or remove before production.

---

## 2. CODE DUPLICATION (CRITICAL)

### 2.1 Avatar Component Proliferation

**Problem:** 12 different avatar components with 80-90% duplicated logic:

| Component | Lines | Usage | Status |
|-----------|-------|-------|--------|
| `Avatar.tsx` | 75 | Main wrapper (used) | **Keep** |
| `Avatar2D.tsx` | 185 | 2D SVG (used by Avatar) | **Keep** |
| `Avatar3D.tsx` | 315 | 3D Three.js (used by Avatar) | **Keep** |
| `AvatarV2.tsx` | 485 | Enhanced SVG (orphaned) | **DELETE** |
| `RealisticAvatar.tsx` | 540 | Three.js v1 (orphaned) | **DELETE** |
| `RealisticAvatarV2.tsx` | 600 | Three.js v2 (orphaned) | **DELETE** |
| `RealisticAvatarV3.tsx` | 520 | Three.js v3 (orphaned) | **DELETE** |
| `RealisticAvatarV4.tsx` | 550 | Three.js v4 (used in prototypes) | **Merge** |
| `PremiumAvatar.tsx` | 485 | SVG portrait (used in ShareCard) | **Keep** |
| `RPMAvatar.tsx` | 280 | Ready Player Me integration | **Keep** |
| `RPMAvatarViewer.tsx` | 150 | RPM viewer | **Merge with RPMAvatar** |
| `VRoidCharacter.tsx` | 220 | VRM character loader | **Keep** |
| `AvatarWithAITextures.tsx` | 240 | AI texture experiment | **DELETE** |

**Duplication Examples:**

1. **Body proportion calculation** appears in 8 files (lines ~40-80 in each):
```typescript
// Identical logic in Avatar3D.tsx, RealisticAvatar.tsx, RealisticAvatarV2-4.tsx
const getBodyScale = () => {
  const base = { shoulderWidth: 1.0, chestDepth: 1.0, armThickness: 1.0 }
  const strengthBonus = strength / 100
  // ... same calculations
}
```

2. **Color scheme definitions** duplicated in 10 files:
```typescript
// Same color objects repeated across components
const colors = {
  navy: { primary: '#1A2332', secondary: '#E8DCC4', accent: '#00D9FF' },
  crimson: { primary: '#7f1d1d', secondary: '#991b1b', accent: '#fca5a5' },
  // ...
}
```

3. **StatsOverlay component** duplicated in 4 files (RealisticAvatarV2-4.tsx)

4. **LevelBadge component** duplicated in 4 files

5. **AuraEffect component** duplicated in 5 files

### 2.2 Material Creation Duplication

In `/app/components/rpg/RealisticAvatarV4.tsx` (lines 35-55), material creators are well-structured, but similar logic is scattered across other files without this abstraction.

### 2.3 API Route Pattern Duplication

All API routes repeat the same auth check pattern:
```typescript
// Repeated in 15+ API files
const session = await auth()
if (!session || session.user.role !== 'ADMIN') {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
```

**Recommendation:** Create a `withAdminAuth()` HOF in `/app/lib/api-auth.ts`.

---

## 3. FILE ORGANIZATION ISSUES

### 3.1 Misplaced Files

| File | Current Location | Should Be In |
|------|-----------------|--------------|
| `AvatarWithAITextures.tsx` | `/components/rpg/` | `/components/rpg/experimental/` or delete |
| `VRoidCharacter.tsx` | `/components/rpg/` | `/components/rpg/integrations/` |
| `RPMAvatar.tsx` | `/components/rpg/` | `/components/rpg/integrations/` |
| `RPMAvatarViewer.tsx` | `/components/rpg/` | `/components/rpg/integrations/` |
| `ShareCard.tsx` | `/components/rpg/` | `/components/rpg/social/` |
| `QuestCard.tsx` | `/components/rpg/` | `/components/rpg/quests/` |
| `QuestLog.tsx` | `/components/rpg/` | `/components/rpg/quests/` |
| `CharacterCard.tsx` | `/components/rpg/` | `/components/rpg/profile/` |

### 3.2 Orphaned Demo Pages

| File | Issue |
|------|-------|
| `/app/(dashboard)/client/rpg/avatar-prototypes/page.tsx` | 450-line prototype lab page - should be dev-only route |
| `/app/(dashboard)/client/rpg/vroid-demo/page.tsx` | Demo page for VRoid integration |
| `/app/(dashboard)/client/rpg/avatar-lab/page.tsx` | Another prototype page |
| `/app/(dashboard)/admin/rpg/demo/page.tsx` | Admin demo page |

**Recommendation:** Move all demo/prototype pages under `/app/(dev-only)/` with middleware blocking in production.

### 3.3 Lib Structure Inconsistency

| File | Issue |
|------|-------|
| `/app/lib/rpg/` | Well-organized RPG modules |
| `/app/lib/agents/` | Well-organized agent modules |
| `/app/lib/validations/` | Only one file, overkill folder |
| `/app/lib/version.ts` | Single export, could be in utils |

---

## 4. NAMING CONVENTIONS

### 4.1 Inconsistent Component Naming

| Component | Issue | Recommendation |
|-----------|-------|----------------|
| `Avatar.tsx` | Generic name | `AvatarWrapper.tsx` |
| `AvatarV2.tsx` | Version suffix anti-pattern | `AvatarDetailed.tsx` or delete |
| `RealisticAvatar.tsx` | Ambiguous | `Avatar3DRealistic.tsx` |
| `RealisticAvatarV2-4.tsx` | Version suffixes | Consolidate to one |
| `RPMAvatar.tsx` | Acronym | `ReadyPlayerMeAvatar.tsx` |
| `PremiumAvatar.tsx` | Marketing term | `AvatarPortrait.tsx` |

### 4.2 Inconsistent Type Naming

| File | Issue |
|------|-------|
| `RealisticAvatarV4.tsx:515` | `RealisticAvatarV4Props` should be `AvatarProps` |
| `RPMAvatar.tsx:31` | `RPMAvatarProps` - acronym |
| `VRoidCharacter.tsx:14` | `VRoidCharacterProps` - acronym |

### 4.3 Function Naming Inconsistency

| File | Function | Issue |
|------|----------|-------|
| `stats.ts:14` | `incrementStrength` | Good |
| `stats.ts:31` | `incrementEndurance` | Good |
| `stats.ts:48` | `incrementDiscipline` | Good |
| `xp.ts:20` | `awardXP` | Good |
| `streaks.ts:14` | `updateStreak` | Inconsistent - should be `incrementStreak` |

---

## 5. COMMENT QUALITY

### 5.1 Missing Documentation

| File | Issue |
|------|-------|
| `/app/lib/rpg/session-integration.ts:1` | No JSDoc for main exported function |
| `/app/lib/rpg/customization.ts:1` | No file-level documentation |
| `/app/components/rpg/Avatar.tsx:1` | Header comment but no prop documentation |

### 5.2 Outdated Comments

| File | Line | Issue |
|------|------|-------|
| `/app/components/rpg/Avatar.tsx:2` | "Wrapper with 2D/3D Toggle" - accurate |
| `/app/components/rpg/AvatarV2.tsx:2` | "Modern Gym Aesthetic" - but component is orphaned |
| `/app/components/rpg/RealisticAvatar.tsx:3` | "AAA Quality" - marketing fluff |

### 5.3 Excessive Section Comments

Multiple files have over-commented sections:
```typescript
// ============================================
// MAIN COMPONENT
// ============================================
```
This appears in RealisticAvatarV2-4.tsx and adds visual noise.

---

## 6. PRIORITIZED CLEANUP LIST

### P0 - Critical (Do First)

1. **Consolidate Avatar Components**
   - Delete: `AvatarV2.tsx`, `RealisticAvatar.tsx`, `RealisticAvatarV2.tsx`, `RealisticAvatarV3.tsx`, `AvatarWithAITextures.tsx`
   - Merge `RealisticAvatarV4.tsx` improvements into `Avatar3D.tsx`
   - Keep only: `Avatar.tsx`, `Avatar2D.tsx`, `Avatar3D.tsx`, `PremiumAvatar.tsx`, `RPMAvatar.tsx`, `VRoidCharacter.tsx`
   - **Estimated reduction: ~2,500 lines, 6 files**

2. **Extract Shared Utilities**
   - Create `/app/lib/rpg/avatar-helpers.ts` with:
     - `calculateBodyMetrics(strength, endurance)`
     - `getColorScheme(schemeName)`
     - `createSkinMaterial(color)`
     - `createClothingMaterial(color)`
   - **Estimated reduction: ~800 lines of duplication**

3. **Create API Auth Middleware**
   - Create `/app/lib/api-auth.ts` with `withAdminAuth()` and `withClientAuth()`
   - Apply to all API routes
   - **Estimated reduction: ~150 lines of duplication**

### P1 - High Priority

4. **Remove Console Statements**
   - Delete all debug console.logs
   - Keep console.error for actual errors only
   - **Files affected: 15+**

5. **Organize Demo Pages**
   - Create `/app/(dev-only)/` route group
   - Move all prototype/demo pages there
   - Add middleware to block in production

6. **Fix Unused Imports**
   - Remove all unused imports identified in section 1.1
   - Add ESLint rule to catch future issues

### P2 - Medium Priority

7. **Standardize Naming**
   - Rename components per section 4.1
   - Update type names per section 4.2

8. **Clean Up Comments**
   - Remove excessive section dividers
   - Add JSDoc to public functions
   - Remove marketing fluff from comments

9. **Consolidate Color Schemes**
   - Create single source of truth in `/app/lib/rpg/themes.ts`
   - Import in all avatar components

### P3 - Low Priority

10. **Optimize Imports**
    - Use path aliases consistently
    - Group imports (React, external, internal)

11. **Add Bundle Analysis**
    - Configure `@next/bundle-analyzer`
    - Monitor Three.js chunk sizes

---

## 7. RECOMMENDED FILE STRUCTURE

```
/app
├── components/
│   └── rpg/
│       ├── AvatarWrapper.tsx          # Main entry (was Avatar.tsx)
│       ├── Avatar2D.tsx               # SVG version
│       ├── Avatar3D.tsx               # Three.js version (merged with V4)
│       ├── AvatarPortrait.tsx         # Premium/SVG portrait
│       ├── integrations/
│       │   ├── ReadyPlayerMeAvatar.tsx
│       │   └── VRoidCharacter.tsx
│       ├── quests/
│       │   ├── QuestCard.tsx
│       │   └── QuestLog.tsx
│       ├── social/
│       │   └── ShareCard.tsx
│       └── profile/
│           └── CharacterCard.tsx
├── lib/
│   ├── rpg/
│   │   ├── avatar-helpers.ts          # NEW: Shared utilities
│   │   ├── avatar-materials.ts        # NEW: Material creators
│   │   ├── themes.ts                  # NEW: Color schemes
│   │   ├── stats.ts
│   │   ├── xp.ts
│   │   ├── levels.ts
│   │   ├── streaks.ts
│   │   ├── customization.ts
│   │   └── session-integration.ts
│   └── api-auth.ts                    # NEW: Auth middleware
└── (dev-only)/                        # NEW: Dev-only routes
    └── prototypes/
        ├── avatar-lab/
        ├── avatar-prototypes/
        └── vroid-demo/
```

---

## 8. BUNDLE SIZE IMPACT

**Estimated Savings After Cleanup:**

| Metric | Current | After Cleanup | Savings |
|--------|---------|---------------|---------|
| Avatar-related files | ~4,500 lines | ~1,500 lines | 67% |
| Component count | 25 | 15 | 40% |
| Three.js components | 7 | 3 | 57% |
| Duplicated logic | ~1,200 lines | 0 | 100% |

---

## Appendix: Quick Reference

### Files to Delete Immediately
```
/app/components/rpg/AvatarV2.tsx
/app/components/rpg/RealisticAvatar.tsx
/app/components/rpg/RealisticAvatarV2.tsx
/app/components/rpg/RealisticAvatarV3.tsx
/app/components/rpg/AvatarWithAITextures.tsx
/app/components/rpg/RPMAvatarViewer.tsx (merge into RPMAvatar.tsx)
```

### Files to Create
```
/app/lib/rpg/avatar-helpers.ts
/app/lib/rpg/avatar-materials.ts
/app/lib/rpg/themes.ts
/app/lib/api-auth.ts
```

### ESLint Rules to Add
```json
{
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "no-console": ["warn", { "allow": ["error"] }],
    "import/no-unused-modules": "error"
  }
}
```

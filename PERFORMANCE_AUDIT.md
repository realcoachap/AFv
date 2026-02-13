# AFv Performance Audit Report

**Date:** 2026-02-13  
**Scope:** `/app/components/rpg/`, `/app/(dashboard)/client/rpg/`, `package.json`  
**Auditor:** Claude (Performance Subagent)

---

## Executive Summary

| Category | Severity | Issues Found |
|----------|----------|--------------|
| Bundle Size | 🟡 Medium | 4 issues |
| Re-render Issues | 🔴 Critical | 6 issues |
| Image Optimization | 🟢 Low | 2 minor issues |
| API Calls | 🟡 Medium | 2 issues |
| Three.js Optimization | 🔴 Critical | 7 issues |

**Overall Rating:** ⚠️ **High Priority - Performance Improvements Needed**

---

## 1. Bundle Size Issues

### 1.1 🟡 Unused Dependencies

**Issue:** `moment` is imported in package.json but `date-fns` is already present and preferred.

```json
// package.json - REMOVE moment
{
  "dependencies": {
    "date-fns": "^4.1.0",  // ✅ Keep this
    "moment": "^2.30.1",   // ❌ Remove - redundant with date-fns
  }
}
```

**Recommendation:** Remove `moment` - it's a 72KB+ library while `date-fns` is tree-shakeable.

### 1.2 🟡 Three.js Import Pattern

**Issue:** Importing entire THREE namespace instead of specific modules.

**File:** `Avatar3D.tsx`, `RealisticAvatar.tsx`, etc.

```typescript
// ❌ Bad - imports entire THREE bundle
import * as THREE from 'three'

// ❌ Bad - creates full geometries on every render
const geometry = new THREE.BufferGeometry()
```

**Recommendation:**
```typescript
// ✅ Good - import only what you need
import { BufferGeometry, BufferAttribute, Points, Color } from 'three'

// ✅ Good - reuse geometries
const particleGeometry = useMemo(() => {
  const geo = new BufferGeometry()
  // ... setup
  return geo
}, [particleCount])
```

### 1.3 🟡 React Three Fiber Duplicated Drei Imports

**Issue:** Multiple `@react-three/drei` component imports causing bundle bloat.

```typescript
// ❌ Multiple imports from same package across files
import { OrbitControls, Environment, ContactShadows, RoundedBox, Sphere, Cylinder, MeshTransmissionMaterial, useTexture } from '@react-three/drei'
```

**Recommendation:** Create a centralized Three.js components barrel export:
```typescript
// app/components/rpg/three/index.ts
export { Canvas, useFrame, useThree } from '@react-three/fiber'
export { OrbitControls, Environment, ContactShadows } from '@react-three/drei'
export * as THREE from 'three'
```

### 1.4 🟡 Multiple Avatar Component Variants

**Issue:** 15+ avatar component variants loading unnecessary code.

**Files:**
- `Avatar.tsx`, `Avatar2D.tsx`, `Avatar3D.tsx`, `AvatarV2.tsx`
- `RealisticAvatar.tsx`, `RealisticAvatarV2.tsx`, `RealisticAvatarV3.tsx`, `RealisticAvatarV4.tsx`
- `PremiumAvatar.tsx`, `RPMAvatar.tsx`, `VRoidCharacter.tsx`, `AvatarWithAITextures.tsx`

**Recommendation:** 
1. Use dynamic imports for versioned avatars
2. Remove unused prototype versions from production builds

```typescript
// ✅ Good - dynamic import
const Avatar3D = dynamic(() => import('./Avatar3D'), { ssr: false })
const RealisticAvatar = dynamic(() => import('./RealisticAvatar'), { ssr: false })
```

---

## 2. Re-render Issues (🔴 CRITICAL)

### 2.1 🔴 Missing useMemo for Expensive Calculations

**File:** `AvatarV2.tsx`, `Avatar2D.tsx`

```typescript
// ❌ Bad - body proportions recalculated on every render
const getBodyProps = () => {
  const base = { shoulderWidth: 44, chestWidth: 38, ... }
  // Complex conditional calculations...
  return { ... }
}

const body = getBodyProps() // New object every render!
```

**Fix:**
```typescript
// ✅ Good - memoize expensive calculations
const body = useMemo(() => {
  const base = { shoulderWidth: 44, chestWidth: 38, ... }
  if (strength >= 75) return { ...base, shoulderWidth: 54, ... }
  if (strength >= 50) return { ...base, shoulderWidth: 50, ... }
  // ... rest of calculations
  return base
}, [strength, endurance, modifiers])
```

### 2.2 🔴 Missing useCallback for Event Handlers

**File:** `QuestLog.tsx`, `QuestCard.tsx`, `ShareCard.tsx`

```typescript
// ❌ Bad - new function on every render
const handleComplete = (questId: string) => {
  // ... logic
}

<button onClick={() => handleComplete(quest.id)} /> // Inline arrow = new function
```

**Fix:**
```typescript
// ✅ Good - memoize callbacks
const handleComplete = useCallback((questId: string) => {
  setQuests(prev => prev.map(q => 
    q.id === questId ? { ...q, isCompleted: true } : q
  ))
}, [setQuests])

// ✅ Good - stable reference
<button onClick={handleComplete} />
```

### 2.3 🔴 Anonymous Components in Render

**File:** `PremiumAvatar.tsx` - Hair rendering

```typescript
// ❌ Bad - component defined inside render
function renderHair(style: string, color: string) {
  const styles: Record<string, React.JSX.Element> = {
    short: <path d="..." />,  // New JSX every call!
    medium: <path d="..." />,
  }
  return styles[style] || styles.short
}
```

**Fix:**
```typescript
// ✅ Good - stable components outside render
const HairStyles = {
  short: React.memo(({ color }: { color: string }) => (
    <path d="..." fill={color} />
  )),
  medium: React.memo(({ color }: { color: string }) => (
    <path d="..." fill={color} />
  )),
}

// Use in component
const HairComponent = HairStyles[style]
return <HairComponent color={hairColor} />
```

### 2.4 🔴 Context-Heavy Inline Styles

**File:** `ShareCard.tsx`

```typescript
// ❌ Bad - new style object every render
<div style={{
  background: `linear-gradient(135deg, ${scheme.bg} 0%, ${adjustBrightness(scheme.bg, 20)} 100%)`,
  boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 100px ${scheme.accent}20`,
}} />
```

**Fix:**
```typescript
// ✅ Good - use CSS variables or memoized styles
const cardStyle = useMemo(() => ({
  background: `linear-gradient(135deg, ${scheme.bg} 0%, ${adjustBrightness(scheme.bg, 20)} 100%)`,
  boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 100px ${scheme.accent}20`,
}), [scheme])

<div style={cardStyle} />
```

### 2.5 🔴 Array Map Without Keys or Memoization

**File:** `RealisticAvatarV4.tsx` (ABS definition)

```typescript
// ❌ Bad - new arrays every render
{[-0.08, 0.08].map((x) =>
  [-0.15, -0.05, 0.05].map((y, i) => (
    <mesh key={`${x}-${i}`} ... /> // Key is unstable
  ))
)}
```

**Fix:**
```typescript
// ✅ Good - memoized position data
const abPositions = useMemo(() => 
  [-0.08, 0.08].flatMap(x => 
    [-0.15, -0.05, 0.05].map((y, i) => ({ x, y, key: `ab-${x}-${i}` }))
  ), []
)

{abPositions.map(({ x, y, key }) => (
  <mesh key={key} position={[x, y, 0.18]} ... />
))}
```

### 2.6 🔴 Filter/Map in Render Without Memoization

**File:** `QuestLog.tsx`

```typescript
// ❌ Bad - filters run on every render
const filteredQuests = activeTab === 'all' 
  ? quests 
  : quests.filter(q => q.type === activeTab)

const stats = {
  total: quests.length,
  completed: quests.filter(q => q.isCompleted).length,
  inProgress: quests.filter(q => !q.isCompleted && q.progress.current > 0).length,
}
```

**Fix:**
```typescript
// ✅ Good - memoize filtered data
const filteredQuests = useMemo(() => 
  activeTab === 'all' ? quests : quests.filter(q => q.type === activeTab)
, [quests, activeTab])

const stats = useMemo(() => ({
  total: quests.length,
  completed: quests.filter(q => q.isCompleted).length,
  inProgress: quests.filter(q => !q.isCompleted && q.progress.current > 0).length,
}), [quests])
```

---

## 3. Image Optimization

### 3.1 🟢 Missing Next.js Image Component

**File:** Multiple avatar components use raw `<img>` or no image optimization

```typescript
// ❌ Not found - no images to optimize
// Most avatars are SVG-based or Three.js rendered
```

**Status:** Not applicable for this codebase (SVG/3D-based avatars)

### 3.2 🟢 Texture Loading Without Optimization

**File:** `AvatarWithAITextures.tsx`

```typescript
// ⚠️ Could be improved - texture loaded without optimization
const diffuseTexture = useMemo(() => {
  const loader = new THREE.TextureLoader()
  const texture = loader.load(diffuseTextureUrl)
  return texture
}, [diffuseTextureUrl])
```

**Recommendation:**
```typescript
// ✅ Add texture compression and caching
import { useTexture } from '@react-three/drei'

// Drei's useTexture handles caching automatically
const diffuseTexture = useTexture(diffuseTextureUrl)

// Configure for performance
diffuseTexture.generateMipmaps = true
DiffuseTexture.minFilter = THREE.LinearMipmapLinearFilter
```

---

## 4. API Calls

### 4.1 🟡 No Request Deduplication

**File:** `QuestLog.tsx` - Uses mock data but will need API integration

```typescript
// ❌ Missing - no React Query or SWR for caching
const [quests, setQuests] = useState<Quest[]>(mockQuests)
```

**Recommendation:**
```typescript
// ✅ Use React Query for caching and deduplication
import { useQuery } from '@tanstack/react-query'

const { data: quests, isLoading } = useQuery({
  queryKey: ['quests', userId],
  queryFn: () => fetchQuests(userId),
  staleTime: 5 * 60 * 1000, // 5 minutes
})
```

### 4.2 🟡 No API Response Caching

**File:** `RPMAvatar.tsx` - External API calls without caching

```typescript
// ❌ No caching for RPM API
useEffect(() => {
  // API call on every mount
}, [avatarId])
```

**Recommendation:**
```typescript
// ✅ Cache avatar URL generation
const avatarUrl = useMemo(() => {
  if (avatarId) {
    return `${RPM_CONFIG.quickAvatarUrl}/${avatarId}.glb`
  }
  // ... generation logic
}, [avatarId, customization, strength])
```

---

## 5. Three.js Optimization (🔴 CRITICAL)

### 5.1 🔴 Missing Geometry Disposal

**File:** `Avatar3D.tsx` - AuraParticles

```typescript
// ❌ Critical - geometries not disposed
const geometry = useMemo(() => {
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(particles.positions, 3))
  return geo
}, [particles])
```

**Fix:**
```typescript
// ✅ Proper disposal
const geometry = useMemo(() => {
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(particles.positions, 3))
  return geo
}, [particles])

// Add cleanup
useEffect(() => {
  return () => {
    geometry.dispose()
    material.dispose()
  }
}, [geometry, material])
```

### 5.2 🔴 Scene Cloning Without Cleanup

**File:** `VRoidCharacter.tsx`

```typescript
// ❌ Critical - cloned scene never disposed
const clonedScene = scene.clone()
```

**Fix:**
```typescript
// ✅ Cleanup cloned scenes
useEffect(() => {
  return () => {
    clonedScene.traverse((child) => {
      if (child.isMesh) {
        child.geometry?.dispose()
        child.material?.dispose()
      }
    })
  }
}, [clonedScene])
```

### 5.3 🔴 Materials Recreated Every Frame

**File:** `RealisticAvatarV4.tsx`

```typescript
// ❌ Bad - new material every render (using <primitive>)
<mesh castShadow>
  <capsuleGeometry args={[0.28, 0.45, 8, 16]} />
  <primitive object={shirtMat} attach="material" />
</mesh>
```

**Fix:**
```typescript
// ✅ Reuse materials with useMemo
const materials = useMemo(() => ({
  skin: createSkinMaterial(skinColor),
  shirt: createClothingMaterial(shirtColor),
  accent: createAccentMaterial(accentColor),
}), [skinColor, shirtColor, accentColor])

// In render
<mesh material={materials.shirt} castShadow>
  <capsuleGeometry args={[0.28, 0.45, 8, 16]} />
</mesh>
```

### 5.4 🔴 No Instancing for Repeated Meshes

**File:** `RealisticAvatar.tsx` - AuraEffect particles

```typescript
// ❌ Bad - individual points without instancing
<points ref={particlesRef}>
  <bufferGeometry>...</bufferGeometry>
  <pointsMaterial ... />
</points>
```

**Recommendation:** For high particle counts, use `THREE.InstancedMesh` or `@react-three/drei`'s `Instances` component.

### 5.5 🔴 Continuous useFrame Animations

**File:** Multiple components

```typescript
// ❌ Bad - animation runs even when not visible
useFrame((state) => {
  if (groupRef.current) {
    const breathe = Math.sin(state.clock.elapsedTime * 0.8) * 0.006
    groupRef.current.position.y = -0.8 + breathe
  }
})
```

**Fix:**
```typescript
// ✅ Pause animation when off-screen
const [isVisible, setIsVisible] = useState(true)
const { viewport } = useThree()

useFrame((state) => {
  if (!isVisible || !groupRef.current) return
  
  const breathe = Math.sin(state.clock.elapsedTime * 0.8) * 0.006
  groupRef.current.position.y = -0.8 + breathe
})

// Use IntersectionObserver or frustum culling
```

### 5.6 🔴 High-Resolution Shadows Without Optimization

**File:** `RealisticAvatarV4.tsx`

```typescript
// ❌ High shadow resolution impacts performance
<spotLight
  castShadow
  shadow-mapSize-width={2048}
  shadow-mapSize-height={2048}
/>
```

**Recommendation:**
```typescript
// ✅ Adaptive shadow resolution based on device
const shadowMapSize = useMemo(() => {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  return isMobile ? 1024 : 2048
}, [])

<spotLight
  castShadow
  shadow-mapSize-width={shadowMapSize}
  shadow-mapSize-height={shadowMapSize}
/>
```

### 5.7 🔴 Post-Processing Effects Without Performance Check

**File:** `RealisticAvatarV4.tsx`

```typescript
// ❌ Heavy post-processing always enabled
<EffectComposer>
  <Bloom intensity={0.06} ... />
  <SSAO samples={16} ... />
</EffectComposer>
```

**Recommendation:**
```typescript
// ✅ Conditionally enable post-processing
const isMobile = useMemo(() => /iPhone|iPad|iPod|Android/i.test(navigator.userAgent), [])

{!isMobile && (
  <EffectComposer>
    <Bloom intensity={0.06} luminanceThreshold={0.92} />
    {!isMobile && <SSAO samples={8} ... />} // Skip on mobile
  </EffectComposer>
)}
```

---

## Quick Wins Priority List

1. **🔴 CRITICAL - Fix memory leaks:**
   - Add geometry/material disposal in all Three.js components
   - Fix `scene.clone()` cleanup in VRoidCharacter

2. **🔴 CRITICAL - Fix re-renders:**
   - Add `useMemo` to body calculations in AvatarV2/Avatar2D
   - Add `useCallback` to event handlers in QuestCard/QuestLog

3. **🟡 MEDIUM - Reduce bundle size:**
   - Remove `moment` dependency
   - Implement dynamic imports for avatar variants

4. **🟡 MEDIUM - Optimize Three.js:**
   - Memoize materials properly
   - Disable post-processing on mobile
   - Reduce shadow resolution on mobile

5. **🟢 LOW - Add data caching:**
   - Integrate React Query for API calls
   - Add SWR for avatar URL caching

---

## Code Examples

### Optimized AvatarV2 Component
```typescript
'use client'

import { useMemo, useCallback } from 'react'
import { getStatModifiers } from '@/app/lib/rpg/stats'

export default function AvatarV2({
  strength,
  endurance,
  discipline,
  config = {},
  size = 'lg',
}: AvatarProps) {
  const modifiers = useMemo(() => 
    getStatModifiers(strength, endurance, discipline)
  , [strength, endurance, discipline])

  // ✅ Memoized body proportions
  const body = useMemo(() => {
    const base = { shoulderWidth: 44, chestWidth: 38, ... }
    // ... calculations based on strength/endurance
    return calculatedBody
  }, [strength, endurance, modifiers])

  // ✅ Memoized colors
  const scheme = useMemo(() => 
    colors[config.colorScheme as keyof typeof colors] || colors.navy
  , [config.colorScheme])

  // ✅ Memoized hair rendering
  const hairElement = useMemo(() => renderHair(config.hairStyle), [config.hairStyle])

  // ... rest of component
}
```

### Optimized Three.js Material Pattern
```typescript
const materials = useMemo(() => {
  const skinMat = new THREE.MeshPhysicalMaterial({
    color: skinColor,
    roughness: 0.45,
    // ... other props
  })
  
  const shirtMat = new THREE.MeshPhysicalMaterial({
    color: shirtColor,
    roughness: 0.6,
  })
  
  return { skin: skinMat, shirt: shirtMat }
}, [skinColor, shirtColor])

// Cleanup
useEffect(() => {
  return () => {
    Object.values(materials).forEach(mat => mat.dispose())
  }
}, [materials])
```

---

## Appendix: Dependency Analysis

| Package | Version | Size | Used | Recommendation |
|---------|---------|------|------|----------------|
| three | 0.182.0 | ~600KB | ✅ Yes | Keep |
| @react-three/fiber | 9.5.0 | ~100KB | ✅ Yes | Keep |
| @react-three/drei | 10.7.7 | ~500KB | ✅ Yes | Keep (tree-shake) |
| @react-three/postprocessing | 3.0.4 | ~200KB | ✅ Yes | Lazy load |
| moment | 2.30.1 | ~72KB | ❌ No | Remove |
| date-fns | 4.1.0 | ~20KB | ✅ Yes | Keep |
| mannequin-js | 5.2.3 | ~50KB | ⚠️ Verify | Check usage |

---

*End of Performance Audit Report*

# RealisticAvatarV4 Crash Analysis

## Root Cause

The component crashes due to **multiple issues** related to the `EffectComposer`/`SSAO` configuration and missing prop propagation.

## Issues Found

### Issue 1: SSAO Missing Normal Pass (CRITICAL)
**File:** `/home/coachap/.openclaw/workspace/AFv/app/components/rpg/RealisticAvatarV4.tsx`
**Line:** 633-642

The `SSAO` effect requires a normal buffer to calculate ambient occlusion, but the `EffectComposer` doesn't have `enableNormalPass` enabled. This causes the SSAO effect to crash when trying to access the undefined normal buffer.

**Current Code (lines 633-642):**
```tsx
<EffectComposer>
  <Bloom 
    intensity={0.06}
    luminanceThreshold={0.92}
    luminanceSmoothing={0.4}
    height={300}
  />
  <SSAO 
    samples={16}
    radius={0.5}
    intensity={8}
    luminanceInfluence={0.5}
  />
</EffectComposer>
```

**Fix:**
```tsx
<EffectComposer enableNormalPass>
  <Bloom 
    intensity={0.06}
    luminanceThreshold={0.92}
    luminanceSmoothing={0.4}
    height={300}
  />
  <SSAO 
    samples={16}
    radius={0.5}
    intensity={8}
    luminanceInfluence={0.5}
  />
</EffectComposer>
```

---

### Issue 2: Missing `isMobile` Prop Propagation
**File:** `/home/coachap/.openclaw/workspace/AFv/app/components/rpg/RealisticAvatarV4.tsx`
**Lines:** 612-622 (Character component call)

The `Character` component receives `isMobile` but doesn't pass it to any child components (`Head`, `Torso`, `Arm`, `Leg`), causing them to always use desktop geometry settings.

**Current Code (lines 612-622):**
```tsx
<Character 
  strength={strength}
  endurance={endurance}
  discipline={discipline}
  level={level}
  colorScheme={colorScheme}
  customization={customization}
  isMobile={isMobile}
/>
```

**Character component (lines 480-507)** doesn't pass `isMobile` to child components:
```tsx
function Character({
  // ... props including isMobile = false
}: {...}) {
  // ...
  return (
    <group ref={groupRef}>
      <Head 
        skinColor={skinColor}
        hairStyle={customization?.hairStyle || 'short'}
        hairColor={customization?.hairColor || '#2c1810'}
        eyeColor={customization?.eyeColor || '#4a3728'}
        discipline={discipline}
        // MISSING: isMobile={isMobile}
      />
      <Torso 
        strength={strength}
        endurance={endurance}
        shirtColor={scheme.shirt}
        accentColor={scheme.accent}
        skinColor={skinColor}
        // MISSING: isMobile={isMobile}
      />
      <Arm side="left" strength={strength} shirtColor={scheme.shirt} skinColor={skinColor} />
      // MISSING: isMobile={isMobile}
      <Arm side="right" strength={strength} shirtColor={scheme.shirt} skinColor={skinColor} />
      // MISSING: isMobile={isMobile}
      <Leg side="left" strength={strength} shortsColor={scheme.shorts} skinColor={skinColor} />
      // MISSING: isMobile={isMobile}
      <Leg side="right" strength={strength} shortsColor={scheme.shorts} skinColor={skinColor} />
      // MISSING: isMobile={isMobile}
    </group>
  )
}
```

**Fix:** Pass `isMobile` to all child components in the Character component.

---

### Issue 3: Material Disposal Pattern Issues
**File:** `/home/coachap/.openclaw/workspace/AFv/app/components/rpg/RealisticAvatarV4.tsx`
**Lines:** 104-109, 232-238, 320-325, 401-406

Each body part component creates materials with `useMemo` and disposes them in `useEffect` cleanup. In React Strict Mode (default in development), components are mounted/unmounted/remounted, which can cause:
1. Materials to be disposed after first unmount
2. The same material reference returned by useMemo on remount (since deps haven't changed)
3. Attempting to render with disposed materials = crash

**Example from Head component (lines 104-109):**
```tsx
const skinMat = useMemo(() => createSkinMaterial(skinColor), [skinColor])
// ...
useEffect(() => {
  return () => {
    skinMat.dispose()
    hairMat.dispose()
  }
}, [skinMat, hairMat])
```

**Fix:** Either:
1. Remove the disposal useEffect and let Three.js handle cleanup
2. Or use unique keys that change on each creation to force new materials
3. Or don't dispose materials that are cached by useMemo

Recommended fix - remove the disposal effects:
```tsx
// REMOVE these useEffect blocks entirely:
// useEffect(() => {
//   return () => {
//     skinMat.dispose()
//     hairMat.dispose()
//   }
// }, [skinMat, hairMat])
```

---

### Issue 4: Unused Hook Import
**File:** `/home/coachap/.openclaw/workspace/AFv/app/components/rpg/RealisticAvatarV4.tsx`
**Line:** 58-76

The `useMaterials` hook is defined but never used. Each body part creates its own materials instead. This is not a crash issue but indicates incomplete refactoring.

**Fix:** Either:
1. Remove the unused `useMaterials` hook
2. Or refactor body parts to use the shared `useMaterials` hook

---

## Summary of Fixes Required

| Issue | File | Line(s) | Severity | Fix |
|-------|------|---------|----------|-----|
| 1. Missing `enableNormalPass` | RealisticAvatarV4.tsx | 633 | **CRITICAL** | Add `enableNormalPass` to EffectComposer |
| 2. Missing `isMobile` propagation | RealisticAvatarV4.tsx | 493-507 | MEDIUM | Pass `isMobile` to Head, Torso, Arm, Leg |
| 3. Material disposal bug | RealisticAvatarV4.tsx | 104-109, 232-238, etc. | MEDIUM | Remove disposal useEffects |
| 4. Unused hook | RealisticAvatarV4.tsx | 58-76 | LOW | Remove or use `useMaterials` |

## Recommended Fix Order

1. **First priority:** Add `enableNormalPass` to EffectComposer - this is most likely the immediate crash cause
2. **Second priority:** Fix `isMobile` propagation for proper mobile rendering
3. **Third priority:** Remove material disposal effects to prevent React Strict Mode crashes

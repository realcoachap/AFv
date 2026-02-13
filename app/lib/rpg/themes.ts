/**
 * RPG Themes - Single source of truth for all color schemes
 * Used across 10+ avatar components and pages
 */

// Core color schemes for avatar components
export const COLOR_SCHEMES = {
  navy: {
    shirt: '#1e3a5f',
    shorts: '#152a45',
    accent: '#4a9eff',
    primary: '#1A2332',
    secondary: '#E8DCC4',
  },
  crimson: {
    shirt: '#7c1d1d',
    shorts: '#5c1515',
    accent: '#ff6b6b',
    primary: '#5c1a1a',
    secondary: '#7a2424',
  },
  emerald: {
    shirt: '#064e3b',
    shorts: '#043d2e',
    accent: '#4ade80',
    primary: '#0d3328',
    secondary: '#1a4d3a',
  },
  gold: {
    shirt: '#78350f',
    shorts: '#5c280b',
    accent: '#fbbf24',
    primary: '#4a3d1a',
    secondary: '#6b5a24',
  },
  void: {
    shirt: '#1a1a2e',
    shorts: '#12121f',
    accent: '#a855f7',
    primary: '#1a1a2e',
    secondary: '#252542',
  },
  // Legacy schemes for backward compatibility
  black: {
    shirt: '#000000',
    shorts: '#1a1a1a',
    accent: '#FF0000',
    primary: '#000000',
    secondary: '#FFFFFF',
  },
  red: {
    shirt: '#DC2626',
    shorts: '#991B1B',
    accent: '#991B1B',
    primary: '#DC2626',
    secondary: '#FEE2E2',
  },
  blue: {
    shirt: '#2563EB',
    shorts: '#1E40AF',
    accent: '#1E40AF',
    primary: '#2563EB',
    secondary: '#DBEAFE',
  },
  green: {
    shirt: '#059669',
    shorts: '#047857',
    accent: '#047857',
    primary: '#059669',
    secondary: '#D1FAE5',
  },
  purple: {
    shirt: '#7C3AED',
    shorts: '#6D28D9',
    accent: '#6D28D9',
    primary: '#7C3AED',
    secondary: '#EDE9FE',
  },
  orange: {
    shirt: '#EA580C',
    shorts: '#C2410C',
    accent: '#C2410C',
    primary: '#EA580C',
    secondary: '#FED7AA',
  },
} as const

export type ColorSchemeKey = keyof typeof COLOR_SCHEMES
export type ColorScheme = (typeof COLOR_SCHEMES)[ColorSchemeKey]

/**
 * Get a color scheme by key with fallback to navy
 */
export function getColorScheme(scheme: string): ColorScheme {
  return COLOR_SCHEMES[scheme as ColorSchemeKey] || COLOR_SCHEMES.navy
}

/**
 * Get badge color based on level
 */
export function getLevelBadgeColor(level: number): string {
  if (level >= 30) return '#a855f7' // Legendary - purple
  if (level >= 20) return '#fbbf24' // Epic - gold
  if (level >= 10) return '#3b82f6' // Rare - blue
  if (level >= 5) return '#22c55e'  // Uncommon - green
  return '#6b7280'                   // Common - gray
}

/**
 * Get title based on average stats
 */
export function getStatTitle(avgStats: number): string {
  if (avgStats >= 80) return 'Legend'
  if (avgStats >= 60) return 'Elite'
  if (avgStats >= 40) return 'Warrior'
  if (avgStats >= 20) return 'Athlete'
  return 'Novice'
}

/**
 * RPG color tokens for consistent UI theming
 */
export const RPG_TOKENS = {
  stats: {
    strength: '#ef4444',
    endurance: '#3b82f6',
    discipline: '#eab308',
  },
  rarity: {
    common: '#6b7280',
    uncommon: '#22c55e',
    rare: '#3b82f6',
    epic: '#fbbf24',
    legendary: '#a855f7',
  },
  ui: {
    background: '#1A2332',
    surface: '#2a3342',
    text: '#E8DCC4',
    textMuted: '#9ca3af',
  },
} as const

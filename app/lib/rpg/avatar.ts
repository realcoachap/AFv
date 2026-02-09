/**
 * RPG Avatar System
 * Handles avatar customization, evolution, and visual config
 */

import { getStatModifiers } from './stats'

export type AvatarConfig = {
  // Basic customization
  bodyType: 'lean' | 'athletic' | 'strong'
  skinTone: 'light' | 'medium' | 'tan' | 'brown' | 'dark' | 'ebony'
  gender: 'male' | 'female' | 'neutral'
  
  // Outfit
  outfit: string // 'default', 'tank', 'tee', 'jacket', 'hoodie', 'compression'
  colorScheme: string // 'navy', 'black', 'red', 'blue', 'purple', 'green'
  
  // Hair
  hairStyle: string // 'short', 'medium', 'long', 'bald', 'ponytail', 'bun'
  hairColor: string // 'black', 'brown', 'blonde', 'red', 'gray', 'custom'
  
  // Accessories (unlocked at higher levels)
  accessories: {
    headband?: boolean
    wristbands?: boolean
    watch?: boolean
    belt?: boolean
    shoes?: string // 'sneakers', 'lifting-shoes', 'running-shoes'
  }
  
  // Advanced (unlocked at higher levels)
  pose?: 'neutral' | 'flex' | 'running' | 'lifting'
  effects?: {
    aura?: boolean // From discipline stat
    glow?: boolean
    particles?: 'none' | 'sparkle' | 'fire' | 'lightning'
  }
}

/**
 * Default avatar configuration for new users
 */
export function getDefaultAvatarConfig(gender: 'male' | 'female' | 'neutral' = 'neutral'): AvatarConfig {
  return {
    bodyType: 'athletic',
    skinTone: 'medium',
    gender,
    outfit: 'default',
    colorScheme: 'navy',
    hairStyle: 'short',
    hairColor: 'brown',
    accessories: {},
    pose: 'neutral',
    effects: {
      particles: 'none',
    },
  }
}

/**
 * Get available customization options based on level
 */
export function getAvailableCustomization(level: number) {
  return {
    // Always available
    bodyTypes: ['lean', 'athletic', 'strong'],
    skinTones: ['light', 'medium', 'tan', 'brown', 'dark', 'ebony'],
    genders: ['male', 'female', 'neutral'],
    
    // Outfits unlock progressively
    outfits: [
      { id: 'default', name: 'Basic Tee', minLevel: 1 },
      { id: 'tank', name: 'Tank Top', minLevel: 1 },
      { id: 'tee', name: 'Fitted Tee', minLevel: 3 },
      { id: 'compression', name: 'Compression Shirt', minLevel: 5 },
      { id: 'jacket', name: 'Athletic Jacket', minLevel: 8 },
      { id: 'hoodie', name: 'Performance Hoodie', minLevel: 10 },
      { id: 'elite-tee', name: 'Elite Tee', minLevel: 15 },
      { id: 'legendary-jacket', name: 'Legendary Jacket', minLevel: 20 },
    ].filter((o) => o.minLevel <= level),
    
    // Color schemes
    colorSchemes: [
      { id: 'navy', name: 'Navy Blue', minLevel: 1 },
      { id: 'black', name: 'Classic Black', minLevel: 1 },
      { id: 'red', name: 'Power Red', minLevel: 3 },
      { id: 'blue', name: 'Electric Blue', minLevel: 3 },
      { id: 'purple', name: 'Royal Purple', minLevel: 5 },
      { id: 'green', name: 'Emerald Green', minLevel: 5 },
      { id: 'gold', name: 'Champion Gold', minLevel: 15 },
      { id: 'platinum', name: 'Platinum', minLevel: 20 },
    ].filter((c) => c.minLevel <= level),
    
    // Hair styles
    hairStyles: [
      { id: 'short', name: 'Short', minLevel: 1 },
      { id: 'medium', name: 'Medium', minLevel: 1 },
      { id: 'long', name: 'Long', minLevel: 1 },
      { id: 'bald', name: 'Bald/Shaved', minLevel: 1 },
      { id: 'ponytail', name: 'Ponytail', minLevel: 1 },
      { id: 'bun', name: 'Top Bun', minLevel: 3 },
      { id: 'fade', name: 'Fade', minLevel: 5 },
      { id: 'mohawk', name: 'Mohawk', minLevel: 10 },
    ].filter((h) => h.minLevel <= level),
    
    // Accessories
    accessories: {
      headband: level >= 5,
      wristbands: level >= 5,
      watch: level >= 8,
      belt: level >= 10,
      shoes: level >= 5,
    },
    
    // Advanced features
    poses: level >= 10 ? ['neutral', 'flex', 'running', 'lifting'] : ['neutral'],
    effects: {
      aura: level >= 10,
      glow: level >= 15,
      particles: level >= 20,
    },
  }
}

/**
 * Apply stat-based modifications to avatar config
 * This happens automatically based on Strength/Endurance/Discipline
 */
export function applyStatModifiers(
  config: AvatarConfig,
  strength: number,
  endurance: number,
  discipline: number
): AvatarConfig {
  const modifiers = getStatModifiers(strength, endurance, discipline)
  
  // Clone config to avoid mutation
  const modified = { ...config }
  
  // Body type shifts based on strength vs endurance
  if (strength > endurance + 20) {
    modified.bodyType = 'strong' // High strength = muscular
  } else if (endurance > strength + 20) {
    modified.bodyType = 'lean' // High endurance = lean runner
  } else {
    modified.bodyType = 'athletic' // Balanced = athletic
  }
  
  // Add aura effect based on discipline
  if (!modified.effects) modified.effects = {}
  modified.effects.aura = discipline >= 25
  modified.effects.glow = discipline >= 50
  
  return modified
}

/**
 * Validate avatar config (ensure no locked items are equipped)
 */
export function validateAvatarConfig(config: AvatarConfig, level: number): boolean {
  const available = getAvailableCustomization(level)
  
  // Check outfit
  const outfitUnlocked = available.outfits.some((o) => o.id === config.outfit)
  if (!outfitUnlocked) return false
  
  // Check color scheme
  const colorUnlocked = available.colorSchemes.some((c) => c.id === config.colorScheme)
  if (!colorUnlocked) return false
  
  // Check hair style
  const hairUnlocked = available.hairStyles.some((h) => h.id === config.hairStyle)
  if (!hairUnlocked) return false
  
  // Check accessories
  if (config.accessories) {
    if (config.accessories.headband && !available.accessories.headband) return false
    if (config.accessories.wristbands && !available.accessories.wristbands) return false
    if (config.accessories.watch && !available.accessories.watch) return false
    if (config.accessories.belt && !available.accessories.belt) return false
  }
  
  return true
}

/**
 * Get avatar preview URL (placeholder - will render SVG in component)
 */
export function getAvatarPreviewData(
  config: AvatarConfig,
  strength: number,
  endurance: number,
  discipline: number
) {
  const finalConfig = applyStatModifiers(config, strength, endurance, discipline)
  const modifiers = getStatModifiers(strength, endurance, discipline)
  
  return {
    config: finalConfig,
    modifiers,
    // SVG will be rendered by Avatar component
  }
}

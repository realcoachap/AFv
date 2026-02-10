/**
 * Avatar Customization Options & Logic
 */

export type AvatarCustomization = {
  skinTone: string
  hairStyle: string
  hairColor: string
  facialHair: string
  eyeColor: string
  outfit: string
  colorScheme: string
}

// Default customization
export const DEFAULT_CUSTOMIZATION: AvatarCustomization = {
  skinTone: '#F0D0B0',
  hairStyle: 'short',
  hairColor: '#2C1810',
  facialHair: 'clean',
  eyeColor: '#4A3728',
  outfit: 'tee',
  colorScheme: 'navy',
}

// Skin tone options
export const SKIN_TONES = [
  { id: 'light', name: 'Light', color: '#F0D0B0' },
  { id: 'fair', name: 'Fair', color: '#E8C4A0' },
  { id: 'medium', name: 'Medium', color: '#D4A574' },
  { id: 'tan', name: 'Tan', color: '#C68642' },
  { id: 'brown', name: 'Brown', color: '#8D5524' },
  { id: 'dark', name: 'Dark', color: '#5C3317' },
  // Unlockable fantasy tones (level 25+)
  { id: 'gold', name: 'Golden', color: '#FFD700', requiresLevel: 25 },
  { id: 'silver', name: 'Silver', color: '#C0C0C0', requiresLevel: 30 },
]

// Hair styles
export const HAIR_STYLES = [
  { id: 'short', name: 'Short', requiresLevel: 1 },
  { id: 'buzz', name: 'Buzz Cut', requiresLevel: 1 },
  { id: 'bald', name: 'Bald', requiresLevel: 1 },
  { id: 'medium', name: 'Medium', requiresLevel: 1 },
  { id: 'long', name: 'Long', requiresLevel: 5 },
  { id: 'mohawk', name: 'Mohawk', requiresLevel: 10 },
  { id: 'afro', name: 'Afro', requiresLevel: 10 },
  { id: 'dreads', name: 'Dreads', requiresLevel: 15 },
  { id: 'ponytail', name: 'Ponytail', requiresLevel: 15 },
  { id: 'spiky', name: 'Spiky', requiresLevel: 20 },
]

// Hair colors
export const HAIR_COLORS = [
  { id: 'black', name: 'Black', color: '#2C1810' },
  { id: 'brown', name: 'Brown', color: '#4E3629' },
  { id: 'blonde', name: 'Blonde', color: '#F4E4C1' },
  { id: 'red', name: 'Red', color: '#A52A2A' },
  { id: 'gray', name: 'Gray', color: '#808080' },
  { id: 'white', name: 'White', color: '#F5F5F5' },
  // Fun colors (unlock at higher levels)
  { id: 'blue', name: 'Blue', color: '#4169E1', requiresLevel: 20 },
  { id: 'green', name: 'Green', color: '#00FF00', requiresLevel: 20 },
  { id: 'purple', name: 'Purple', color: '#9370DB', requiresLevel: 25 },
  { id: 'pink', name: 'Pink', color: '#FF69B4', requiresLevel: 25 },
]

// Facial hair options
export const FACIAL_HAIR = [
  { id: 'clean', name: 'Clean Shaven' },
  { id: 'stubble', name: 'Stubble' },
  { id: 'goatee', name: 'Goatee' },
  { id: 'beard', name: 'Full Beard' },
  { id: 'mustache', name: 'Mustache' },
  { id: 'van-dyke', name: 'Van Dyke' },
]

// Eye colors
export const EYE_COLORS = [
  { id: 'brown', name: 'Brown', color: '#4A3728' },
  { id: 'blue', name: 'Blue', color: '#4169E1' },
  { id: 'green', name: 'Green', color: '#00A86B' },
  { id: 'hazel', name: 'Hazel', color: '#8E7618' },
  { id: 'gray', name: 'Gray', color: '#708090' },
  { id: 'amber', name: 'Amber', color: '#FFBF00' },
]

// Outfit options
export const OUTFITS = [
  { id: 'tee', name: 'T-Shirt', requiresLevel: 1 },
  { id: 'tank', name: 'Tank Top', requiresLevel: 1 },
  { id: 'compression', name: 'Compression Shirt', requiresLevel: 10 },
  { id: 'hoodie', name: 'Hoodie', requiresLevel: 15 },
  { id: 'jersey', name: 'Jersey', requiresLevel: 20 },
  { id: 'muscle', name: 'Muscle Tee', requiresLevel: 25 },
]

// Color schemes (shirt color basically)
export const COLOR_SCHEMES = [
  { id: 'navy', name: 'Navy Blue', primary: '#1A2332', secondary: '#E8DCC4', accent: '#00D9FF' },
  { id: 'black', name: 'Black', primary: '#000000', secondary: '#FFFFFF', accent: '#FF0000' },
  { id: 'red', name: 'Red', primary: '#DC2626', secondary: '#FEE2E2', accent: '#991B1B' },
  { id: 'blue', name: 'Blue', primary: '#2563EB', secondary: '#DBEAFE', accent: '#1E40AF' },
  { id: 'green', name: 'Green', primary: '#059669', secondary: '#D1FAE5', accent: '#047857', requiresLevel: 10 },
  { id: 'purple', name: 'Purple', primary: '#7C3AED', secondary: '#EDE9FE', accent: '#6D28D9', requiresLevel: 15 },
  { id: 'orange', name: 'Orange', primary: '#EA580C', secondary: '#FED7AA', accent: '#C2410C', requiresLevel: 20 },
]

// Helper: Get available options based on level
export function getAvailableOptions<T extends { requiresLevel?: number }>(
  options: T[],
  level: number
): T[] {
  return options.filter(opt => !opt.requiresLevel || level >= opt.requiresLevel)
}

// Helper: Check if option is unlocked
export function isOptionUnlocked(requiresLevel: number | undefined, currentLevel: number): boolean {
  if (!requiresLevel) return true
  return currentLevel >= requiresLevel
}

// Helper: Parse avatarConfig JSON safely
export function parseAvatarConfig(config: any): AvatarCustomization {
  if (!config || typeof config !== 'object') {
    return DEFAULT_CUSTOMIZATION
  }
  
  return {
    skinTone: config.skinTone || DEFAULT_CUSTOMIZATION.skinTone,
    hairStyle: config.hairStyle || DEFAULT_CUSTOMIZATION.hairStyle,
    hairColor: config.hairColor || DEFAULT_CUSTOMIZATION.hairColor,
    facialHair: config.facialHair || DEFAULT_CUSTOMIZATION.facialHair,
    eyeColor: config.eyeColor || DEFAULT_CUSTOMIZATION.eyeColor,
    outfit: config.outfit || DEFAULT_CUSTOMIZATION.outfit,
    colorScheme: config.colorScheme || DEFAULT_CUSTOMIZATION.colorScheme,
  }
}

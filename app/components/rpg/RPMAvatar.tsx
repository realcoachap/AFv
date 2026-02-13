'use client'

/**
 * Ready Player Me Avatar Integration
 * Realistic 3D avatars with RPG stat effects
 * Includes Three.js GLB loading support from RPMAvatarViewer
 */

import { useEffect, useMemo, useRef, useState, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, OrbitControls, Environment, ContactShadows, Center } from '@react-three/drei'
import * as THREE from 'three'

// RPM Avatar configuration
const RPM_CONFIG = {
  // Base URL for avatar generation
  avatarBaseUrl: 'https://api.readyplayer.me/v1/avatars',
  // Quick avatar generation endpoint
  quickAvatarUrl: 'https://models.readyplayer.me',
  // Default avatar ID (can be customized)
  defaultAvatarId: '6489a5f1c6b3f2d4e7a1b2c3', // Placeholder - we'll generate dynamically
}

// Avatar style presets based on stats
type AvatarStyle = {
  bodyType: 'slim' | 'average' | 'athletic' | 'muscular'
  outfit: string
  colors: {
    shirt: string
    pants: string
    shoes: string
  }
}

type RPMAvatarProps = {
  // User's avatar ID from RPM (if they've created one)
  avatarId?: string
  // Or generate from customization
  customization?: {
    skinTone: string
    hairStyle: string
    hairColor: string
    outfit: string
    colorScheme: string
  }
  // RPG Stats for visual effects
  level: number
  strength: number
  endurance: number
  discipline: number
  // Display options
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showAura?: boolean
  autoRotate?: boolean
  // Callback when avatar loads
  onLoad?: () => void
}

export default function RPMAvatar({
  avatarId,
  customization,
  level,
  strength,
  endurance,
  discipline,
  size = 'lg',
  showAura = true,
  autoRotate = false,
  onLoad,
}: RPMAvatarProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Calculate visual effects based on stats
  const visualEffects = calculateVisualEffects(strength, endurance, discipline, level)

  // Generate avatar URL
  const avatarUrl = useMemo(() => {
    if (avatarId) {
      // Use existing avatar
      return `${RPM_CONFIG.quickAvatarUrl}/${avatarId}.glb`
    }
    
    // Generate quick avatar with customization
    // RPM supports URL params for quick generation
    const params = new URLSearchParams({
      ...(customization?.hairStyle && { hairStyle: mapHairStyle(customization.hairStyle) }),
      ...(customization?.outfit && { outfit: mapOutfit(customization.outfit) }),
      bodyType: getBodyType(strength),
    })
    
    // For now, use a demo avatar - in production this would call RPM API
    return `https://models.readyplayer.me/6489a5f1c6b3f2d4e7a1b2c3.glb?${params.toString()}`
  }, [avatarId, customization, strength])

  // Size configurations
  const sizes = {
    sm: { width: 200, height: 250 },
    md: { width: 300, height: 375 },
    lg: { width: 400, height: 500 },
    xl: { width: 500, height: 625 },
  }

  const { width, height } = sizes[size]

  useEffect(() => {
    // Subscribe to RPM events
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.source === 'readyplayerme') {
        switch (event.data.eventName) {
          case 'v1.avatar.loaded':
            setIsLoading(false)
            onLoad?.()
            break
          case 'v1.frame.ready':
            // Frame is ready to receive commands
            break
        }
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [onLoad])

  return (
    <div 
      className="relative"
      style={{ width, height }}
    >
      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 rounded-xl z-10">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400 text-sm">Loading Avatar...</p>
          </div>
        </div>
      )}

      {/* Aura effect for high discipline */}
      {showAura && discipline > 40 && (
        <div 
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            background: `radial-gradient(circle at center, ${visualEffects.auraColor}40 0%, transparent 60%)`,
            filter: 'blur(30px)',
            animation: 'pulse 2s ease-in-out infinite',
          }}
        />
      )}

      {/* RPM Avatar Viewer */}
      <div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-b from-gray-800 to-gray-900">
        <iframe
          ref={iframeRef}
          src={`https://readyplayer.me/avatar?frameApi&transparent=true&${visualEffects.urlParams}`}
          className="w-full h-full border-0"
          allow="camera *; microphone *"
          onLoad={() => setTimeout(() => setIsLoading(false), 2000)}
        />

        {/* Stats overlay */}
        <div className="absolute bottom-4 left-4 right-4 z-20">
          <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-bold">Level {level}</span>
              <span className="text-purple-400 text-sm">
                {visualEffects.title}
              </span>
            </div>
            
            {/* Power bars */}
            <div className="space-y-1.5">
              <StatBar label="STR" value={strength} color="#FF6B6B" />
              <StatBar label="END" value={endurance} color="#4ECDC4" />
              <StatBar label="DIS" value={discipline} color="#FFE66D" />
            </div>
          </div>
        </div>

        {/* Glow border for high level */}
        {level >= 20 && (
          <div 
            className="absolute inset-0 pointer-events-none z-10 rounded-xl"
            style={{
              boxShadow: `inset 0 0 30px ${visualEffects.borderColor}, 0 0 30px ${visualEffects.borderColor}`,
            }}
          />
        )}
      </div>
    </div>
  )
}

// Helper: Calculate visual effects based on stats
function calculateVisualEffects(
  strength: number,
  endurance: number,
  discipline: number,
  level: number
) {
  const avgStats = (strength + endurance + discipline) / 3
  
  // Aura color based on discipline
  let auraColor = 'rgba(100, 100, 100, 0.3)'
  if (discipline >= 80) auraColor = 'rgba(168, 85, 247, 0.5)' // Legendary purple
  else if (discipline >= 60) auraColor = 'rgba(255, 215, 0, 0.4)' // Epic gold
  else if (discipline >= 40) auraColor = 'rgba(0, 217, 255, 0.3)' // Rare blue
  
  // Title based on stats
  let title = 'Novice'
  if (avgStats >= 80) title = 'Legend'
  else if (avgStats >= 60) title = 'Elite'
  else if (avgStats >= 40) title = 'Warrior'
  else if (avgStats >= 20) title = 'Trainee'
  
  // Border color based on level
  let borderColor = '#6B7280'
  if (level >= 30) borderColor = '#A855F7' // Mythic
  else if (level >= 20) borderColor = '#FFD700' // Legendary
  else if (level >= 15) borderColor = '#00D9FF' // Epic
  else if (level >= 10) borderColor = '#3B82F6' // Rare
  else if (level >= 5) borderColor = '#22C55E' // Uncommon
  
  // URL params for RPM
  const urlParams = new URLSearchParams({
    ...(strength > 70 && { muscle: 'large' }),
    ...(discipline > 60 && { glow: 'true' }),
  }).toString()
  
  return { auraColor, title, borderColor, urlParams }
}

// Helper: Map hair style to RPM format
function mapHairStyle(style: string): string {
  const map: Record<string, string> = {
    short: 'short',
    buzz: 'buzz',
    medium: 'medium',
    long: 'long',
    mohawk: 'mohawk',
    afro: 'afro',
    dreads: 'dreadlocks',
    ponytail: 'ponytail',
    spiky: 'spiky',
  }
  return map[style] || 'short'
}

// Helper: Map outfit to RPM format
function mapOutfit(outfit: string): string {
  const map: Record<string, string> = {
    tee: 'tshirt',
    tank: 'tanktop',
    compression: 'compression',
    hoodie: 'hoodie',
    jersey: 'jersey',
    muscle: 'muscle-shirt',
  }
  return map[outfit] || 'tshirt'
}

// Helper: Get body type from strength
function getBodyType(strength: number): string {
  if (strength >= 70) return 'muscular'
  if (strength >= 50) return 'athletic'
  if (strength >= 30) return 'average'
  return 'slim'
}

// Helper: Stat bar component
function StatBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-bold text-gray-400 w-8">{label}</span>
      <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-500"
          style={{ 
            width: `${Math.min(value, 100)}%`,
            backgroundColor: color,
            boxShadow: `0 0 10px ${color}`,
          }}
        />
      </div>
      <span className="text-xs text-white w-8 text-right">{value}</span>
    </div>
  )
}

// ===== Three.js GLB Avatar Components (from RPMAvatarViewer) =====

interface RPMAvatarViewerProps {
  avatarUrl: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  autoRotate?: boolean
  showStats?: boolean
}

// Component to load and display the RPM avatar from GLB
function RPMAvatarGLB({ url }: { url: string }) {
  const groupRef = useRef<THREE.Group>(null)
  const { scene } = useGLTF(url)
  const avatarScene = scene.clone()

  avatarScene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.castShadow = true
      child.receiveShadow = true
    }
  })

  useFrame((state) => {
    if (groupRef.current) {
      const breathe = Math.sin(state.clock.elapsedTime * 0.8) * 0.01
      groupRef.current.position.y = breathe
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.05
    }
  })

  return (
    <group ref={groupRef}>
      <primitive object={avatarScene} scale={1.5} />
    </group>
  )
}

// Loading fallback
function LoadingAvatar() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400">Loading Avatar...</p>
      </div>
    </div>
  )
}

// Three.js Canvas-based RPM Avatar Viewer
export function RPMAvatarCanvas({
  avatarUrl,
  size = 'lg',
  autoRotate = true,
  showStats = true,
}: RPMAvatarViewerProps) {
  const sizes = {
    sm: { width: 240, height: 340 },
    md: { width: 300, height: 440 },
    lg: { width: 380, height: 560 },
    xl: { width: 440, height: 640 },
  }

  const { width, height } = sizes[size]

  return (
    <div style={{ width, height }} className="relative bg-gray-800 rounded-2xl overflow-hidden">
      <Canvas
        shadows
        camera={{ position: [0, 0.5, 4], fov: 35 }}
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0,
        }}
      >
        <Environment preset="studio" />
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow shadow-mapSize={[1024, 1024]} />
        <directionalLight position={[-5, 2, 5]} intensity={0.5} />
        <directionalLight position={[0, 5, -5]} intensity={0.3} />
        <Center>
          <Suspense fallback={null}>
            <RPMAvatarGLB url={avatarUrl} />
          </Suspense>
        </Center>
        <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={10} blur={2} far={3} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 2.5}
          maxPolarAngle={Math.PI / 1.8}
          autoRotate={autoRotate}
          autoRotateSpeed={0.5}
        />
      </Canvas>

      {showStats && (
        <div className="absolute bottom-3 left-3 right-3 z-10">
          <div className="bg-black/70 backdrop-blur-md rounded-lg p-3 border border-gray-700/50">
            <div className="flex items-center justify-between">
              <span className="text-white font-bold">Ready Player Me</span>
              <span className="text-green-400 text-sm">✓ Loaded</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Preload function for better performance
export function preloadAvatar(url: string) {
  useGLTF.preload(url)
}

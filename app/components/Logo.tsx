import Image from 'next/image'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  showText?: boolean
  variant?: 'light' | 'dark' // For different backgrounds
}

const sizeMap = {
  sm: { width: 32, height: 32 },
  md: { width: 48, height: 48 },
  lg: { width: 64, height: 64 },
  xl: { width: 120, height: 120 },
}

export default function Logo({
  size = 'md',
  className = '',
  showText = false,
  variant = 'light',
}: LogoProps) {
  const { width, height } = sizeMap[size]

  if (showText) {
    // Show full logo with text (from image)
    return (
      <Image
        src="/logo.jpg"
        alt="Ascending Fitness"
        width={width * 2}
        height={width * 2}
        className={`object-contain ${className}`}
        priority
      />
    )
  }

  // Show just the icon part (we'll extract/crop icon separately if needed)
  // For now, use the full logo
  return (
    <Image
      src="/logo.jpg"
      alt="Ascending Fitness"
      width={width}
      height={height}
      className={`object-contain ${className}`}
      priority
    />
  )
}

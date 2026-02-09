import Image from 'next/image'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#1A2332] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src="/branding/logo.jpg"
            alt="Ascending Fitness"
            width={200}
            height={200}
            className="w-48 h-auto"
            priority
          />
        </div>
        
        {/* Auth Form Card */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          {children}
        </div>
        
        {/* Footer */}
        <p className="text-center text-[#E8DCC4] text-sm mt-6">
          © 2026 Ascending Fitness. All rights reserved.
        </p>
      </div>
    </div>
  )
}

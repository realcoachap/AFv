import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  const ADMIN_EMAIL = 'andrespollan@protonmail.com'
  const ADMIN_PASSWORD = 'lllllll9' // Updated password

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: ADMIN_EMAIL },
  })

  if (existingAdmin) {
    // Update password for existing admin
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10)
    
    await prisma.user.update({
      where: { email: ADMIN_EMAIL },
      data: { password: hashedPassword },
    })
    
    console.log('✅ Admin password updated:')
    console.log('   Email:', ADMIN_EMAIL)
    console.log('   Role:', existingAdmin.role)
    console.log('   Password has been reset to the new value.')
    return
  }

  // Create new admin user
  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10)

  const admin = await prisma.user.create({
    data: {
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  console.log('✅ Admin user created:')
  console.log('   Email:', admin.email)
  console.log('   Role:', admin.role)
  console.log('   Password has been set.')
}

main()
  .catch((e) => {
    console.error('Error during seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'andrespollan@protonmail.com' },
  })

  if (existingAdmin) {
    console.log('Admin user already exists. Skipping seed.')
    return
  }

  // Create admin user
  const hashedPassword = await bcrypt.hash('Admin123!', 10) // Change this password!

  const admin = await prisma.user.create({
    data: {
      email: 'andrespollan@protonmail.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  console.log('✅ Admin user created:')
  console.log('   Email:', admin.email)
  console.log('   Role:', admin.role)
  console.log('   ⚠️  Default password: Admin123!')
  console.log('   Please change this password after first login!')
}

main()
  .catch((e) => {
    console.error('Error during seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

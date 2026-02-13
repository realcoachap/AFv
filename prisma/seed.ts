import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
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
}

main()
  .catch((e) => {
    console.error('Error during seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

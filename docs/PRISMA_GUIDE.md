# Prisma Quick Reference Guide

A practical guide for working with Prisma in this project.

---

## 🗄️ What is Prisma?

Prisma is a **type-safe ORM** (Object-Relational Mapping) that makes working with databases easier and safer:
- Write database queries in TypeScript (not SQL)
- Auto-completion and type checking
- Automatic migrations
- Visual database browser

---

## 📁 Prisma Files in This Project

```
prisma/
  └── schema.prisma    # Database structure definition

prisma.config.ts       # Prisma configuration (connects to DATABASE_URL)
```

---

## 🚀 Common Prisma Commands

### Generate Prisma Client
After changing `schema.prisma`, regenerate the client:
```bash
npx prisma generate
```

### Push Schema to Database
Apply schema changes to database (development):
```bash
npx prisma db push
```

### Create Migration (Production)
For production, create proper migrations:
```bash
npx prisma migrate dev --name description_of_changes
```

### View Database (Prisma Studio)
Open visual database browser:
```bash
npx prisma studio
```
Opens at `http://localhost:5555`

### Reset Database
⚠️ **WARNING:** Deletes all data!
```bash
npx prisma migrate reset
```

### Seed Database
Populate database with initial data:
```bash
npx prisma db seed
```

---

## 📝 Database Schema

Our current schema (`prisma/schema.prisma`):

### User Model
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  role      Role     @default(CLIENT)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum Role {
  ADMIN
  CLIENT
}
```

### ClientProfile Model
```prisma
model ClientProfile {
  id                String   @id @default(cuid())
  userId            String   @unique
  fullName          String
  phone             String
  dateOfBirth       DateTime?
  emergencyContact  String?
  fitnessGoals      String?
  medicalHistory    String?
  // ... more fields
}
```

### Appointment Model
```prisma
model Appointment {
  id          String   @id @default(cuid())
  clientId    String
  adminId     String
  dateTime    DateTime
  duration    Int      @default(60)
  status      AppointmentStatus @default(SCHEDULED)
  // ... more fields
}
```

---

## 🔧 Using Prisma in Code

### Import Prisma Client

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
```

**Best Practice:** Create a singleton instance:

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'error', 'warn'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

Then import everywhere:
```typescript
import { prisma } from '@/lib/prisma'
```

---

## 📖 Common Queries

### Create a User

```typescript
const user = await prisma.user.create({
  data: {
    email: 'client@example.com',
    password: hashedPassword,
    role: 'CLIENT',
  },
})
```

### Find User by Email

```typescript
const user = await prisma.user.findUnique({
  where: {
    email: 'client@example.com',
  },
})
```

### Find All Users with Profiles

```typescript
const users = await prisma.user.findMany({
  where: {
    role: 'CLIENT',
  },
  include: {
    clientProfile: true,
  },
})
```

### Update User

```typescript
const updated = await prisma.user.update({
  where: { id: userId },
  data: {
    email: 'newemail@example.com',
  },
})
```

### Delete User

```typescript
await prisma.user.delete({
  where: { id: userId },
})
```

### Create User with Profile (Nested)

```typescript
const user = await prisma.user.create({
  data: {
    email: 'client@example.com',
    password: hashedPassword,
    role: 'CLIENT',
    clientProfile: {
      create: {
        fullName: 'John Doe',
        phone: '555-0100',
        fitnessGoals: 'Lose weight',
      },
    },
  },
  include: {
    clientProfile: true,
  },
})
```

### Find Appointments for a Client

```typescript
const appointments = await prisma.appointment.findMany({
  where: {
    clientId: userId,
    dateTime: {
      gte: new Date(), // Only future appointments
    },
  },
  orderBy: {
    dateTime: 'asc',
  },
  include: {
    client: {
      select: {
        email: true,
        clientProfile: {
          select: {
            fullName: true,
            phone: true,
          },
        },
      },
    },
  },
})
```

### Count Users

```typescript
const clientCount = await prisma.user.count({
  where: {
    role: 'CLIENT',
  },
})
```

---

## 🔍 Advanced Queries

### Search Clients by Name

```typescript
const clients = await prisma.clientProfile.findMany({
  where: {
    fullName: {
      contains: searchTerm,
      mode: 'insensitive', // Case-insensitive
    },
  },
  include: {
    user: {
      select: {
        email: true,
        createdAt: true,
      },
    },
  },
})
```

### Get Appointments in Date Range

```typescript
const appointments = await prisma.appointment.findMany({
  where: {
    dateTime: {
      gte: startDate,
      lte: endDate,
    },
    status: {
      in: ['SCHEDULED', 'CONFIRMED'],
    },
  },
})
```

### Transactions (Multiple Operations)

```typescript
const result = await prisma.$transaction(async (prisma) => {
  // Create user
  const user = await prisma.user.create({
    data: { email, password, role: 'CLIENT' },
  })

  // Create profile
  const profile = await prisma.clientProfile.create({
    data: {
      userId: user.id,
      fullName,
      phone,
    },
  })

  return { user, profile }
})
```

---

## 🛠️ Modifying the Schema

When you need to add/change database fields:

1. **Edit `schema.prisma`**
   ```prisma
   model ClientProfile {
     // Add new field
     membershipTier String @default("BASIC")
   }
   ```

2. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

3. **Push to Database**
   ```bash
   # Development
   npx prisma db push

   # Production (creates migration)
   npx prisma migrate dev --name add_membership_tier
   ```

4. **Update Code**
   TypeScript will now know about the new field!

---

## 🐛 Troubleshooting

### Error: "Prisma Client not generated"
**Solution:**
```bash
npx prisma generate
```

### Error: "Database connection failed"
**Solution:**
Check `DATABASE_URL` in `.env` file or Railway environment variables.

### Schema Changes Not Reflecting
**Solution:**
```bash
npx prisma generate
npx prisma db push
```
Then restart dev server.

### Want to Start Fresh
**Solution:**
```bash
npx prisma migrate reset  # Deletes all data!
npx prisma db push
npx prisma db seed  # If you have a seed script
```

---

## 📚 Best Practices

1. **Always use transactions** for related operations
2. **Select only needed fields** for performance:
   ```typescript
   select: {
     id: true,
     email: true,
     // Don't fetch password unless needed
   }
   ```
3. **Use indexes** for frequently queried fields (already in schema)
4. **Validate data** before Prisma operations
5. **Handle errors** with try-catch blocks
6. **Use proper types** from Prisma (e.g., `User`, `ClientProfile`)

---

## 🔗 Useful Resources

- [Prisma Docs](https://www.prisma.io/docs)
- [Prisma Examples](https://github.com/prisma/prisma-examples)
- [Prisma CLI Reference](https://www.prisma.io/docs/reference/api-reference/command-reference)
- [Prisma Studio](https://www.prisma.io/studio)

---

## 💡 Quick Tips

- Use **Prisma Studio** (`npx prisma studio`) to visually browse/edit data
- **Auto-complete** in VS Code works with Prisma queries
- **Type safety** means TypeScript catches errors before runtime
- **Migrations** track schema changes over time (use in production)
- **db push** is faster for development (no migration history)

---

**Guide maintained by Vlad | Last updated: 2026-02-08**

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import {
  createWorkoutSchema,
  workoutQuerySchema,
  CreateWorkoutInput,
} from '@/lib/validations/workout'
import { Prisma } from '@prisma/client'

// GET /api/workouts - Get user's workout history
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'You must be logged in to view workouts' },
        { status: 401 }
      )
    }

    // Parse and validate query parameters
    const { searchParams } = new URL(request.url)
    const queryResult = workoutQuerySchema.safeParse({
      limit: searchParams.get('limit') ?? undefined,
      offset: searchParams.get('offset') ?? undefined,
      status: searchParams.get('status') ?? undefined,
      focusType: searchParams.get('focusType') ?? undefined,
      startDate: searchParams.get('startDate') ?? undefined,
      endDate: searchParams.get('endDate') ?? undefined,
      orderBy: searchParams.get('orderBy') ?? 'date',
      order: searchParams.get('order') ?? 'desc',
    })

    if (!queryResult.success) {
      return NextResponse.json(
        {
          error: 'Bad Request',
          message: 'Invalid query parameters',
          details: queryResult.error.flatten(),
        },
        { status: 400 }
      )
    }

    const {
      limit = 20,
      offset = 0,
      status,
      focusType,
      startDate,
      endDate,
      orderBy,
      order,
    } = queryResult.data

    // Build where clause
    const where: Prisma.WorkoutWhereInput = {
      userId: session.user.id,
      ...(status && { status }),
      ...(focusType && { focusType }),
      ...(startDate || endDate
        ? {
            date: {
              ...(startDate && { gte: new Date(startDate) }),
              ...(endDate && { lte: new Date(endDate) }),
            },
          }
        : {}),
    }

    // Fetch workouts with pagination
    const [workouts, total] = await Promise.all([
      prisma.workout.findMany({
        where,
        include: {
          exercises: {
            include: {
              sets: {
                orderBy: {
                  setNumber: 'asc',
                },
              },
            },
            orderBy: {
              order: 'asc',
            },
          },
        },
        orderBy: {
          [orderBy]: order,
        },
        skip: offset,
        take: limit,
      }),
      prisma.workout.count({ where }),
    ])

    return NextResponse.json({
      workouts,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + workouts.length < total,
      },
    })
  } catch (error) {
    console.error('Error fetching workouts:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to fetch workouts' },
      { status: 500 }
    )
  }
}

// POST /api/workouts - Create new workout
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'You must be logged in to create workouts' },
        { status: 401 }
      )
    }

    // Parse request body
    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Invalid JSON body' },
        { status: 400 }
      )
    }

    // Validate request body
    const validationResult = createWorkoutSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Bad Request',
          message: 'Invalid workout data',
          details: validationResult.error.flatten(),
        },
        { status: 400 }
      )
    }

    const data = validationResult.data

    // Calculate XP based on workout type and focus
    const xpAwarded = calculateXP(data)

    // Create workout with exercises and sets in a transaction
    const workout = await prisma.$transaction(async (tx) => {
      // Create the workout
      const newWorkout = await tx.workout.create({
        data: {
          userId: session.user.id,
          name: data.name,
          notes: data.notes,
          date: new Date(data.date),
          duration: data.duration,
          type: data.type,
          status: data.status,
          focusType: data.focusType,
          xpAwarded,
          exercises: {
            create: data.exercises.map((exercise) => ({
              name: exercise.name,
              category: exercise.category,
              duration: exercise.duration,
              distance: exercise.distance,
              distanceUnit: exercise.distanceUnit,
              notes: exercise.notes,
              order: exercise.order,
              sets: {
                create: exercise.sets.map((set) => ({
                  setNumber: set.setNumber,
                  reps: set.reps,
                  weight: set.weight,
                  weightUnit: set.weightUnit,
                  duration: set.duration,
                  distance: set.distance,
                  completed: set.completed,
                  rpe: set.rpe,
                  notes: set.notes,
                })),
              },
            })),
          },
        },
        include: {
          exercises: {
            include: {
              sets: {
                orderBy: {
                  setNumber: 'asc',
                },
              },
            },
            orderBy: {
              order: 'asc',
            },
          },
        },
      })

      // Update RPG character stats and XP
      await updateCharacterStats(tx, session.user.id, data, xpAwarded)

      return newWorkout
    })

    return NextResponse.json(
      {
        workout,
        xpAwarded,
        message: 'Workout created successfully',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating workout:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to create workout' },
      { status: 500 }
    )
  }
}

// Helper function to calculate XP
function calculateXP(data: CreateWorkoutInput): number {
  let baseXP = data.type === 'COACHED' ? 100 : 75

  // Bonus for different focus types
  if (data.focusType) {
    baseXP += 10
  }

  // Bonus for completed exercises
  const completedExercises = data.exercises.filter(
    (ex) => ex.sets.length > 0
  ).length
  baseXP += completedExercises * 5

  return baseXP
}

// Helper function to update character stats
async function updateCharacterStats(
  tx: Prisma.TransactionClient,
  userId: string,
  data: CreateWorkoutInput,
  xpAwarded: number
) {
  const character = await tx.rPGCharacter.findUnique({
    where: { userId },
  })

  if (!character) return

  // Calculate stat gains based on focus type
  let strengthGain = 0
  let enduranceGain = 0

  switch (data.focusType) {
    case 'STRENGTH':
      strengthGain = 1
      break
    case 'CARDIO':
      enduranceGain = 1
      break
    case 'BALANCED':
      strengthGain = 1
      enduranceGain = 1
      break
    default:
      // Default small gains
      strengthGain = 0
      enduranceGain = 0
  }

  // Calculate new level based on XP
  const newXP = character.xp + xpAwarded
  const newLevel = Math.floor(newXP / 1000) + 1

  // Update streak logic
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const lastWorkout = character.lastWorkoutDate
    ? new Date(character.lastWorkoutDate)
    : null
  if (lastWorkout) {
    lastWorkout.setHours(0, 0, 0, 0)
  }

  let newStreak = character.currentStreak
  if (lastWorkout) {
    const diffDays = Math.floor(
      (today.getTime() - lastWorkout.getTime()) / (1000 * 60 * 60 * 24)
    )
    if (diffDays === 1) {
      newStreak += 1
    } else if (diffDays > 1) {
      newStreak = 1
    }
  } else {
    newStreak = 1
  }

  const longestStreak = Math.max(character.longestStreak, newStreak)

  // Update character
  await tx.rPGCharacter.update({
    where: { userId },
    data: {
      xp: newXP,
      level: newLevel,
      strength: Math.min(100, character.strength + strengthGain),
      endurance: Math.min(100, character.endurance + enduranceGain),
      discipline: Math.min(100, character.discipline + 1),
      currentStreak: newStreak,
      longestStreak,
      lastWorkoutDate: new Date(),
    },
  })

  // Log XP
  await tx.rPGXPLog.create({
    data: {
      userId,
      amount: xpAwarded,
      source: 'workout_complete',
      referenceId: null,
      note: `Completed workout: ${data.name}`,
    },
  })
}

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { updateWorkoutSchema } from '@/lib/validations/workout'
import { Prisma } from '@prisma/client'

// GET /api/workouts/:id - Get specific workout
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'You must be logged in to view workouts' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Fetch workout with all related data
    const workout = await prisma.workout.findUnique({
      where: { id },
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

    // Check if workout exists
    if (!workout) {
      return NextResponse.json(
        { error: 'Not Found', message: 'Workout not found' },
        { status: 404 }
      )
    }

    // Check if user owns this workout
    if (workout.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden', message: 'You do not have permission to view this workout' },
        { status: 403 }
      )
    }

    return NextResponse.json({ workout })
  } catch (error) {
    console.error('Error fetching workout:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to fetch workout' },
      { status: 500 }
    )
  }
}

// PUT /api/workouts/:id - Update workout
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'You must be logged in to update workouts' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Check if workout exists and belongs to user
    const existingWorkout = await prisma.workout.findUnique({
      where: { id },
      include: {
        exercises: {
          include: {
            sets: true,
          },
        },
      },
    })

    if (!existingWorkout) {
      return NextResponse.json(
        { error: 'Not Found', message: 'Workout not found' },
        { status: 404 }
      )
    }

    if (existingWorkout.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden', message: 'You do not have permission to update this workout' },
        { status: 403 }
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
    const validationResult = updateWorkoutSchema.safeParse(body)
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

    // Update workout in a transaction
    const updatedWorkout = await prisma.$transaction(async (tx) => {
      // Build update data
      const updateData: Prisma.WorkoutUpdateInput = {}

      if (data.name !== undefined) updateData.name = data.name
      if (data.notes !== undefined) updateData.notes = data.notes
      if (data.date !== undefined) updateData.date = new Date(data.date)
      if (data.duration !== undefined) updateData.duration = data.duration
      if (data.type !== undefined) updateData.type = data.type
      if (data.status !== undefined) updateData.status = data.status
      if (data.focusType !== undefined) updateData.focusType = data.focusType

      // Handle exercises update if provided
      if (data.exercises) {
        // Delete existing exercises and their sets (cascade)
        await tx.exercise.deleteMany({
          where: { workoutId: id },
        })

        // Create new exercises
        updateData.exercises = {
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
        }
      }

      // Update workout
      const workout = await tx.workout.update({
        where: { id },
        data: updateData,
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

      return workout
    })

    return NextResponse.json({
      workout: updatedWorkout,
      message: 'Workout updated successfully',
    })
  } catch (error) {
    console.error('Error updating workout:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to update workout' },
      { status: 500 }
    )
  }
}

// DELETE /api/workouts/:id - Delete workout
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'You must be logged in to delete workouts' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Check if workout exists and belongs to user
    const existingWorkout = await prisma.workout.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        xpAwarded: true,
      },
    })

    if (!existingWorkout) {
      return NextResponse.json(
        { error: 'Not Found', message: 'Workout not found' },
        { status: 404 }
      )
    }

    if (existingWorkout.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden', message: 'You do not have permission to delete this workout' },
        { status: 403 }
      )
    }

    // Delete workout in a transaction (cascades to exercises and sets)
    await prisma.$transaction(async (tx) => {
      // Delete workout (exercises and sets will cascade)
      await tx.workout.delete({
        where: { id },
      })

      // Revert character stats if XP was awarded
      if (existingWorkout.xpAwarded > 0) {
        const character = await tx.rPGCharacter.findUnique({
          where: { userId: session.user.id },
        })

        if (character) {
          const newXP = Math.max(0, character.xp - existingWorkout.xpAwarded)
          const newLevel = Math.floor(newXP / 1000) + 1

          await tx.rPGCharacter.update({
            where: { userId: session.user.id },
            data: {
              xp: newXP,
              level: newLevel,
            },
          })

          // Log the XP removal
          await tx.rPGXPLog.create({
            data: {
              userId: session.user.id,
              amount: -existingWorkout.xpAwarded,
              source: 'workout_deleted',
              referenceId: id,
              note: 'Workout deleted - XP reverted',
            },
          })
        }
      }
    })

    return NextResponse.json({
      message: 'Workout deleted successfully',
      xpReverted: existingWorkout.xpAwarded,
    })
  } catch (error) {
    console.error('Error deleting workout:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to delete workout' },
      { status: 500 }
    )
  }
}

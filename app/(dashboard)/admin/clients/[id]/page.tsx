import { auth, signOut } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Logo from '@/app/components/Logo'

export default async function AdminClientViewPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/login')
  }

  const { id } = await params

  const client = await prisma.user.findUnique({
    where: { id },
    include: {
      clientProfile: true,
    },
  })

  if (!client || client.role !== 'CLIENT') {
    redirect('/admin/clients')
  }

  const profile = client.clientProfile

  if (!profile) {
    redirect('/admin/clients')
  }

  // Calculate completion
  const fields = [
    profile.fullName,
    profile.phone,
    profile.email,
    profile.age,
    profile.gender,
    profile.height,
    profile.currentWeight,
    profile.emergencyContact,
    profile.emergencyPhone,
    profile.emergencyRelationship,
    profile.hasMedicalConditions !== null ? true : null,
    profile.isTakingMedications !== null ? true : null,
    profile.hasInjuries !== null ? true : null,
    profile.hasAllergies !== null ? true : null,
    profile.fitnessLevel,
    profile.hasWorkedOutBefore !== null ? true : null,
    profile.hasHomeEquipment !== null ? true : null,
    profile.primaryGoal,
    profile.targetTimeline,
    profile.typicalActivityLevel,
    profile.averageSleepHours,
    profile.exerciseDaysPerWeek,
    profile.preferredWorkoutDays,
    profile.sessionsPerMonth,
  ]

  const filledFields = fields.filter(
    (field) => field !== null && field !== undefined && field !== ''
  ).length

  const completion = Math.round((filledFields / fields.length) * 100)

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-[#1A2332] text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/admin/dashboard">
            <Logo size="md" />
          </Link>
          <div className="flex gap-4 items-center">
            <Link
              href="/admin/clients"
              className="hover:text-[#E8DCC4] transition-colors"
            >
              ← Back to Clients
            </Link>
            <form
              action={async () => {
                'use server'
                await signOut()
              }}
            >
              <button
                type="submit"
                className="bg-[#E8DCC4] text-[#1A2332] px-4 py-2 rounded hover:bg-[#D8CCA4] transition-colors"
              >
                Logout
              </button>
            </form>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold text-[#1A2332]">
                {profile.fullName}
              </h2>
              <p className="text-gray-600">{client.email}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">
                Joined: {new Date(client.createdAt).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600">
                Last Updated: {new Date(profile.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Profile Completion</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full ${
                  completion >= 80
                    ? 'bg-[#10B981]'
                    : completion >= 50
                    ? 'bg-[#F59E0B]'
                    : 'bg-[#EF4444]'
                }`}
                style={{ width: `${completion}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-1">{completion}% Complete</p>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white rounded-lg shadow p-6 mb-4">
          <h3 className="text-lg font-semibold text-[#1A2332] mb-4">
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoField label="Name" value={profile.fullName} />
            <InfoField label="Age" value={profile.age?.toString()} />
            <InfoField label="Gender" value={profile.gender} />
            <InfoField
              label="Height"
              value={
                profile.height
                  ? `${profile.height} ${profile.heightUnit || 'inches'}`
                  : undefined
              }
            />
            <InfoField
              label="Weight"
              value={
                profile.currentWeight
                  ? `${profile.currentWeight} ${profile.weightUnit || 'lbs'}`
                  : undefined
              }
            />
            <InfoField label="Phone" value={profile.phone} />
            <InfoField label="Email" value={profile.email || client.email} />
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-white rounded-lg shadow p-6 mb-4">
          <h3 className="text-lg font-semibold text-[#1A2332] mb-4">
            Emergency Contact
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoField label="Name" value={profile.emergencyContact} />
            <InfoField label="Relationship" value={profile.emergencyRelationship} />
            <InfoField label="Phone" value={profile.emergencyPhone} />
          </div>
        </div>

        {/* Health & Medical */}
        <div className="bg-white rounded-lg shadow p-6 mb-4">
          <h3 className="text-lg font-semibold text-[#1A2332] mb-4">
            Health & Medical
          </h3>
          <div className="space-y-3">
            <InfoField
              label="Medical Conditions"
              value={
                profile.hasMedicalConditions === true
                  ? profile.medicalConditions || 'Yes'
                  : profile.hasMedicalConditions === false
                  ? 'No'
                  : undefined
              }
            />
            <InfoField
              label="Medications"
              value={
                profile.isTakingMedications === true
                  ? profile.medications || 'Yes'
                  : profile.isTakingMedications === false
                  ? 'No'
                  : undefined
              }
            />
            <InfoField
              label="Injuries or Surgeries"
              value={
                profile.hasInjuries === true
                  ? profile.injuriesDescription || 'Yes'
                  : profile.hasInjuries === false
                  ? 'No'
                  : undefined
              }
            />
            <InfoField
              label="Allergies"
              value={
                profile.hasAllergies === true
                  ? profile.allergies || 'Yes'
                  : profile.hasAllergies === false
                  ? 'No'
                  : undefined
              }
            />
            <InfoField label="Fitness Level" value={profile.fitnessLevel} />
          </div>
        </div>

        {/* Fitness History */}
        <div className="bg-white rounded-lg shadow p-6 mb-4">
          <h3 className="text-lg font-semibold text-[#1A2332] mb-4">
            Fitness History
          </h3>
          <div className="space-y-3">
            <InfoField
              label="Worked Out Before"
              value={
                profile.hasWorkedOutBefore === true
                  ? 'Yes'
                  : profile.hasWorkedOutBefore === false
                  ? 'No'
                  : undefined
              }
            />
            <InfoField
              label="Previous Exercise Types"
              value={profile.previousExerciseTypes}
            />
            <InfoField
              label="Home Equipment"
              value={
                profile.hasHomeEquipment === true
                  ? profile.homeEquipmentTypes || 'Yes'
                  : profile.hasHomeEquipment === false
                  ? 'No'
                  : undefined
              }
            />
          </div>
        </div>

        {/* Goals */}
        <div className="bg-white rounded-lg shadow p-6 mb-4">
          <h3 className="text-lg font-semibold text-[#1A2332] mb-4">Goals</h3>
          <div className="space-y-3">
            <InfoField label="Primary Goal" value={profile.primaryGoal} />
            <InfoField label="Secondary Goals" value={profile.secondaryGoals} />
            <InfoField label="Target Timeline" value={profile.targetTimeline} />
          </div>
        </div>

        {/* Lifestyle */}
        <div className="bg-white rounded-lg shadow p-6 mb-4">
          <h3 className="text-lg font-semibold text-[#1A2332] mb-4">
            Lifestyle
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoField
              label="Activity Level"
              value={profile.typicalActivityLevel}
            />
            <InfoField
              label="Average Sleep"
              value={
                profile.averageSleepHours
                  ? `${profile.averageSleepHours} hours/night`
                  : undefined
              }
            />
            <InfoField
              label="Dietary Restrictions"
              value={profile.dietaryRestrictions}
              className="md:col-span-2"
            />
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white rounded-lg shadow p-6 mb-4">
          <h3 className="text-lg font-semibold text-[#1A2332] mb-4">
            Preferences
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoField
              label="Exercise Days Per Week"
              value={profile.exerciseDaysPerWeek?.toString()}
            />
            <InfoField
              label="Preferred Workout Days/Times"
              value={profile.preferredWorkoutDays}
            />
            <InfoField
              label="Sessions Per Month"
              value={profile.sessionsPerMonth?.toString()}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

function InfoField({
  label,
  value,
  className = '',
}: {
  label: string
  value?: string | null
  className?: string
}) {
  return (
    <div className={className}>
      <p className="text-sm font-medium text-gray-700">{label}</p>
      <p className="text-base text-gray-900 mt-1">
        {value || <span className="text-gray-400 italic">Not provided</span>}
      </p>
    </div>
  )
}

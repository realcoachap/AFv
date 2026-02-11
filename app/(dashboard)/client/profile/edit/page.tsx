'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import VersionFooter from '@/app/components/VersionFooter'
import ConditionalField from '@/app/components/profile/ConditionalField'
import { validateProfile } from '@/app/lib/validations/profile'
import NavBar from '@/app/components/NavBar'

export default function EditProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    age: null as number | null,
    gender: '',
    height: null as number | null,
    heightUnit: 'inches',
    currentWeight: null as number | null,
    weightUnit: 'pounds',
    emergencyContact: '',
    emergencyPhone: '',
    emergencyRelationship: '',
    hasMedicalConditions: null as boolean | null,
    medicalConditions: '',
    isTakingMedications: null as boolean | null,
    medications: '',
    hasInjuries: null as boolean | null,
    injuriesDescription: '',
    hasAllergies: null as boolean | null,
    allergies: '',
    fitnessLevel: '',
    hasWorkedOutBefore: null as boolean | null,
    previousExerciseTypes: '',
    hasHomeEquipment: null as boolean | null,
    homeEquipmentTypes: '',
    primaryGoal: '',
    secondaryGoals: '',
    targetTimeline: '',
    typicalActivityLevel: '',
    averageSleepHours: null as number | null,
    dietaryRestrictions: '',
    exerciseDaysPerWeek: null as number | null,
    preferredWorkoutDays: '',
    sessionsPerMonth: null as number | null,
  })

  // Load profile data
  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch('/api/profile')
        if (response.ok) {
          const data = await response.json()
          const profile = data.profile
          setFormData({
            fullName: profile.fullName || '',
            phone: profile.phone || '',
            email: profile.email || '',
            age: profile.age,
            gender: profile.gender || '',
            height: profile.height,
            heightUnit: profile.heightUnit || 'inches',
            currentWeight: profile.currentWeight,
            weightUnit: profile.weightUnit || 'pounds',
            emergencyContact: profile.emergencyContact || '',
            emergencyPhone: profile.emergencyPhone || '',
            emergencyRelationship: profile.emergencyRelationship || '',
            hasMedicalConditions: profile.hasMedicalConditions,
            medicalConditions: profile.medicalConditions || '',
            isTakingMedications: profile.isTakingMedications,
            medications: profile.medications || '',
            hasInjuries: profile.hasInjuries,
            injuriesDescription: profile.injuriesDescription || '',
            hasAllergies: profile.hasAllergies,
            allergies: profile.allergies || '',
            fitnessLevel: profile.fitnessLevel || '',
            hasWorkedOutBefore: profile.hasWorkedOutBefore,
            previousExerciseTypes: profile.previousExerciseTypes || '',
            hasHomeEquipment: profile.hasHomeEquipment,
            homeEquipmentTypes: profile.homeEquipmentTypes || '',
            primaryGoal: profile.primaryGoal || '',
            secondaryGoals: profile.secondaryGoals || '',
            targetTimeline: profile.targetTimeline || '',
            typicalActivityLevel: profile.typicalActivityLevel || '',
            averageSleepHours: profile.averageSleepHours,
            dietaryRestrictions: profile.dietaryRestrictions || '',
            exerciseDaysPerWeek: profile.exerciseDaysPerWeek,
            preferredWorkoutDays: profile.preferredWorkoutDays || '',
            sessionsPerMonth: profile.sessionsPerMonth,
          })
        }
      } catch (err) {
        setError('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setValidationErrors({})
    
    // Client-side validation
    const validation = validateProfile(formData)
    if (!validation.success) {
      setValidationErrors(validation.errors)
      setError('Please fix the validation errors below')
      return
    }
    
    setSaving(true)

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => {
          router.push('/client/profile')
        }, 1000)
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to save profile')
        setSaving(false)
      }
    } catch (err) {
      setError('Failed to save profile')
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#1A2332]"></div>
          <p className="mt-2 text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar role="client" backLink="/client/profile" backText="← Back to Profile" />

      <main className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#1A2332] mb-4">
            Edit Profile
          </h2>
          <p className="text-gray-600 mb-4">
            All fields are optional. Fill out what you're comfortable sharing.
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
              Profile saved successfully! Redirecting...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <Section title="Personal Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Name"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    min="10"
                    max="100"
                    step="1"
                    value={formData.age?.toString() || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        age: e.target.value ? parseInt(e.target.value) : null,
                      })
                    }
                    placeholder="30"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E8DCC4] focus:border-transparent"
                  />
                </div>
                <Select
                  label="Gender"
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                  options={[
                    { value: '', label: 'Select...' },
                    { value: 'Male', label: 'Male' },
                    { value: 'Female', label: 'Female' },
                    { value: 'Prefer not to say', label: 'Prefer not to say' },
                  ]}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Height
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      inputMode="decimal"
                      min={formData.heightUnit === 'inches' ? '36' : '90'}
                      max={formData.heightUnit === 'inches' ? '96' : '250'}
                      step="0.5"
                      value={formData.height || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          height: e.target.value ? parseFloat(e.target.value) : null,
                        })
                      }
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E8DCC4] focus:border-transparent"
                      placeholder={formData.heightUnit === 'inches' ? '72' : '183'}
                    />
                    <select
                      value={formData.heightUnit}
                      onChange={(e) =>
                        setFormData({ ...formData, heightUnit: e.target.value })
                      }
                      className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E8DCC4] focus:border-transparent"
                    >
                      <option value="inches">inches</option>
                      <option value="centimeters">cm</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Weight
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      inputMode="decimal"
                      min={formData.weightUnit === 'pounds' ? '50' : '20'}
                      max={formData.weightUnit === 'pounds' ? '500' : '250'}
                      step="0.5"
                      value={formData.currentWeight || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          currentWeight: e.target.value
                            ? parseFloat(e.target.value)
                            : null,
                        })
                      }
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E8DCC4] focus:border-transparent"
                      placeholder={formData.weightUnit === 'pounds' ? '180' : '80'}
                    />
                    <select
                      value={formData.weightUnit}
                      onChange={(e) =>
                        setFormData({ ...formData, weightUnit: e.target.value })
                      }
                      className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E8DCC4] focus:border-transparent"
                    >
                      <option value="pounds">lbs</option>
                      <option value="kilograms">kg</option>
                    </select>
                  </div>
                </div>
                <Input
                  label="Phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
                <Input
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </Section>

            {/* Emergency Contact */}
            <Section title="Emergency Contact">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Name"
                  value={formData.emergencyContact}
                  onChange={(e) =>
                    setFormData({ ...formData, emergencyContact: e.target.value })
                  }
                />
                <Select
                  label="Relationship"
                  value={formData.emergencyRelationship}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      emergencyRelationship: e.target.value,
                    })
                  }
                  options={[
                    { value: '', label: 'Select...' },
                    { value: 'Spouse', label: 'Spouse' },
                    { value: 'Parent', label: 'Parent' },
                    { value: 'Sibling', label: 'Sibling' },
                    { value: 'Friend', label: 'Friend' },
                    { value: 'Other', label: 'Other' },
                  ]}
                />
                <Input
                  label="Phone"
                  type="tel"
                  value={formData.emergencyPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, emergencyPhone: e.target.value })
                  }
                />
              </div>
            </Section>

            {/* Health & Medical */}
            <Section title="Health & Medical">
              <div className="space-y-4">
                <ConditionalField
                  label="Do you have any medical conditions?"
                  value={formData.hasMedicalConditions}
                  onChange={(val) =>
                    setFormData({ ...formData, hasMedicalConditions: val })
                  }
                  showDescription={formData.hasMedicalConditions === true}
                  descriptionValue={formData.medicalConditions}
                  onDescriptionChange={(val) =>
                    setFormData({ ...formData, medicalConditions: val })
                  }
                  descriptionPlaceholder="Please describe your medical conditions..."
                />
                <ConditionalField
                  label="Are you taking any medications?"
                  value={formData.isTakingMedications}
                  onChange={(val) =>
                    setFormData({ ...formData, isTakingMedications: val })
                  }
                  showDescription={formData.isTakingMedications === true}
                  descriptionValue={formData.medications}
                  onDescriptionChange={(val) =>
                    setFormData({ ...formData, medications: val })
                  }
                  descriptionPlaceholder="Please list your medications..."
                />
                <ConditionalField
                  label="Any injuries or past surgeries?"
                  value={formData.hasInjuries}
                  onChange={(val) => setFormData({ ...formData, hasInjuries: val })}
                  showDescription={formData.hasInjuries === true}
                  descriptionValue={formData.injuriesDescription}
                  onDescriptionChange={(val) =>
                    setFormData({ ...formData, injuriesDescription: val })
                  }
                  descriptionPlaceholder="Please describe your injuries or surgeries..."
                />
                <ConditionalField
                  label="Do you have any allergies?"
                  value={formData.hasAllergies}
                  onChange={(val) =>
                    setFormData({ ...formData, hasAllergies: val })
                  }
                  showDescription={formData.hasAllergies === true}
                  descriptionValue={formData.allergies}
                  onDescriptionChange={(val) =>
                    setFormData({ ...formData, allergies: val })
                  }
                  descriptionPlaceholder="Please describe your allergies..."
                />
                <Select
                  label="Current fitness level"
                  value={formData.fitnessLevel}
                  onChange={(e) =>
                    setFormData({ ...formData, fitnessLevel: e.target.value })
                  }
                  options={[
                    { value: '', label: 'Select...' },
                    { value: 'Beginner', label: 'Beginner' },
                    { value: 'Intermediate', label: 'Intermediate' },
                    { value: 'Advanced', label: 'Advanced' },
                  ]}
                />
              </div>
            </Section>

            {/* Fitness History */}
            <Section title="Fitness History">
              <div className="space-y-4">
                <ConditionalField
                  label="Have you worked out before?"
                  value={formData.hasWorkedOutBefore}
                  onChange={(val) =>
                    setFormData({ ...formData, hasWorkedOutBefore: val })
                  }
                />
                <Textarea
                  label="What types of exercise have you done?"
                  value={formData.previousExerciseTypes}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      previousExerciseTypes: e.target.value,
                    })
                  }
                  placeholder="e.g., Running, weightlifting, yoga..."
                />
                <ConditionalField
                  label="Do you have workout equipment access at home?"
                  value={formData.hasHomeEquipment}
                  onChange={(val) =>
                    setFormData({ ...formData, hasHomeEquipment: val })
                  }
                  showDescription={formData.hasHomeEquipment === true}
                  descriptionValue={formData.homeEquipmentTypes}
                  onDescriptionChange={(val) =>
                    setFormData({ ...formData, homeEquipmentTypes: val })
                  }
                  descriptionPlaceholder="Please describe your equipment..."
                />
              </div>
            </Section>

            {/* Goals */}
            <Section title="Goals">
              <div className="space-y-4">
                <Textarea
                  label="Primary goal"
                  value={formData.primaryGoal}
                  onChange={(e) =>
                    setFormData({ ...formData, primaryGoal: e.target.value })
                  }
                  placeholder="e.g., Lose weight, build muscle, improve endurance..."
                />
                <Textarea
                  label="Secondary goals"
                  value={formData.secondaryGoals}
                  onChange={(e) =>
                    setFormData({ ...formData, secondaryGoals: e.target.value })
                  }
                  placeholder="Any additional goals..."
                />
                <Input
                  label="Target timeline"
                  value={formData.targetTimeline}
                  onChange={(e) =>
                    setFormData({ ...formData, targetTimeline: e.target.value })
                  }
                  placeholder="e.g., 3 months, 6 months..."
                />
              </div>
            </Section>

            {/* Lifestyle */}
            <Section title="Lifestyle">
              <div className="space-y-4">
                <Select
                  label="Typical activity level"
                  value={formData.typicalActivityLevel}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      typicalActivityLevel: e.target.value,
                    })
                  }
                  options={[
                    { value: '', label: 'Select...' },
                    { value: 'Sedentary', label: 'Sedentary (desk job, minimal exercise)' },
                    { value: 'Light Active', label: 'Light Active (light exercise 1-3 days/week)' },
                    { value: 'Active', label: 'Active (moderate exercise 3-5 days/week)' },
                    { value: 'Very Active', label: 'Very Active (intense exercise 6-7 days/week)' },
                  ]}
                />
                <Input
                  label="Sleep average (hours per night)"
                  type="number"
                  inputMode="numeric"
                  min="0"
                  max="24"
                  step="0.5"
                  value={formData.averageSleepHours?.toString() || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      averageSleepHours: e.target.value
                        ? parseFloat(e.target.value)
                        : null,
                    })
                  }
                  placeholder="7.5"
                />
                <Textarea
                  label="Dietary restrictions (allergies)"
                  value={formData.dietaryRestrictions}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      dietaryRestrictions: e.target.value,
                    })
                  }
                  placeholder="Any dietary restrictions or food allergies..."
                />
              </div>
            </Section>

            {/* Preferences */}
            <Section title="Preferences">
              <div className="space-y-4">
                <Input
                  label="How many days out of the week do you plan on exercising?"
                  type="number"
                  inputMode="numeric"
                  min="0"
                  max="7"
                  step="1"
                  value={formData.exerciseDaysPerWeek?.toString() || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      exerciseDaysPerWeek: e.target.value
                        ? parseInt(e.target.value)
                        : null,
                    })
                  }
                  placeholder="3"
                />
                <Textarea
                  label="Preferred workout days of the week/time"
                  value={formData.preferredWorkoutDays}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      preferredWorkoutDays: e.target.value,
                    })
                  }
                  placeholder="e.g., Mon/Wed/Fri at 6pm..."
                />
                <Input
                  label="Sessions per month"
                  type="number"
                  inputMode="numeric"
                  min="0"
                  max="31"
                  step="1"
                  value={formData.sessionsPerMonth?.toString() || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sessionsPerMonth: e.target.value
                        ? parseInt(e.target.value)
                        : null,
                    })
                  }
                  placeholder="8"
                  error={validationErrors.sessionsPerMonth}
                />
              </div>
            </Section>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-end pt-4 border-t">
              <Link
                href="/client/profile"
                className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-[#E8DCC4] text-[#1A2332] rounded-lg font-semibold hover:bg-[#D8CCA4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

// Component helpers
function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="border-b border-gray-200 pb-6">
      <h3 className="text-lg font-semibold text-[#1A2332] mb-4">{title}</h3>
      {children}
    </div>
  )
}

function Input({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  step,
  min,
  max,
  inputMode,
  error,
}: {
  label: string
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  step?: string
  min?: string
  max?: string
  inputMode?: 'numeric' | 'decimal' | 'tel' | 'search' | 'email' | 'url' | 'text' | 'none'
  error?: string
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        step={step}
        min={min}
        max={max}
        inputMode={inputMode}
        className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#E8DCC4] focus:border-transparent ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
}

function Select({
  label,
  value,
  onChange,
  options,
  error,
}: {
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  options: { value: string; label: string }[]
  error?: string
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#E8DCC4] focus:border-transparent ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
}

function Textarea({
  label,
  value,
  onChange,
  placeholder,
  error,
}: {
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  placeholder?: string
  error?: string
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={3}
        className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#E8DCC4] focus:border-transparent ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
}


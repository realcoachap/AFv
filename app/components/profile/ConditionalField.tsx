/**
 * ConditionalField - Reusable Yes/No field with conditional textarea
 * 
 * Used for fields like:
 * - Medical conditions (hasMedicalConditions → medicalConditions)
 * - Medications (isTakingMedications → medications)
 * - Injuries (hasInjuries → injuriesDescription)
 * - Allergies (hasAllergies → allergies)
 * - Home equipment (hasHomeEquipment → homeEquipmentTypes)
 */

interface ConditionalFieldProps {
  label: string
  value: boolean | null
  onChange: (val: boolean | null) => void
  showDescription?: boolean
  descriptionValue?: string
  onDescriptionChange?: (val: string) => void
  descriptionPlaceholder?: string
  error?: string
}

export default function ConditionalField({
  label,
  value,
  onChange,
  showDescription = false,
  descriptionValue,
  onDescriptionChange,
  descriptionPlaceholder,
  error,
}: ConditionalFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex gap-4 mb-2">
        <label className="flex items-center cursor-pointer">
          <input
            type="radio"
            checked={value === true}
            onChange={() => onChange(true)}
            className="mr-2 h-4 w-4 text-[#E8DCC4] focus:ring-[#E8DCC4]"
          />
          <span className="text-gray-700">Yes</span>
        </label>
        <label className="flex items-center cursor-pointer">
          <input
            type="radio"
            checked={value === false}
            onChange={() => onChange(false)}
            className="mr-2 h-4 w-4 text-[#E8DCC4] focus:ring-[#E8DCC4]"
          />
          <span className="text-gray-700">No</span>
        </label>
      </div>
      {showDescription && (
        <textarea
          value={descriptionValue || ''}
          onChange={(e) => onDescriptionChange?.(e.target.value)}
          placeholder={descriptionPlaceholder}
          rows={3}
          className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#E8DCC4] focus:border-transparent ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
        />
      )}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
}

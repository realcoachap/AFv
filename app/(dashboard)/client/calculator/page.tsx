'use client'

import { useState } from 'react'
import NavBar from '@/app/components/NavBar'

type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
type Goal = 'lose' | 'maintain' | 'gain'

export default function ClientCalorieCalculatorPage() {
  const [formData, setFormData] = useState({
    weight: '',
    height: '',
    age: '',
    gender: 'male',
    activityLevel: 'moderate' as ActivityLevel,
    goal: 'maintain' as Goal,
    weightUnit: 'pounds',
    heightUnit: 'inches',
  })

  const [results, setResults] = useState<{
    bmr: number
    tdee: number
    targetCalories: number
    protein: number
    carbs: number
    fats: number
  } | null>(null)

  function calculateBMR() {
    const weight = parseFloat(formData.weight)
    const height = parseFloat(formData.height)
    const age = parseFloat(formData.age)

    if (!weight || !height || !age) return null

    // Convert to metric
    const weightKg = formData.weightUnit === 'pounds' ? weight * 0.453592 : weight
    const heightCm = formData.heightUnit === 'inches' ? height * 2.54 : height

    // Mifflin-St Jeor Equation
    let bmr: number
    if (formData.gender === 'male') {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5
    } else {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161
    }

    return Math.round(bmr)
  }

  function calculateTDEE(bmr: number) {
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9,
    }

    return Math.round(bmr * activityMultipliers[formData.activityLevel])
  }

  function calculateTargetCalories(tdee: number) {
    const adjustments = {
      lose: -500, // 1 lb per week
      maintain: 0,
      gain: 300, // ~0.5-0.75 lb per week
    }

    return tdee + adjustments[formData.goal]
  }

  function calculateMacros(calories: number) {
    const weight = parseFloat(formData.weight)
    const weightKg = formData.weightUnit === 'pounds' ? weight * 0.453592 : weight

    // Protein: 2g per kg body weight
    const proteinGrams = Math.round(weightKg * 2)
    const proteinCalories = proteinGrams * 4

    // Fats: 25-30% of calories
    const fatsCalories = Math.round(calories * 0.275)
    const fatsGrams = Math.round(fatsCalories / 9)

    // Carbs: remaining calories
    const carbsCalories = calories - proteinCalories - fatsCalories
    const carbsGrams = Math.round(carbsCalories / 4)

    return {
      protein: proteinGrams,
      carbs: carbsGrams,
      fats: fatsGrams,
    }
  }

  function handleCalculate() {
    const bmr = calculateBMR()
    if (!bmr) return

    const tdee = calculateTDEE(bmr)
    const targetCalories = calculateTargetCalories(tdee)
    const macros = calculateMacros(targetCalories)

    setResults({
      bmr,
      tdee,
      targetCalories,
      ...macros,
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar role="client" backLink="/client/dashboard" backText="← Dashboard" />

      <main className="max-w-4xl mx-auto p-3 sm:p-6">
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#1A2332] mb-2">Calorie Calculator</h2>
          <p className="text-gray-600 mb-6">Calculate your daily calorie and macro targets</p>

          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E8DCC4] focus:border-transparent"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age
                </label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  placeholder="30"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E8DCC4] focus:border-transparent"
                />
              </div>
            </div>

            {/* Weight */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Weight
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  placeholder="180"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E8DCC4] focus:border-transparent"
                />
                <select
                  value={formData.weightUnit}
                  onChange={(e) => setFormData({ ...formData, weightUnit: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E8DCC4] focus:border-transparent"
                >
                  <option value="pounds">lbs</option>
                  <option value="kilograms">kg</option>
                </select>
              </div>
            </div>

            {/* Height */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Height
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.1"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  placeholder="72"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E8DCC4] focus:border-transparent"
                />
                <select
                  value={formData.heightUnit}
                  onChange={(e) => setFormData({ ...formData, heightUnit: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E8DCC4] focus:border-transparent"
                >
                  <option value="inches">inches</option>
                  <option value="centimeters">cm</option>
                </select>
              </div>
            </div>

            {/* Activity Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Activity Level
              </label>
              <select
                value={formData.activityLevel}
                onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value as ActivityLevel })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E8DCC4] focus:border-transparent"
              >
                <option value="sedentary">Sedentary (little to no exercise)</option>
                <option value="light">Light (1-3 days/week)</option>
                <option value="moderate">Moderate (3-5 days/week)</option>
                <option value="active">Active (6-7 days/week)</option>
                <option value="very_active">Very Active (intense daily training)</option>
              </select>
            </div>

            {/* Goal */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Goal
              </label>
              <select
                value={formData.goal}
                onChange={(e) => setFormData({ ...formData, goal: e.target.value as Goal })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E8DCC4] focus:border-transparent"
              >
                <option value="lose">Fat Loss (-500 cal/day, ~1 lb/week)</option>
                <option value="maintain">Maintain Weight</option>
                <option value="gain">Muscle Gain (+300 cal/day, ~0.5 lb/week)</option>
              </select>
            </div>

            {/* Calculate Button */}
            <button
              onClick={handleCalculate}
              className="w-full px-6 py-3 bg-[#E8DCC4] text-[#1A2332] rounded-lg font-semibold hover:bg-[#D8CCA4] transition-colors"
            >
              Calculate
            </button>
          </div>
        </div>

        {/* Results */}
        {results && (
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <h3 className="text-xl font-bold text-[#1A2332] mb-4">Your Results</h3>

            <div className="space-y-4">
              {/* Calorie Targets */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">BMR (Base)</p>
                  <p className="text-2xl font-bold text-[#1A2332]">{results.bmr}</p>
                  <p className="text-xs text-gray-500">calories/day</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">TDEE (Maintenance)</p>
                  <p className="text-2xl font-bold text-[#1A2332]">{results.tdee}</p>
                  <p className="text-xs text-gray-500">calories/day</p>
                </div>
                <div className="bg-[#E8DCC4] rounded-lg p-4">
                  <p className="text-sm text-gray-700 mb-1 font-medium">Your Target</p>
                  <p className="text-2xl font-bold text-[#1A2332]">{results.targetCalories}</p>
                  <p className="text-xs text-gray-700">calories/day</p>
                </div>
              </div>

              {/* Macros */}
              <div className="border-t pt-4">
                <h4 className="font-semibold text-[#1A2332] mb-3">Your Daily Macros</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Protein</p>
                    <p className="text-xl font-bold text-blue-700">{results.protein}g</p>
                    <p className="text-xs text-gray-500">{Math.round((results.protein * 4 / results.targetCalories) * 100)}%</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Carbs</p>
                    <p className="text-xl font-bold text-green-700">{results.carbs}g</p>
                    <p className="text-xs text-gray-500">{Math.round((results.carbs * 4 / results.targetCalories) * 100)}%</p>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Fats</p>
                    <p className="text-xl font-bold text-orange-700">{results.fats}g</p>
                    <p className="text-xs text-gray-500">{Math.round((results.fats * 9 / results.targetCalories) * 100)}%</p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-gray-700">
                <p className="font-medium mb-2">💪 What This Means:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li><strong>BMR:</strong> Calories your body burns at rest</li>
                  <li><strong>TDEE:</strong> Total calories burned including activity</li>
                  <li><strong>Target:</strong> Calories to eat daily for your goal</li>
                  <li><strong>Protein:</strong> Builds and maintains muscle</li>
                  <li><strong>Carbs:</strong> Primary energy source</li>
                  <li><strong>Fats:</strong> Essential for hormones and health</li>
                </ul>
                <p className="mt-3 text-xs text-blue-800 font-medium">
                  💡 Share these results with your trainer to customize your plan!
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

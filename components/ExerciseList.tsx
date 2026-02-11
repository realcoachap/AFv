'use client';

import React from 'react';
import { Exercise } from '../types/workout';
import SetLogger from './SetLogger';

interface ExerciseListProps {
  exercises: Exercise[];
  onUpdateExercise: (exerciseId: string, updates: Partial<Exercise>) => void;
  onRemoveExercise: (exerciseId: string) => void;
  onAddSet: (exerciseId: string) => void;
  onUpdateSet: (exerciseId: string, setId: string, updates: Partial<import('../types/workout').Set>) => void;
  onRemoveSet: (exerciseId: string, setId: string) => void;
}

export default function ExerciseList({
  exercises,
  onUpdateExercise,
  onRemoveExercise,
  onAddSet,
  onUpdateSet,
  onRemoveSet
}: ExerciseListProps) {
  return (
    <div className="space-y-4">
      {exercises.map((exercise, index) => (
        <ExerciseCard
          key={exercise.id}
          exercise={exercise}
          index={index}
          onUpdate={onUpdateExercise}
          onRemove={onRemoveExercise}
          onAddSet={onAddSet}
          onUpdateSet={onUpdateSet}
          onRemoveSet={onRemoveSet}
        />
      ))}
    </div>
  );
}

interface ExerciseCardProps {
  exercise: Exercise;
  index: number;
  onUpdate: (exerciseId: string, updates: Partial<Exercise>) => void;
  onRemove: (exerciseId: string) => void;
  onAddSet: (exerciseId: string) => void;
  onUpdateSet: (exerciseId: string, setId: string, updates: Partial<import('../types/workout').Set>) => void;
  onRemoveSet: (exerciseId: string, setId: string) => void;
}

function ExerciseCard({ 
  exercise, 
  index, 
  onUpdate, 
  onRemove, 
  onAddSet, 
  onUpdateSet, 
  onRemoveSet 
}: ExerciseCardProps) {
  const completedSets = exercise.sets.filter(s => s.completed).length;
  const totalVolume = exercise.sets
    .filter(s => s.completed)
    .reduce((sum, set) => sum + (set.weight * set.reps), 0);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Exercise Header */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-sm">
          {index + 1}
        </div>
        <input
          type="text"
          value={exercise.name}
          onChange={(e) => onUpdate(exercise.id, { name: e.target.value })}
          placeholder="Exercise name (e.g., Bench Press)"
          className="flex-1 font-semibold text-gray-900 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 -ml-2"
        />
        <button
          onClick={() => onRemove(exercise.id)}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          title="Remove exercise"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* Sets Table */}
      <div className="p-4">
        {exercise.sets.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <p className="text-sm mb-3">No sets logged yet</p>
            <button
              onClick={() => onAddSet(exercise.id)}
              className="inline-flex items-center gap-1 text-blue-600 font-medium hover:text-blue-700"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add your first set
            </button>
          </div>
        ) : (
          <>
            {/* Table Header - Hidden on mobile */}
            <div className="hidden sm:grid grid-cols-12 gap-2 mb-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="col-span-1 text-center">Set</div>
              <div className="col-span-3">Weight</div>
              <div className="col-span-2">Reps</div>
              <div className="col-span-2">RPE</div>
              <div className="col-span-3">Status</div>
              <div className="col-span-1"></div>
            </div>

            {/* Sets */}
            <div className="space-y-2">
              {exercise.sets.map((set, setIndex) => (
                <SetLogger
                  key={set.id}
                  set={set}
                  setNumber={setIndex + 1}
                  onUpdate={(updates) => onUpdateSet(exercise.id, set.id, updates)}
                  onRemove={() => onRemoveSet(exercise.id, set.id)}
                />
              ))}
            </div>
          </>
        )}

        {/* Add Set Button */}
        {exercise.sets.length > 0 && (
          <button
            onClick={() => onAddSet(exercise.id)}
            className="w-full mt-3 flex items-center justify-center gap-1 text-sm text-blue-600 font-medium py-2 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Set
          </button>
        )}

        {/* Exercise Summary */}
        {completedSets > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-sm">
            <span className="text-gray-500">
              {completedSets} of {exercise.sets.length} sets completed
            </span>
            <span className="font-semibold text-gray-900">
              Volume: {totalVolume.toLocaleString()} lbs
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

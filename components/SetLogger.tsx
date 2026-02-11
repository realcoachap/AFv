'use client';

import React from 'react';
import { Set } from '../types/workout';

interface SetLoggerProps {
  set: Set;
  setNumber: number;
  onUpdate: (updates: Partial<Set>) => void;
  onRemove: () => void;
}

export default function SetLogger({ set, setNumber, onUpdate, onRemove }: SetLoggerProps) {
  const rpeLabels: Record<number, string> = {
    1: '1 - Very Light',
    2: '2 - Light',
    3: '3 - Moderate',
    4: '4 - Somewhat Hard',
    5: '5 - Hard',
    6: '6 - Hard+',
    7: '7 - Very Hard',
    8: '8 - Very Hard+',
    9: '9 - Extremely Hard',
    10: '10 - Max Effort'
  };

  const getRPEColor = (rpe: number): string => {
    if (rpe <= 5) return 'bg-green-100 text-green-700 border-green-200';
    if (rpe <= 7) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    if (rpe <= 8) return 'bg-orange-100 text-orange-700 border-orange-200';
    return 'bg-red-100 text-red-700 border-red-200';
  };

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-12 gap-3 p-3 rounded-xl transition-all ${
      set.completed ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-100'
    }`}>
      {/* Mobile Layout */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700">Set {setNumber}</span>
          <button
            onClick={() => onUpdate({ completed: !set.completed })}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              set.completed
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-600 border border-gray-300'
            }`}
          >
            {set.completed ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Done
              </>
            ) : (
              'Complete'
            )}
          </button>
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          {/* Weight Input */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">Weight</label>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="0.5"
                value={set.weight || ''}
                onChange={(e) => onUpdate({ weight: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-center font-semibold text-gray-900 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                placeholder="0"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">lbs</span>
            </div>
          </div>

          {/* Reps Input */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">Reps</label>
            <input
              type="number"
              min="0"
              value={set.reps || ''}
              onChange={(e) => onUpdate({ reps: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 text-center font-semibold text-gray-900 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              placeholder="0"
            />
          </div>

          {/* RPE Select */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">RPE</label>
            <select
              value={set.rpe}
              onChange={(e) => onUpdate({ rpe: parseInt(e.target.value) })}
              className={`w-full px-2 py-2 text-center font-semibold rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-blue-200 ${getRPEColor(set.rpe)}`}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rpe) => (
                <option key={rpe} value={rpe}>{rpe}</option>
              ))}
            </select>
          </div>
        </div>

        {/* RPE Label */}
        <div className="mt-2 text-xs text-gray-500 text-center">
          {rpeLabels[set.rpe]}
        </div>

        {/* Delete Button */}
        <button
          onClick={onRemove}
          className="mt-2 w-full flex items-center justify-center gap-1 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Remove Set
        </button>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:contents">
        {/* Set Number */}
        <div className="col-span-1 flex items-center justify-center">
          <span className={`w-8 h-8 flex items-center justify-center rounded-lg font-semibold text-sm ${
            set.completed 
              ? 'bg-green-600 text-white' 
              : 'bg-gray-200 text-gray-600'
          }`}>
            {setNumber}
          </span>
        </div>

        {/* Weight Input */}
        <div className="col-span-3">
          <div className="relative">
            <input
              type="number"
              min="0"
              step="0.5"
              value={set.weight || ''}
              onChange={(e) => onUpdate({ weight: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 text-center font-semibold text-gray-900 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              placeholder="0"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">lbs</span>
          </div>
        </div>

        {/* Reps Input */}
        <div className="col-span-2">
          <input
            type="number"
            min="0"
            value={set.reps || ''}
            onChange={(e) => onUpdate({ reps: parseInt(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-center font-semibold text-gray-900 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            placeholder="0"
          />
        </div>

        {/* RPE Select */}
        <div className="col-span-2">
          <select
            value={set.rpe}
            onChange={(e) => onUpdate({ rpe: parseInt(e.target.value) })}
            className={`w-full px-2 py-2 text-center font-semibold rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-blue-200 ${getRPEColor(set.rpe)}`}
            title={rpeLabels[set.rpe]}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rpe) => (
              <option key={rpe} value={rpe}>{rpe}</option>
            ))}
          </select>
        </div>

        {/* Complete Button */}
        <div className="col-span-3">
          <button
            onClick={() => onUpdate({ completed: !set.completed })}
            className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-medium transition-all ${
              set.completed
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {set.completed ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Completed
              </>
            ) : (
              'Complete Set'
            )}
          </button>
        </div>

        {/* Delete Button */}
        <div className="col-span-1 flex items-center justify-center">
          <button
            onClick={onRemove}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Remove set"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

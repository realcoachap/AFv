'use client';

import React from 'react';
import { Workout, Exercise, Set } from '../types/workout';

interface WorkoutSummaryProps {
  workout: Workout;
  duration: number;
  totalSets: number;
  totalVolume: number;
  onNewWorkout: () => void;
}

export default function WorkoutSummary({ 
  workout, 
  duration, 
  totalSets, 
  totalVolume,
  onNewWorkout 
}: WorkoutSummaryProps) {
  const formatDuration = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) return `${hrs}h ${mins}m ${secs}s`;
    return `${mins}m ${secs}s`;
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getPersonalRecords = (exercises: Exercise[]): { exercise: string; set: Set }[] => {
    const prs: { exercise: string; set: Set }[] = [];
    exercises.forEach(ex => {
      if (ex.name && ex.sets.length > 0) {
        const maxSet = ex.sets.reduce((max, set) => 
          (set.weight * set.reps) > (max.weight * max.reps) ? set : max
        );
        if (maxSet.weight > 0) {
          prs.push({ exercise: ex.name, set: maxSet });
        }
      }
    });
    return prs;
  };

  const personalRecords = getPersonalRecords(workout.exercises);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-4">
      <div className="max-w-lg mx-auto">
        {/* Success Header */}
        <div className="text-center py-8">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-200 animate-bounce">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Workout Complete!</h1>
          <p className="text-gray-500">{formatDate(workout.startTime)}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Duration
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatDuration(duration)}</p>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Sets
            </div>
            <p className="text-2xl font-bold text-gray-900">{totalSets}</p>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Exercises
            </div>
            <p className="text-2xl font-bold text-gray-900">{workout.exercises.length}</p>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
              Volume
            </div>
            <p className="text-2xl font-bold text-gray-900">{totalVolume.toLocaleString()} <span className="text-sm font-normal text-gray-500">lbs</span></p>
          </div>
        </div>

        {/* Personal Records */}
        {personalRecords.length > 0 && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 mb-6 border border-amber-200">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🏆</span>
              <h3 className="font-bold text-amber-900">Top Sets</h3>
            </div>
            <div className="space-y-2">
              {personalRecords.map((pr, idx) => (
                <div key={idx} className="flex items-center justify-between bg-white/60 rounded-lg px-3 py-2">
                  <span className="font-medium text-gray-800">{pr.exercise}</span>
                  <span className="font-bold text-amber-700">
                    {pr.set.weight} lbs × {pr.set.reps}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Exercise Details */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h3 className="font-bold text-gray-900">Exercise Breakdown</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {workout.exercises.map((exercise, idx) => {
              const completedSets = exercise.sets.filter(s => s.completed);
              const volume = completedSets.reduce((sum, set) => sum + (set.weight * set.reps), 0);
              
              return (
                <div key={exercise.id} className="px-4 py-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">
                      {idx + 1}. {exercise.name || 'Unnamed Exercise'}
                    </span>
                    <span className="text-sm text-gray-500">
                      {completedSets.length} sets
                    </span>
                  </div>
                  {completedSets.length > 0 && (
                    <div className="text-sm text-gray-600 space-y-1">
                      {completedSets.map((set, setIdx) => (
                        <div key={setIdx} className="flex items-center gap-2">
                          <span className="w-5 h-5 bg-green-100 text-green-700 rounded text-xs flex items-center justify-center font-medium">
                            {setIdx + 1}
                          </span>
                          <span>{set.weight} lbs × {set.reps} reps</span>
                          <span className="text-gray-400">@ RPE {set.rpe}</span>
                        </div>
                      ))}
                      <div className="pt-1 text-xs text-gray-500">
                        Volume: {volume.toLocaleString()} lbs
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Notes */}
        {workout.notes && (
          <div className="bg-blue-50 rounded-2xl p-4 mb-6 border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <h3 className="font-semibold text-blue-900">Notes</h3>
            </div>
            <p className="text-blue-800 text-sm">{workout.notes}</p>
          </div>
        )}

        {/* Time Info */}
        <div className="text-center text-sm text-gray-500 mb-6">
          Started: {formatTime(workout.startTime)}
          {workout.endTime && ` • Finished: ${formatTime(workout.endTime)}`}
        </div>

        {/* Action Button */}
        <button
          onClick={onNewWorkout}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-200"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Start New Workout
        </button>
      </div>
    </div>
  );
}

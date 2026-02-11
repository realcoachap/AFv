'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Exercise, Set, Workout } from '../types/workout';
import ExerciseList from './ExerciseList';
import WorkoutSummary from './WorkoutSummary';

interface WorkoutTrackerProps {
  initialWorkoutName?: string;
  onSave?: (workout: Workout) => void;
}

export default function WorkoutTracker({ 
  initialWorkoutName = 'New Workout', 
  onSave 
}: WorkoutTrackerProps) {
  const [workout, setWorkout] = useState<Workout>({
    id: crypto.randomUUID(),
    name: initialWorkoutName,
    startTime: new Date(),
    exercises: [],
    notes: ''
  });
  
  const [isActive, setIsActive] = useState(true);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showSummary, setShowSummary] = useState(false);

  // Timer effect
  useEffect(() => {
    if (!isActive) return;
    
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - workout.startTime.getTime()) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, workout.startTime]);

  const formatDuration = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const addExercise = useCallback(() => {
    const newExercise: Exercise = {
      id: crypto.randomUUID(),
      name: '',
      sets: []
    };
    setWorkout(prev => ({
      ...prev,
      exercises: [...prev.exercises, newExercise]
    }));
  }, []);

  const updateExercise = useCallback((exerciseId: string, updates: Partial<Exercise>) => {
    setWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.map(ex => 
        ex.id === exerciseId ? { ...ex, ...updates } : ex
      )
    }));
  }, []);

  const removeExercise = useCallback((exerciseId: string) => {
    setWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.filter(ex => ex.id !== exerciseId)
    }));
  }, []);

  const addSet = useCallback((exerciseId: string) => {
    setWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.map(ex => {
        if (ex.id !== exerciseId) return ex;
        const newSet: Set = {
          id: crypto.randomUUID(),
          reps: 0,
          weight: 0,
          rpe: 7,
          completed: false
        };
        return { ...ex, sets: [...ex.sets, newSet] };
      })
    }));
  }, []);

  const updateSet = useCallback((exerciseId: string, setId: string, updates: Partial<Set>) => {
    setWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.map(ex => {
        if (ex.id !== exerciseId) return ex;
        return {
          ...ex,
          sets: ex.sets.map(set => 
            set.id === setId ? { ...set, ...updates } : set
          )
        };
      })
    }));
  }, []);

  const removeSet = useCallback((exerciseId: string, setId: string) => {
    setWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.map(ex => {
        if (ex.id !== exerciseId) return ex;
        return { ...ex, sets: ex.sets.filter(set => set.id !== setId) };
      })
    }));
  }, []);

  const handleCompleteWorkout = () => {
    const completedWorkout = {
      ...workout,
      endTime: new Date(),
      duration: elapsedSeconds
    };
    setIsActive(false);
    setShowSummary(true);
    onSave?.(completedWorkout as Workout);
  };

  const handleReset = () => {
    setWorkout({
      id: crypto.randomUUID(),
      name: initialWorkoutName,
      startTime: new Date(),
      exercises: [],
      notes: ''
    });
    setElapsedSeconds(0);
    setIsActive(true);
    setShowSummary(false);
  };

  const totalSets = workout.exercises.reduce((acc, ex) => acc + ex.sets.filter(s => s.completed).length, 0);
  const totalVolume = workout.exercises.reduce((acc, ex) => 
    acc + ex.sets.filter(s => s.completed).reduce((sum, set) => sum + (set.weight * set.reps), 0), 0
  );

  if (showSummary) {
    return (
      <WorkoutSummary 
        workout={workout}
        duration={elapsedSeconds}
        totalSets={totalSets}
        totalVolume={totalVolume}
        onNewWorkout={handleReset}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <input
              type="text"
              value={workout.name}
              onChange={(e) => setWorkout(prev => ({ ...prev, name: e.target.value }))}
              className="text-lg font-bold text-gray-900 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 -ml-2 w-full max-w-xs"
              placeholder="Workout Name"
            />
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-xl font-mono font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {formatDuration(elapsedSeconds)}
              </div>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="flex gap-4 mt-3 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              {workout.exercises.length} exercises
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {totalSets} sets
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
              {totalVolume.toLocaleString()} lbs
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        {workout.exercises.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to crush it?</h3>
            <p className="text-gray-500 mb-6">Add your first exercise to get started</p>
            <button
              onClick={addExercise}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Exercise
            </button>
          </div>
        ) : (
          <ExerciseList
            exercises={workout.exercises}
            onUpdateExercise={updateExercise}
            onRemoveExercise={removeExercise}
            onAddSet={addSet}
            onUpdateSet={updateSet}
            onRemoveSet={removeSet}
          />
        )}

        {/* Add Exercise Button */}
        {workout.exercises.length > 0 && (
          <button
            onClick={addExercise}
            className="w-full mt-4 flex items-center justify-center gap-2 bg-white border-2 border-dashed border-gray-300 text-gray-600 px-4 py-4 rounded-xl font-medium hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Another Exercise
          </button>
        )}

        {/* Notes */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Workout Notes</label>
          <textarea
            value={workout.notes || ''}
            onChange={(e) => setWorkout(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="How did it feel? Any PRs?"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
            rows={3}
          />
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4 safe-area-pb">
        <div className="max-w-3xl mx-auto flex gap-3">
          <button
            onClick={() => setIsActive(!isActive)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all ${
              isActive 
                ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' 
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            {isActive ? (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Pause
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Resume
              </>
            )}
          </button>
          <button
            onClick={handleCompleteWorkout}
            disabled={workout.exercises.length === 0}
            className="flex-[2] flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 active:scale-95 transition-all shadow-lg shadow-green-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Finish Workout
          </button>
        </div>
      </div>
    </div>
  );
}

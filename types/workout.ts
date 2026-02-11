// types/workout.ts
export interface Set {
  id: string;
  reps: number;
  weight: number;
  rpe: number;
  completed: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  sets: Set[];
}

export interface Workout {
  id: string;
  name: string;
  startTime: Date;
  endTime?: Date;
  exercises: Exercise[];
  notes?: string;
}

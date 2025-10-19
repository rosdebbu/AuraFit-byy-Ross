export interface Nutrients {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Meal extends Nutrients {
  id: string;
  description: string;
}

export type Mood = 1 | 2 | 3 | 4 | 5;

export interface Checkin {
  id: string;
  date: string;
  mood: Mood;
  journal: string;
  gratitude: string;
}

export interface Workout {
  id:string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
}
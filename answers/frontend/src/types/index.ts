export interface Habit {
  id: string;
  name: string;
  color: string;
  created_at: string;
}

export interface HabitCompletion {
  id: string;
  habit_id: string;
  completion_date: string;
  created_at: string;
}

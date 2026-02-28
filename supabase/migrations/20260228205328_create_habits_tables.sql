/*
  # FOR USE IN SUPABASE!!!!
  # Create habits and habit_completions tables

  1. New Tables
    - `habits`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `color` (text, not null) - stores hex color code
      - `created_at` (timestamp with time zone)
    
    - `habit_completions`
      - `id` (uuid, primary key)
      - `habit_id` (uuid, foreign key to habits)
      - `completion_date` (date, not null)
      - `created_at` (timestamp with time zone)
      - Unique constraint on (habit_id, completion_date) to prevent duplicates

  2. Security
    - Enable RLS on both tables
    - Public access for reading habits (all users can see habits list)
    - Public access for habit completions (basic tracking)

  3. Notes
    - habits table stores user-defined habits with assigned colors
    - habit_completions table tracks when each habit was completed (one entry per day per habit)
*/

CREATE TABLE IF NOT EXISTS habits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  color text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS habit_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id uuid NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  completion_date date NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(habit_id, completion_date)
);

ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_completions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Habits are viewable by everyone"
  ON habits FOR SELECT
  USING (true);

CREATE POLICY "Habits can be inserted by anyone"
  ON habits FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Habits can be deleted by anyone"
  ON habits FOR DELETE
  USING (true);

CREATE POLICY "Habit completions are viewable by everyone"
  ON habit_completions FOR SELECT
  USING (true);

CREATE POLICY "Habit completions can be inserted by anyone"
  ON habit_completions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Habit completions can be deleted by anyone"
  ON habit_completions FOR DELETE
  USING (true);

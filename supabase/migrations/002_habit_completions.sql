/*
  # This is the second migration file for the Supabase schema 
  if you want to add a by-date completion tracking table
  (for example, if you want to track how many times a habit was completed each day)
  
  # PUT THIS INTO SUPABASE SCHEMA TO CREATE THE HABIT_COMPLETIONS TABLE
  # Date-specific tracking: one row per habit per day
*/

-- Drop everything for a clean slate
DROP TABLE IF EXISTS habit_completions CASCADE;
DROP TABLE IF EXISTS habits CASCADE;

-- Recreate habits (no completed column — that lives in completions now)
CREATE TABLE habits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  color text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Per-day completion tracking
CREATE TABLE habit_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id uuid NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  completion_date date NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(habit_id, completion_date)
);
/*
  # Create habit_completions table
  # Date-specific tracking: one row per habit per day

  - `habit_completions`
    - `id` (uuid, primary key)
    - `habit_id` (uuid, references habits)
    - `completion_date` (date, not null)
    - `created_at` (timestamptz)
    - UNIQUE(habit_id, completion_date)

  RLS enabled with public SELECT, INSERT, DELETE.
*/

CREATE TABLE IF NOT EXISTS habit_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id uuid NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  completion_date date NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(habit_id, completion_date)
);

ALTER TABLE habit_completions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Habit completions are viewable by everyone"
  ON habit_completions FOR SELECT
  USING (true);

CREATE POLICY "Habit completions can be inserted by anyone"
  ON habit_completions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Habit completions can be deleted by anyone"
  ON habit_completions FOR DELETE
  USING (true);

/*
  # Create habits table (simple version)
  # Uses a `completed` boolean on each habit — no date-specific tracking

  - `habits`
    - `id` (uuid, primary key)
    - `name` (text, not null)
    - `color` (text, not null)
    - `completed` (boolean, default false)
    - `created_at` (timestamptz)

  RLS enabled with public SELECT, INSERT, UPDATE, DELETE.
*/

CREATE TABLE IF NOT EXISTS habits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  color text NOT NULL,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE habits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Habits are viewable by everyone"
  ON habits FOR SELECT
  USING (true);

CREATE POLICY "Habits can be inserted by anyone"
  ON habits FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Habits can be deleted by anyone"
  ON habits FOR DELETE
  USING (true);

CREATE POLICY "Habits can be updated by anyone"
  ON habits FOR UPDATE
  USING (true)
  WITH CHECK (true);

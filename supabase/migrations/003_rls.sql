/*
  # PUT THIS INTO SUPABASE SCHEMA TO ADD ROW LEVEL SECURITY
*/

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

import { Router } from 'express';
import { supabase } from '../lib/supabase.js';

export const completionsRouter = Router();

// GET / — fetches all habit completions for a given date
// Used by the frontend to know which habits are checked off on a specific day
// Example: GET /completions?date=2026-03-02
completionsRouter.get('/', async (req, res) => {
  try {
    const date = req.query.date as string;

    // date is required — we can't fetch completions without knowing which day
    if (!date) {
      res.status(400).json({ error: 'date query parameter is required' });
      return;
    }

    // Fetch all rows from habit_completions where the date matches
    const { data, error } = await supabase
      .from('habit_completions')
      .select('*')
      .eq('completion_date', date);

    if (error) throw error;

    // Return the completions, or an empty array if none exist for that day
    res.json(data ?? []);
  } catch (err) {
    console.error('Failed to fetch completions:', err);
    res.status(500).json({ error: 'Failed to fetch completions' });
  }
});

// POST /toggle — toggles a habit's completion status for a given date
// Works like a light switch: if the habit is complete, mark it incomplete, and vice versa
// Example: POST /completions/toggle { habitId: '123', date: '2026-03-02' }
completionsRouter.post('/toggle', async (req, res) => {
  try {
    const { habitId, date } = req.body;

    // Both fields are required to uniquely identify which habit + day to toggle
    if (!habitId || !date) {
      res.status(400).json({ error: 'habitId and date are required' });
      return;
    }

    // Check if a completion row already exists for this habit on this date
    // maybeSingle() returns null if no row is found (instead of throwing an error)
    const { data: existing } = await supabase
      .from('habit_completions')
      .select('id')
      .eq('habit_id', habitId)
      .eq('completion_date', date)
      .maybeSingle();

    if (existing) {
      // Sticky note is on the wall — rip it off (habit was complete, mark it incomplete)
      const { error } = await supabase
        .from('habit_completions')
        .delete()
        .eq('habit_id', habitId)
        .eq('completion_date', date);

      if (error) throw error;
      res.json({ completed: false });
    } else {
      // No sticky note — put one up (habit was incomplete, mark it complete)
      const { data, error } = await supabase
        .from('habit_completions')
        .insert([{ habit_id: habitId, completion_date: date }])
        .select()
        .single();

      if (error) throw error;
      res.json({ completed: true, data });
    }
  } catch (err) {
    console.error('Failed to toggle completion:', err);
    res.status(500).json({ error: 'Failed to toggle completion' });
  }
});
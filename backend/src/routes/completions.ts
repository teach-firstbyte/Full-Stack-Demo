import { Router } from 'express';
import { supabase } from '../lib/supabase.js';

export const completionsRouter = Router();

// GET /api/completions
// - Reads the `habits` table and returns an array of habit IDs where `completed = true`.
// - Used by the frontend to know which habits should be shown as checked for the current view.
// - Response shape: string[] of habit IDs.
completionsRouter.get('/', async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from('habits')
      .select('id')
      .eq('completed', true);

    if (error) throw error;

    const completedIds = (data ?? []).map((h) => h.id);
    res.json(completedIds);
  } catch (err) {
    console.error('Failed to fetch completions:', err);
    res.status(500).json({ error: 'Failed to fetch completions' });
  }
});

completionsRouter.patch('/toggle', async (req, res) => {
  try {
    const { habitId } = req.body;
    
    if (!habitId) {
      res.status(400).json({ error: 'habitId is required' });
      return;
    }

    const { data: habit, error: fetchError } = await supabase
      .from('habits')
      .select('completed')
      .eq('id', habitId)
      .single();

    // If the habit doesn't exist, return a 404 so the client can handle it explicitly.
    if (fetchError || !habit) {
      res.status(404).json({ error: 'Habit not found' });
      return;
    }

    // Flip the current completed state: true -> false, false -> true.
    // Expect boolean value
    const newCompleted: boolean = !habit.completed;

    const { error: updateError } = await supabase
      .from('habits')
      .update({ completed: newCompleted })
      .eq('id', habitId);

    if (updateError) throw updateError;

    // Frontend expects a small payload indicating the new state.
    res.json({ completed: newCompleted });
  } catch (err) {
    console.error('Failed to toggle completion:', err);
    res.status(500).json({ error: 'Failed to toggle completion' });
  }
});

// // GET / — fetches all habit completions for a given date
// // Used by the frontend to know which habits are checked off on a specific day
// // Example: GET /completions?date=2026-03-02
// completionsRouter.get('/', async (req, res) => {
//   try {
//     const date = req.query.date as string;
//     if (!date) {
//       res.status(400).json({ error: 'date query parameter is required' });
//       return;
//     }
//     const { data, error } = await supabase
//       .from('habit_completions')
//       .select('*')
//       .eq('completion_date', date);

//     if (error) throw error;
//     res.json(data ?? []);
//   } catch (err) {
//     console.error('Failed to fetch completions:', err);
//     res.status(500).json({ error: 'Failed to fetch completions' });
//   }
// });

// // POST /toggle — toggles a habit's completion status for a given date
// // Works like a light switch: if the habit is complete, mark it incomplete, and vice versa
// // Example: POST /completions/toggle { habitId: '123', date: '2026-03-02' }
// completionsRouter.post('/toggle', async (req, res) => {
//   try {
//     const { habitId, date } = req.body;
//     if (!habitId || !date) {
//       res.status(400).json({ error: 'habitId and date are required' });
//       return;
//     }
//     const { data: existing } = await supabase
//       .from('habit_completions')
//       .select('id')
//       .eq('habit_id', habitId)
//       .eq('completion_date', date)
//       .maybeSingle();

//     if (existing) {
//       const { error } = await supabase
//         .from('habit_completions')
//         .delete()
//         .eq('habit_id', habitId)
//         .eq('completion_date', date);

//       if (error) throw error;
//       res.json({ completed: false });
//     } else {
//       const { data, error } = await supabase
//         .from('habit_completions')
//         .insert([{ habit_id: habitId, completion_date: date }])
//         .select()
//         .single();

//       if (error) throw error;
//       res.json({ completed: true, data });
//     }
//   } catch (err) {
//     console.error('Failed to toggle completion:', err);
//     res.status(500).json({ error: 'Failed to toggle completion' });
//   }
// });
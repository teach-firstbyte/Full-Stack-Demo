import { Router } from 'express';
import { supabase } from '../lib/supabase.js';

export const completionsRouter = Router();

completionsRouter.get('/', async (req, res) => {
  try {
    const date = req.query.date as string;
    if (!date) {
      res.status(400).json({ error: 'date query parameter is required' });
      return;
    }
    const { data, error } = await supabase
      .from('habit_completions')
      .select('*')
      .eq('completion_date', date);

    if (error) throw error;
    res.json(data ?? []);
  } catch (err) {
    console.error('Failed to fetch completions:', err);
    res.status(500).json({ error: 'Failed to fetch completions' });
  }
});

completionsRouter.post('/toggle', async (req, res) => {
  try {
    const { habitId, date } = req.body;
    if (!habitId || !date) {
      res.status(400).json({ error: 'habitId and date are required' });
      return;
    }
    const { data: existing } = await supabase
      .from('habit_completions')
      .select('id')
      .eq('habit_id', habitId)
      .eq('completion_date', date)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from('habit_completions')
        .delete()
        .eq('habit_id', habitId)
        .eq('completion_date', date);

      if (error) throw error;
      res.json({ completed: false });
    } else {
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

import { Router } from 'express';
import { supabase } from '../lib/supabase.js';

export const habitsRouter = Router();

habitsRouter.get('/', async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data ?? []);
  } catch (err) {
    console.error('Failed to fetch habits:', err);
    res.status(500).json({ error: 'Failed to fetch habits' });
  }
});

habitsRouter.post('/', async (req, res) => {
  try {
    const { name, color } = req.body;
    if (!name || !color) {
      res.status(400).json({ error: 'name and color are required' });
      return;
    }
    const { data, error } = await supabase
      .from('habits')
      .insert([{ name, color }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    console.error('Failed to add habit:', err);
    res.status(500).json({ error: 'Failed to add habit' });
  }
});

habitsRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('habits').delete().eq('id', id);

    if (error) throw error;
    res.status(204).send();
  } catch (err) {
    console.error('Failed to delete habit:', err);
    res.status(500).json({ error: 'Failed to delete habit' });
  }
});

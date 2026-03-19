import { Router } from 'express';
import { supabase } from '../lib/supabase.js';

export const habitsRouter = Router();

// GET / — fetches all habits, sorted newest first
// Used by the frontend to render the full list of habits on load
// Example: GET /habits
habitsRouter.get('/', async (_req, res) => {
  try {
    // _req is prefixed with _ to signal that the request object isn't used here
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .order('created_at', { ascending: false }); // newest habits appear at the top

    if (error) throw error;

    // Return the habits, or an empty array if none exist yet
    res.json(data ?? []);
  } catch (err) {
    console.error('Failed to fetch habits:', err);
    res.status(500).json({ error: 'Failed to fetch habits' });
  }
});

// POST / — creates a new habit
// Example: POST /habits { name: 'Exercise', color: '#ff0000' }
habitsRouter.post('/', async (req, res) => {
  try {
    const { name, color } = req.body;

    // Both fields are required to create a habit — name identifies it, color styles it
    if (!name || !color) {
      res.status(400).json({ error: 'name and color are required' });
      return;
    }

    // Insert the new habit and return the created row
    const { data, error } = await supabase
      .from('habits')
      .insert([{ name, color }])
      .select()
      .single(); // we inserted one row, so we expect exactly one back

    if (error) throw error;

    // 201 Created — signals that a new resource was successfully created
    res.status(201).json(data);
  } catch (err) {
    console.error('Failed to add habit:', err);
    res.status(500).json({ error: 'Failed to add habit' });
  }
});

// DELETE /:id — deletes a habit by its ID
// Also implicitly removes it from the UI since the frontend re-fetches after deletion
// Example: DELETE /habits/123
habitsRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params; // id comes from the URL, not the request body

    const { error } = await supabase.from('habits').delete().eq('id', id);

    if (error) throw error;

    // 204 No Content — success, but nothing to return since the resource no longer exists
    res.status(204).send();
  } catch (err) {
    console.error('Failed to delete habit:', err);
    res.status(500).json({ error: 'Failed to delete habit' });
  }
});
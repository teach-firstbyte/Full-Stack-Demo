import { useState, useEffect } from 'react';
import { Habit } from '../types';
import { apiFetch } from '../lib/api';

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHabits();
  }, []);

  // Fetch all habits from the backend
  async function fetchHabits() {
    // Set loading to true while fetching habits
    setLoading(true);
    try {
      const data = await apiFetch<Habit[]>('/api/habits', { method: 'GET' });
      setHabits(data);
    } finally {
      // Set loading to false after fetching habits
      setLoading(false);
    }
  }

  // ── Toggle a habit's completion for today ─────────────────
  // Optimistically flips the habit in local state, then confirms
  // (or rolls back) based on the backend response.
  const toggleHabit = async (id: string) => {
    // Optimistic update/update before the backend actually confirms (Makes website quicker)
    setHabits(prev =>
      prev.map(h => h.id === id ? { ...h, completed: !h.completed } : h)
    );

    try {
      const updated: Habit = await apiFetch('/api/completions/toggle/', {
        method: 'PATCH',
        body: { habitId: id }
      });
      // Confirm with backend's authoritative value
      setHabits(prev =>
        prev.map(h => h.id === id ? { ...h, completed: updated.completed } : h)
      );
    } catch (err) {
      // Roll back on failure — re-flip to the previous value
      setHabits(prev =>
        prev.map(h => h.id === id ? { ...h, completed: !h.completed } : h)
      );
      throw err; // Re-throw so TodayTab can show the error highlight
    }
  }

  // ── Add a new habit ───────────────────────────────────────
  // Appends the backend-confirmed habit object to local state
  // so neither tab needs to trigger a refetch.
  const addHabit = async (name: string, color: string) => {
    const newHabit: Habit = await apiFetch('/api/habits', {
      method: 'POST',
      body: { name, color }
    });
    setHabits(prev => [...prev, newHabit]);
  }

  // ── Delete a habit ────────────────────────────────────────
  // Removes the habit from local state after the backend confirms.
  const deleteHabit = async (id: string) => {
    await apiFetch('/api/habits/' + id, { method: 'DELETE' });
    setHabits(prev => prev.filter(h => h.id !== id));
  }

  return { 
    habits, 
    loading, 
    toggleHabit, 
    addHabit, 
    deleteHabit };
}
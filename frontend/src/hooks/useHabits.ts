import { useEffect, useState } from 'react';
import { Habit } from '../types';
import { apiFetch } from '../lib/api';

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    setLoading(true);
    const data = await apiFetch<Habit[]>('/api/habits', 
      { method: 'GET' });
    setHabits(data ?? []);
    setLoading(false);
  };

  const addHabit = async (name: string, color: string) => {
    // Create the new habit object
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      name: name,
      color: color,
      created_at: new Date().toISOString()
    };

    // Add the habit to the list
    const data: Habit = await apiFetch<Habit>('/api/habits', 
      { method: 'POST', body: newHabit });
    
    // Add the habit to the list
    setHabits([data, ...habits]);
    return data;
  };
 
  const deleteHabit = async (id: string) => {
    // Don't need to return any data
    await apiFetch<void>('/api/habits/' + id, 
      { method: 'DELETE' });

    // Remove the habit from the list
    setHabits(habits.filter(h => h.id !== id));
  };

  return {
    habits,
    loading,
    error,
    addHabit,
    deleteHabit,
    refetch: fetchHabits,
  };
}

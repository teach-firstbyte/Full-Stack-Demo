import { useEffect, useState } from 'react';
import { Habit } from '../types';
import { apiFetch } from '../lib/api';

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

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
    let newHabit: Habit = {
      id: crypto.randomUUID(),
      name: name,
      color: color,
      completed: false,
      created_at: new Date().toISOString()
    };

    const response = await apiFetch<Habit>('/api/habits', 
      { method: 'POST', body: newHabit });
    
    setHabits([response, ...habits]);
    return response;
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
    addHabit,
    deleteHabit,
    refetch: fetchHabits,
  };
}

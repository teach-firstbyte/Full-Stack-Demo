import { useEffect, useState } from 'react';
import { Habit } from '../types';
import { api } from '../lib/api';

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      setLoading(true);
      const data = await api.getHabits();
      setHabits(data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch habits');
    } finally {
      setLoading(false);
    }
  };

  const addHabit = async (name: string, color: string) => {
    try {
      const data = await api.addHabit(name, color);
      setHabits([data, ...habits]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add habit');
      throw err;
    }
  };

  const deleteHabit = async (id: string) => {
    try {
      await api.deleteHabit(id);
      setHabits(habits.filter(h => h.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete habit');
      throw err;
    }
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

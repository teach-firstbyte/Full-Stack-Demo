import { useEffect, useState } from 'react';
import { HabitCompletion } from '../types';
import { api } from '../lib/api';

function toDateStr(d: Date) {
  return d.toISOString().split('T')[0];
}

export function useHabitCompletions(date: Date) {
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);
  const [loading, setLoading] = useState(true);
  const dateStr = toDateStr(date);

  useEffect(() => {
    fetchCompletions(dateStr);
  }, [dateStr]);

  const fetchCompletions = async (d: string) => {
    try {
      setLoading(true);
      const data = await api.getCompletions(d);
      setCompletions(data ?? []);
    } catch (err) {
      console.error('Failed to fetch completions:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleCompletion = async (habitId: string, d: Date) => {
    const dStr = toDateStr(d);
    const isCompleted = completions.some(
      c => c.habit_id === habitId && c.completion_date === dStr
    );

    const result = await api.toggleCompletion(habitId, dStr);

    if (result.completed && result.data) {
      setCompletions([...completions, result.data]);
    } else {
      setCompletions(
        completions.filter(
          c => !(c.habit_id === habitId && c.completion_date === dStr)
        )
      );
    }
  };

  return {
    completions,
    loading,
    toggleCompletion,
    refetch: () => fetchCompletions(dateStr),
  };
}

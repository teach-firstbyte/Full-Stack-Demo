import { useState } from 'react';
import { Habit } from '../types';

interface TodayTabProps {
  habits: Habit[];
  onToggleHabit: (id: string) => Promise<void>;
}

export function TodayTab({ habits, onToggleHabit }: TodayTabProps) {
  // Tracks which habit IDs are awaiting a backend response
  const [pendingToggles, setPendingToggles] = useState<Set<string>>(new Set());
  const [errorId, setErrorId] = useState<string | null>(null);

  const today = new Date();
  const completedCount = habits.filter((h: Habit) => h.completed).length;
  const totalCount = habits.length;
  const percentage = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  const formatDate = () => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    };
    return today.toLocaleDateString('en-US', options);
  };

  /* ── handleHabitToggle ──────────────────────────────────────
    Guards against double-clicks with pendingToggles, then calls
    the parent's onToggleHabit (which owns the optimistic state
    mutation and backend PATCH). Surfaces an error highlight if
    the backend call fails.
  ──────────────────────────────────────────────────────────── */
  const handleHabitToggle = async (habitId: string) => {
    if (pendingToggles.has(habitId)) return;
  
    setPendingToggles(prev => new Set(prev).add(habitId));
    setErrorId(null);
  
    try {
      await onToggleHabit(habitId);
    } catch (err) {
      console.error('Failed to toggle habit:', err);
      setErrorId(habitId);
      setTimeout(() => setErrorId(null), 2000);
    } finally {
      setPendingToggles(prev => {
        const next = new Set(prev);
        next.delete(habitId);
        return next;
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="bg-white rounded-2xl shadow-lg p-8">

        {/* ── Header: date + completion count + percentage ── */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{formatDate()}</h2>
              <p className="text-gray-600 text-sm mt-1">
                {completedCount} of {totalCount} habits completed
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-blue-600">{percentage}%</div>
              <p className="text-gray-600 text-xs mt-1">complete</p>
            </div>
          </div>

          {/* ── Progress bar — driven by live habits prop ── */}
          <div className="mt-6">
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* ── Habit list ── */}
        <div className="space-y-3">
          {habits.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No habits yet. Create one in the "My Habits" tab to get started!
            </p>
          ) : (
            habits.map(habit => {
              const isPending = pendingToggles.has(habit.id);
              const hasError  = errorId === habit.id;

              return (
                <button
                  key={habit.id}
                  onClick={() => handleHabitToggle(habit.id)}
                  disabled={isPending}
                  className={`
                    w-full flex items-center gap-4 p-4 rounded-xl transition-all
                    ${habit.completed
                      ? 'text-white shadow-lg'
                      : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-300'
                    }
                    ${isPending ? 'opacity-50 cursor-not-allowed' : ''}
                    ${hasError  ? 'border-2 border-red-500 bg-red-50 text-red-700' : ''}
                  `}
                  style={
                    habit.completed && !hasError
                      ? { backgroundColor: habit.color, borderColor: habit.color }
                      : undefined
                  }
                >
                  {/* Check circle */}
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      habit.completed ? 'bg-white border-white' : 'border-gray-300 bg-white'
                    }`}
                  >
                    {habit.completed && (
                      <svg className="w-4 h-4 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>

                  <span className="font-medium text-lg">{habit.name}</span>
                  
                  {/* Loading spinner shown while PATCH is in-flight, created due to lag between frontend and backend syncing w/ database */}
                  {isPending && (
                    <svg className="ml-auto w-4 h-4 animate-spin text-current" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                  )}
                </button>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}
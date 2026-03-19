import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Habit } from '../types';

const COLOR_OPTIONS = [
  '#EF4444', '#F97316', '#10B981', '#3B82F6',
  '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16',
];

interface MyHabitsTabProps {
  habits: Habit[];
  loading: boolean;
  onAddHabit: (name: string, color: string) => Promise<void>;
  onDeleteHabit: (id: string) => Promise<void>;
}

export function MyHabitsTab({ habits, loading, onAddHabit, onDeleteHabit }: MyHabitsTabProps) {
  const [habitName, setHabitName]       = useState('');
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError]       = useState<string | null>(null);

  // Per-habit delete state: maps habit ID → 'pending' | 'error'
  const [deleteState, setDeleteState]   = useState<Record<string, 'pending' | 'error'>>({});

  /* ── handleSubmit ────────────────────────────────────────────
    Validates the form, calls addHabit, then notifies the parent
    so it can re-fetch the habits list.
  ──────────────────────────────────────────────────────────── */
  const handleSubmit = async (e: React.FormEvent) => {
    // Prevent the default form submission behavior
    e.preventDefault();

    // Validate the form
    if (!habitName.trim()) {
      setFormError('Habit name is required');
      return;
    }
    
    // Get in a state of submitting to prevent double submission
    setIsSubmitting(true);
    setFormError(null);

    try {
      await onAddHabit(habitName.trim(), selectedColor);
      setHabitName('');
      setSelectedColor(COLOR_OPTIONS[0]);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to add habit');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setHabitName('');
    setSelectedColor(COLOR_OPTIONS[0]);
    setFormError(null);
  };

  /* ── handleDelete ────────────────────────────────────────────
    Tracks per-habit pending/error state so each row can show its
    own spinner or error highlight without blocking the others.
  ──────────────────────────────────────────────────────────── */
  const handleDelete = async (id: string) => {
    if (deleteState[id] === 'pending') return; // Already in-flight
    if (!window.confirm('Are you sure you want to delete this habit?')) return;

    setDeleteState(prev => ({ ...prev, [id]: 'pending' }));

    try {
      await onDeleteHabit(id);
      // Remove the pending entry — the habit row will unmount once parent re-fetches
      setDeleteState(prev => { const next = { ...prev }; delete next[id]; return next; });
    } catch (err) {
      console.error('Failed to delete habit:', err);
      setDeleteState(prev => ({ ...prev, [id]: 'error' }));
      setTimeout(() => {
        setDeleteState(prev => { const next = { ...prev }; delete next[id]; return next; });
      }, 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">

      {/* ── Add habit form ── */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Add New Habit</h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Habit Name
            </label>
            <input
              type="text"
              value={habitName}
              onChange={e => { setHabitName(e.target.value); setFormError(null); }}
              placeholder="e.g., Drink 8 glasses of water"
              className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-600 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Color
            </label>
            <div className="flex gap-3">
              {COLOR_OPTIONS.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`w-10 h-10 rounded-full transition-transform ${
                    selectedColor === color
                      ? 'scale-125 ring-2 ring-offset-2 ring-gray-400'
                      : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {formError && (
            <div className="text-red-600 text-sm font-medium">{formError}</div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Adding...' : 'Add Habit'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* ── Existing habits list ── */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Your Habits</h3>

        {loading ? (
          <p className="text-center text-gray-500">Loading habits...</p>
        ) : habits.length === 0 ? (
          <p className="text-center text-gray-500">
            No habits yet. Create one above to get started!
          </p>
        ) : (
          <div className="space-y-4">
            {habits.map(habit => {
              const state      = deleteState[habit.id];
              const isPending  = state === 'pending';
              const hasError   = state === 'error';

              return (
                <div
                  key={habit.id}
                  className={`
                    flex items-center justify-between p-4 border-2 rounded-lg transition-colors
                    ${hasError
                      ? 'border-red-400 bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                    }
                    ${isPending ? 'opacity-50' : ''}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: habit.color }} />
                    <div>
                      <h4 className="font-semibold text-gray-900">{habit.name}</h4>
                      <p className="text-sm text-gray-600">
                        0 day streak • 0% this week
                      </p>
                    </div>
                  </div>

                  {/* Delete button — shows spinner while pending, red X on error */}
                  <button
                    onClick={() => handleDelete(habit.id)}
                    disabled={isPending}
                    className={`p-2 transition-colors ${
                      hasError
                        ? 'text-red-600'
                        : 'text-gray-400 hover:text-red-600'
                    } disabled:cursor-not-allowed`}
                    title={hasError ? 'Delete failed — try again' : 'Delete habit'}
                  >
                    {isPending
                      ? <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                      : <Trash2 size={20} />
                    }
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
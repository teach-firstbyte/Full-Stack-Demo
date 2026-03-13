import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Habit } from '../types';
import { useHabits } from '../hooks/useHabits';

const COLOR_OPTIONS = [
  '#EF4444',
  '#F97316',
  '#10B981',
  '#3B82F6',
  '#8B5CF6',
  '#EC4899',
  '#06B6D4',
  '#84CC16',
];

interface MyHabitsTabProps {
  habits: Habit[];
  loading: boolean;
  onHabitAdded?: () => void;
}

export function MyHabitsTab({ habits, loading, onHabitAdded }: MyHabitsTabProps) {
  const [habitName, setHabitName] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addHabit, deleteHabit } = useHabits();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!habitName.trim()) {
      setError('Habit name is required');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await addHabit(habitName, selectedColor);
      setHabitName('');
      setSelectedColor(COLOR_OPTIONS[0]);
      onHabitAdded?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add habit');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setHabitName('');
    setSelectedColor(COLOR_OPTIONS[0]);
    setError(null);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      try {
        await deleteHabit(id);
      } catch (err) {
        console.error('Failed to delete habit:', err);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
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
              onChange={e => setHabitName(e.target.value)}
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
                    selectedColor === color ? 'scale-125 ring-2 ring-offset-2 ring-gray-400' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm font-medium">{error}</div>
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
            {habits.map(habit => (
              <div
                key={habit.id}
                className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: habit.color }}
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{habit.name}</h4>
                    <p className="text-sm text-gray-600">
                      0 day streak • 0% this week
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(habit.id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

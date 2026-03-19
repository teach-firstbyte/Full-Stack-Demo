import { Habit } from '../types';
import { apiFetch } from '../lib/api';

interface TodayTabProps {
  habits: Habit[];
}

export function TodayTab({ habits }: TodayTabProps) {
  const today = new Date();

  const completedCount = habits.filter((h: Habit) => h.completed).length;
  const totalCount = habits.length;
  const percentage = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  const handleHabitToggle = async (habitId: string) => {
    try {
      await apiFetch<boolean>('/api/completions/toggle', { method: 'PATCH', body: { habitId } });
    } catch (err) {
      console.error('Failed to toggle habit:', err);
    }
  };

  const isHabitCompleted = (habitId: string) => {
    return habits.some(h => h.id === habitId && h.completed);
  };

  const formatDate = () => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    };
    return today.toLocaleDateString('en-US', options);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="bg-white rounded-2xl shadow-lg p-8">
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

          <div className="mt-6">
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {habits.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No habits yet. Create one in the "My Habits" tab to get started!
            </p>
          ) : (
            habits.map(habit => {
              const isCompleted = isHabitCompleted(habit.id);
              return (
                <button
                  key={habit.id}
                  onClick={() => handleHabitToggle(habit.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${
                    isCompleted
                      ? `text-white shadow-lg`
                      : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                  style={
                    isCompleted
                      ? {
                          backgroundColor: habit.color,
                          borderColor: habit.color,
                        }
                      : undefined
                  }
                >
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      isCompleted
                        ? 'bg-white border-white'
                        : 'border-gray-300 bg-white'
                    }`}
                  >
                    {isCompleted && (
                      <svg
                        className="w-4 h-4 text-gray-900"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                  <span className="font-medium text-lg">{habit.name}</span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

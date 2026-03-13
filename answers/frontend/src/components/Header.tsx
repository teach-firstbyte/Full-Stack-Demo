import { Activity } from 'lucide-react';

type Tab = 'today' | 'habits';

interface HeaderProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export function Header({ activeTab, onTabChange }: HeaderProps) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-blue-600 rounded-lg p-2">
            <Activity className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Health Habits</h1>
            <p className="text-gray-600 text-sm">Track your daily wellness routine</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => onTabChange('today')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'today'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => onTabChange('habits')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'habits'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            My Habits
          </button>
        </div>
      </div>
    </div>
  );
}

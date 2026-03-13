import { useState } from 'react';
import { Header } from './components/Header';
import { TodayTab } from './components/TodayTab';
import { MyHabitsTab } from './components/MyHabitsTab';
import { useHabits } from './hooks/useHabits';

type Tab = 'today' | 'habits';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('today');
  const { habits, loading, refetch } = useHabits();

  const handleHabitAdded = () => {
    refetch();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="pb-16">
        {activeTab === 'today' ? (
          <TodayTab habits={habits} />
        ) : (
          <MyHabitsTab habits={habits} loading={loading} onHabitAdded={handleHabitAdded} />
        )}
      </div>
    </div>
  );
}

export default App;

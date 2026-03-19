import { useState } from 'react';
import { Header } from './components/Header';
import { TodayTab } from './components/TodayTab';
import { MyHabitsTab } from './components/MyHabitsTab';
import { useHabits } from './hooks/useHabits';

type Tab = 'today' | 'habits';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('today');

  const { 
    habits, 
    loading, 
    toggleHabit, 
    addHabit, 
    deleteHabit 
  } = useHabits();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="pb-16">
        {activeTab === 'today' ? (
          <TodayTab habits={habits} onToggleHabit={toggleHabit} />
        ) : (
          <MyHabitsTab
            habits={habits}
            loading={loading}
            onAddHabit={addHabit}
            onDeleteHabit={deleteHabit}
          />
        )}
      </div>
    </div>
  );
}

export default App;
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
      {/* Put in a Header Here! This should go in the top of the page, and will contain properties for tracking the active tab, as well as a function for changing the active tab*/}
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Put in a container here that will contain the active tab's content. Inside the div should be your two components, that render depending on the activeTab state */}
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

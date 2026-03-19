import { Header } from './components/Header';
import { TodayTab } from './components/TodayTab';
import { MyHabitsTab } from './components/MyHabitsTab';

type Tab = 'today' | 'habits';


// Dummy functions

const handleTabChange = (tab: Tab) => {
  console.log('Tab changed to:', tab);
};

const handleToggleHabit = async (id: string) => {
  console.log('Toggled habit:', id);
};

const handleAddHabit = async (name: string, color: string) => {
  console.log('Added habit:', name, color);
};

const handleDeleteHabit = async (id: string) => {
  console.log('Deleted habit:', id);
};

// ─────────────────────────────────────────────────────────────

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      
      {/* Put in the Header component and pass in its required props */}

      <div className="pb-16">
        {/* Put in the TodayTab component and pass in its required props! */}
        {/* Put in the MyHabitsTab component and pass in its required props! */}
      </div>
    </div>
  );
}

export default App;
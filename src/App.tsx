import { useState } from 'react';
import { TodayView } from './views/TodayView';
import { StatsView } from './views/StatsView';
import { ManageView } from './views/ManageView';

type View = 'today' | 'stats' | 'manage';

function App() {
  const [currentView, setCurrentView] = useState<View>('today');

  const navItems = [
    { id: 'today' as View, label: 'Today', icon: '✓' },
    { id: 'stats' as View, label: 'Stats', icon: '📊' },
    { id: 'manage' as View, label: 'Manage', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main container */}
      <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
        {/* Content */}
        {currentView === 'today' && <TodayView />}
        {currentView === 'stats' && <StatsView />}
        {currentView === 'manage' && <ManageView />}
      </div>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 safe-area-inset-bottom">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex items-center justify-around h-16">
            {navItems.map((item) => {
              const isActive = currentView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                    isActive
                      ? 'text-primary-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <span className="text-2xl mb-1">{item.icon}</span>
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}

export default App;

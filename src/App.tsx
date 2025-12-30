import { useState } from 'react';
import { TodayView } from './views/TodayView';
import { StatsView } from './views/StatsView';
import { ManageView } from './views/ManageView';
import { ThemeProvider } from './contexts/ThemeContext';
import { ThemeToggle } from './components/ThemeToggle';

type View = 'today' | 'stats' | 'manage';

function App() {
  const [currentView, setCurrentView] = useState<View>('today');

  const navItems = [
    { id: 'today' as View, label: 'Today', icon: '✓' },
    { id: 'stats' as View, label: 'Stats', icon: '📊' },
    { id: 'manage' as View, label: 'Manage', icon: '⚙️' },
  ];

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Theme toggle - fixed in top right */}
        <div className="fixed top-4 right-4 z-50">
          <ThemeToggle />
        </div>

        {/* Main container */}
        <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
          {/* Content */}
          {currentView === 'today' && <TodayView />}
          {currentView === 'stats' && <StatsView />}
          {currentView === 'manage' && <ManageView />}
        </div>

        {/* Bottom navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t-2 border-gray-200 dark:border-gray-700 safe-area-inset-bottom">
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
                        ? 'text-primary-600 dark:text-primary-400'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
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
    </ThemeProvider>
  );
}

export default App;

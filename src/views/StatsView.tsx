import { useState } from 'react';
import { useHabits } from '@/features/habits/hooks/useHabits';
import { useEntries } from '@/features/entries/hooks/useEntries';
import { useHabitStats } from '@/features/stats/hooks/useHabitStats';
import { StatsOverview } from '@/features/stats/components/StatsOverview';
import { WeeklyChart } from '@/features/stats/components/WeeklyChart';
import { HeatMap } from '@/features/stats/components/HeatMap';
import { EmptyState } from '@/shared/components/EmptyState';
import { Habit, HABIT_COLORS } from '@/types';

export function StatsView() {
  const { habits } = useHabits();
  const { getHabitEntries } = useEntries();
  const [selectedHabit, setSelectedHabit] = useState<Habit | undefined>(
    habits[0]
  );

  const entries = selectedHabit ? getHabitEntries(selectedHabit.id) : [];
  const stats = useHabitStats(selectedHabit, entries);

  if (habits.length === 0) {
    return (
      <EmptyState
        icon="📊"
        title="No statistics yet"
        description="Create some habits and start tracking to see your progress"
        action={{
          label: 'Go to Today',
          onClick: () => window.location.reload(),
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Statistics</h1>

        {/* Habit selector */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Select Habit
          </label>
          <div className="grid grid-cols-1 gap-2">
            {habits.map((habit) => {
              const colors = HABIT_COLORS[habit.color as keyof typeof HABIT_COLORS] || HABIT_COLORS.blue;
              const isSelected = selectedHabit?.id === habit.id;

              return (
                <button
                  key={habit.id}
                  onClick={() => setSelectedHabit(habit)}
                  className={`text-left p-3 rounded-lg border-2 transition-all ${
                    isSelected
                      ? `${colors.border} ${colors.bg}`
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{habit.icon}</span>
                    <span
                      className={`font-medium ${
                        isSelected ? colors.text : 'text-gray-900'
                      }`}
                    >
                      {habit.name}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stats display */}
      {selectedHabit && stats && (
        <>
          <StatsOverview habit={selectedHabit} stats={stats} />

          <HeatMap
            data={stats.last30Days}
            color={
              HABIT_COLORS[selectedHabit.color as keyof typeof HABIT_COLORS]?.bg ||
              'bg-green-500'
            }
          />

          <WeeklyChart data={stats.weeklyData} />
        </>
      )}
    </div>
  );
}

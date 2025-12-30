import { HabitStats, HABIT_COLORS, Habit } from '@/types';

type StatsOverviewProps = {
  habit: Habit;
  stats: HabitStats;
};

export function StatsOverview({ habit, stats }: StatsOverviewProps) {
  const colors = HABIT_COLORS[habit.color as keyof typeof HABIT_COLORS] || HABIT_COLORS.blue;

  const statCards = [
    {
      label: 'Current Streak',
      value: stats.currentStreak,
      suffix: stats.currentStreak === 1 ? 'day' : 'days',
      icon: '🔥',
    },
    {
      label: 'Longest Streak',
      value: stats.longestStreak,
      suffix: stats.longestStreak === 1 ? 'day' : 'days',
      icon: '⭐',
    },
    {
      label: 'Completion Rate',
      value: stats.completionRate,
      suffix: '%',
      icon: '📊',
    },
    {
      label: 'Total Completions',
      value: stats.totalCompletions,
      suffix: stats.totalCompletions === 1 ? 'time' : 'times',
      icon: '✅',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Habit header */}
      <div className={`rounded-lg ${colors.bg} ${colors.border} border-2 p-4`}>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{habit.icon}</span>
          <div>
            <h2 className={`text-xl font-bold ${colors.text}`}>
              {habit.name}
            </h2>
            {habit.description && (
              <p className="text-sm text-gray-600 mt-1">
                {habit.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-lg border-2 border-gray-200 p-4 hover:border-gray-300 transition-colors"
          >
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="text-2xl font-bold text-gray-900">
              {stat.value}
              <span className="text-base font-normal text-gray-500 ml-1">
                {stat.suffix}
              </span>
            </div>
            <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

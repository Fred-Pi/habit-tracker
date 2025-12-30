import { Habit, HABIT_COLORS } from '@/types';
import { formatDate, today } from '@/shared/utils/date';

type DailyCheckInProps = {
  habits: Habit[];
  isCompleted: (habitId: string) => boolean;
  onToggle: (habitId: string) => void;
  date?: string;
};

export function DailyCheckIn({
  habits,
  isCompleted,
  onToggle,
  date = today(),
}: DailyCheckInProps) {
  if (habits.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🎯</div>
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
          No habits yet
        </h3>
        <p className="text-gray-500">
          Create your first habit to start tracking
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
        {formatDate(date, 'long')}
      </h2>

      {habits.map((habit) => {
        const completed = isCompleted(habit.id);
        const colors = HABIT_COLORS[habit.color as keyof typeof HABIT_COLORS] || HABIT_COLORS.blue;

        return (
          <button
            key={habit.id}
            onClick={() => onToggle(habit.id)}
            className={`w-full text-left rounded-lg border-2 p-4 transition-all ${
              completed
                ? `${colors.border} ${colors.bg} shadow-sm`
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm'
            }`}
          >
            <div className="flex items-center gap-3">
              {/* Checkbox */}
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                  completed
                    ? `${colors.border} ${colors.bg}`
                    : 'border-gray-300 bg-white'
                }`}
              >
                {completed && (
                  <svg
                    className={`w-4 h-4 ${colors.text}`}
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

              {/* Icon */}
              <span className="text-2xl flex-shrink-0">{habit.icon}</span>

              {/* Habit details */}
              <div className="flex-1 min-w-0">
                <h3
                  className={`font-semibold truncate ${
                    completed ? colors.text : 'text-gray-900'
                  }`}
                >
                  {habit.name}
                </h3>
                {habit.description && (
                  <p className="text-sm text-gray-500 truncate">
                    {habit.description}
                  </p>
                )}
              </div>

              {/* Completion indicator */}
              {completed && (
                <div className={`text-sm font-medium ${colors.text} flex-shrink-0`}>
                  ✓ Done
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

import { Habit, HABIT_COLORS } from '@/types';

type HabitCardProps = {
  habit: Habit;
  onEdit?: (habit: Habit) => void;
  onArchive?: (id: string) => void;
  children?: React.ReactNode;
};

export function HabitCard({ habit, onEdit, onArchive, children }: HabitCardProps) {
  const colors = HABIT_COLORS[habit.color as keyof typeof HABIT_COLORS] || HABIT_COLORS.blue;

  return (
    <div
      className={`rounded-lg border-2 ${colors.border} ${colors.bg} p-4 transition-all hover:shadow-md`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <span className="text-3xl flex-shrink-0" role="img" aria-label="habit icon">
            {habit.icon}
          </span>
          <div className="flex-1 min-w-0">
            <h3 className={`font-semibold ${colors.text} text-lg truncate`}>
              {habit.name}
            </h3>
            {habit.description && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {habit.description}
              </p>
            )}
            <div className="mt-2 text-xs text-gray-500">
              {habit.targetFrequency === 'daily' ? (
                <span>Daily</span>
              ) : (
                <span>{habit.targetCount || 3}x per week</span>
              )}
            </div>
          </div>
        </div>

        {(onEdit || onArchive) && (
          <div className="flex gap-1 flex-shrink-0">
            {onEdit && (
              <button
                onClick={() => onEdit(habit)}
                className="p-2 rounded-md hover:bg-white/60 transition-colors text-gray-600 hover:text-gray-900"
                aria-label="Edit habit"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            )}
            {onArchive && (
              <button
                onClick={() => onArchive(habit.id)}
                className="p-2 rounded-md hover:bg-white/60 transition-colors text-gray-600 hover:text-red-600"
                aria-label="Archive habit"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>

      {children && (
        <div className="mt-3 pt-3 border-t border-gray-200/50">
          {children}
        </div>
      )}
    </div>
  );
}

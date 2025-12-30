import { useState, FormEvent } from 'react';
import { Habit, HABIT_COLORS, HABIT_ICONS, HabitColor } from '@/types';

type HabitFormProps = {
  habit?: Habit;
  onSubmit: (habitData: Omit<Habit, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
};

export function HabitForm({ habit, onSubmit, onCancel }: HabitFormProps) {
  const [name, setName] = useState(habit?.name || '');
  const [description, setDescription] = useState(habit?.description || '');
  const [color, setColor] = useState<HabitColor>(
    (habit?.color as HabitColor) || 'blue'
  );
  const [icon, setIcon] = useState(habit?.icon || HABIT_ICONS[0]);
  const [targetFrequency, setTargetFrequency] = useState<'daily' | 'weekly'>(
    habit?.targetFrequency || 'daily'
  );
  const [targetCount, setTargetCount] = useState(habit?.targetCount || 3);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSubmit({
      name: name.trim(),
      description: description.trim() || undefined,
      color,
      icon,
      targetFrequency,
      targetCount: targetFrequency === 'weekly' ? targetCount : undefined,
      archivedAt: habit?.archivedAt,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="habit-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Habit Name *
        </label>
        <input
          id="habit-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Morning workout"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          autoFocus
          required
        />
      </div>

      <div>
        <label htmlFor="habit-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description (optional)
        </label>
        <textarea
          id="habit-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Why is this habit important to you?"
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Icon
        </label>
        <div className="grid grid-cols-8 gap-2">
          {HABIT_ICONS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => setIcon(emoji)}
              className={`text-2xl p-2 rounded-lg transition-all ${
                icon === emoji
                  ? 'bg-primary-100 ring-2 ring-primary-500'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Color
        </label>
        <div className="grid grid-cols-8 gap-2">
          {(Object.keys(HABIT_COLORS) as HabitColor[]).map((colorKey) => {
            const colorClasses = HABIT_COLORS[colorKey];
            return (
              <button
                key={colorKey}
                type="button"
                onClick={() => setColor(colorKey)}
                className={`w-10 h-10 rounded-lg ${colorClasses.bg} ${
                  color === colorKey ? `ring-2 ${colorClasses.border}` : ''
                } transition-all hover:scale-110`}
                aria-label={`Select ${colorKey} color`}
              />
            );
          })}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Frequency
        </label>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="daily"
              checked={targetFrequency === 'daily'}
              onChange={(e) => setTargetFrequency(e.target.value as 'daily')}
              className="text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm">Daily</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="weekly"
              checked={targetFrequency === 'weekly'}
              onChange={(e) => setTargetFrequency(e.target.value as 'weekly')}
              className="text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm">Weekly</span>
          </label>
        </div>
      </div>

      {targetFrequency === 'weekly' && (
        <div>
          <label htmlFor="target-count" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Times per week
          </label>
          <input
            id="target-count"
            type="number"
            min="1"
            max="7"
            value={targetCount}
            onChange={(e) => setTargetCount(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-gray-100 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!name.trim()}
        >
          {habit ? 'Update' : 'Create'} Habit
        </button>
      </div>
    </form>
  );
}

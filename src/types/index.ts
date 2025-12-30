// Core domain types

export type Habit = {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon: string;
  targetFrequency: 'daily' | 'weekly';
  targetCount?: number; // For weekly habits: e.g., 3 times per week
  createdAt: string; // ISO date string
  archivedAt?: string; // ISO date string
};

export type Entry = {
  id: string;
  habitId: string;
  date: string; // ISO date string "YYYY-MM-DD"
  completed: boolean;
  note?: string;
  createdAt: string; // ISO date string with time
};

// Storage structure
export type EntriesMap = {
  [date: string]: { // "YYYY-MM-DD"
    [habitId: string]: Entry;
  };
};

export type HabitsMap = {
  [habitId: string]: Habit;
};

// Computed statistics (never stored)
export type HabitStats = {
  habitId: string;
  currentStreak: number;
  longestStreak: number;
  completionRate: number; // 0-100
  totalCompletions: number;
  last7Days: DayCompletion[];
  last30Days: DayCompletion[];
  weeklyData: WeekData[];
  monthlyData: MonthData[];
};

export type DayCompletion = {
  date: string; // "YYYY-MM-DD"
  completed: boolean;
};

export type WeekData = {
  weekStart: string; // "YYYY-MM-DD"
  completions: number;
  target: number;
};

export type MonthData = {
  month: string; // "YYYY-MM"
  completions: number;
  possibleDays: number;
};

// UI state types
export type ViewMode = 'today' | 'stats' | 'history';

export type HabitColor =
  | 'blue'
  | 'green'
  | 'purple'
  | 'pink'
  | 'orange'
  | 'red'
  | 'yellow'
  | 'indigo';

export const HABIT_COLORS: Record<HabitColor, { bg: string; text: string; border: string }> = {
  blue: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-300 dark:border-blue-700' },
  green: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300', border: 'border-green-300 dark:border-green-700' },
  purple: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-300 dark:border-purple-700' },
  pink: { bg: 'bg-pink-100 dark:bg-pink-900/30', text: 'text-pink-700 dark:text-pink-300', border: 'border-pink-300 dark:border-pink-700' },
  orange: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-300', border: 'border-orange-300 dark:border-orange-700' },
  red: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300', border: 'border-red-300 dark:border-red-700' },
  yellow: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-300', border: 'border-yellow-300 dark:border-yellow-700' },
  indigo: { bg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-700 dark:text-indigo-300', border: 'border-indigo-300 dark:border-indigo-700' },
};

export const HABIT_ICONS = [
  '💪', '📚', '🏃', '🧘', '💧', '🥗', '😴', '✍️',
  '🎯', '🎨', '🎵', '🧹', '💼', '🌱', '🔥', '⭐',
];

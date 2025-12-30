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
  blue: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' },
  green: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-300' },
  pink: { bg: 'bg-pink-100', text: 'text-pink-700', border: 'border-pink-300' },
  orange: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300' },
  red: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' },
  yellow: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-300' },
  indigo: { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-300' },
};

export const HABIT_ICONS = [
  '💪', '📚', '🏃', '🧘', '💧', '🥗', '😴', '✍️',
  '🎯', '🎨', '🎵', '🧹', '💼', '🌱', '🔥', '⭐',
];

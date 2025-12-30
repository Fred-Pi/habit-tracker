import { useMemo } from 'react';
import { Habit, Entry, HabitStats } from '@/types';
import { statsService } from '../services/statsService';

/**
 * Hook to get statistics for a specific habit
 */
export function useHabitStats(habit: Habit | undefined, entries: Entry[]): HabitStats | null {
  return useMemo(() => {
    if (!habit) return null;
    return statsService.getHabitStats(habit, entries);
  }, [habit, entries]);
}

/**
 * Hook to get statistics for all habits
 */
export function useAllHabitStats(
  habits: Habit[],
  getHabitEntries: (habitId: string) => Entry[]
): Map<string, HabitStats> {
  return useMemo(() => {
    const statsMap = new Map<string, HabitStats>();

    habits.forEach(habit => {
      const entries = getHabitEntries(habit.id);
      const stats = statsService.getHabitStats(habit, entries);
      statsMap.set(habit.id, stats);
    });

    return statsMap;
  }, [habits, getHabitEntries]);
}

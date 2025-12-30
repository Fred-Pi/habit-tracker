import { useCallback, useMemo } from 'react';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';
import { Habit, HabitsMap } from '@/types';

export function useHabits() {
  const [habitsMap, setHabitsMap] = useLocalStorage<HabitsMap>('habits', {});

  // Get active (non-archived) habits
  const habits = useMemo(
    () => Object.values(habitsMap).filter(h => !h.archivedAt).sort((a, b) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    ),
    [habitsMap]
  );

  // Get archived habits
  const archivedHabits = useMemo(
    () => Object.values(habitsMap).filter(h => h.archivedAt).sort((a, b) =>
      new Date(b.archivedAt!).getTime() - new Date(a.archivedAt!).getTime()
    ),
    [habitsMap]
  );

  // Add new habit
  const addHabit = useCallback(
    (habitData: Omit<Habit, 'id' | 'createdAt'>) => {
      const newHabit: Habit = {
        ...habitData,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      setHabitsMap(prev => ({ ...prev, [newHabit.id]: newHabit }));
      return newHabit;
    },
    [setHabitsMap]
  );

  // Update existing habit
  const updateHabit = useCallback(
    (id: string, updates: Partial<Omit<Habit, 'id' | 'createdAt'>>) => {
      setHabitsMap(prev => {
        if (!prev[id]) return prev;
        return {
          ...prev,
          [id]: { ...prev[id], ...updates }
        };
      });
    },
    [setHabitsMap]
  );

  // Archive habit (soft delete)
  const archiveHabit = useCallback(
    (id: string) => {
      setHabitsMap(prev => {
        if (!prev[id]) return prev;
        return {
          ...prev,
          [id]: { ...prev[id], archivedAt: new Date().toISOString() }
        };
      });
    },
    [setHabitsMap]
  );

  // Restore archived habit
  const restoreHabit = useCallback(
    (id: string) => {
      setHabitsMap(prev => {
        if (!prev[id]) return prev;
        const { archivedAt, ...rest } = prev[id];
        return {
          ...prev,
          [id]: rest as Habit
        };
      });
    },
    [setHabitsMap]
  );

  // Permanently delete habit (use with caution)
  const deleteHabit = useCallback(
    (id: string) => {
      setHabitsMap(prev => {
        const { [id]: _, ...rest } = prev;
        return rest;
      });
    },
    [setHabitsMap]
  );

  // Get single habit by ID
  const getHabit = useCallback(
    (id: string): Habit | undefined => {
      return habitsMap[id];
    },
    [habitsMap]
  );

  return {
    habits,
    archivedHabits,
    habitsMap,
    addHabit,
    updateHabit,
    archiveHabit,
    restoreHabit,
    deleteHabit,
    getHabit,
  };
}

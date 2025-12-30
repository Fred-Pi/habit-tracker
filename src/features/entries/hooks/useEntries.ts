import { useCallback, useMemo } from 'react';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';
import { Entry, EntriesMap } from '@/types';
import { today } from '@/shared/utils/date';

export function useEntries() {
  const [entriesMap, setEntriesMap] = useLocalStorage<EntriesMap>('entries', {});

  // Get entry for a specific habit on a specific date
  const getEntry = useCallback(
    (habitId: string, date: string = today()): Entry | undefined => {
      return entriesMap[date]?.[habitId];
    },
    [entriesMap]
  );

  // Check if habit is completed on a specific date
  const isCompleted = useCallback(
    (habitId: string, date: string = today()): boolean => {
      return entriesMap[date]?.[habitId]?.completed || false;
    },
    [entriesMap]
  );

  // Toggle habit completion for a specific date
  const toggleEntry = useCallback(
    (habitId: string, date: string = today()) => {
      setEntriesMap(prev => {
        const dateEntries = prev[date] || {};
        const currentEntry = dateEntries[habitId];

        const newEntry: Entry = currentEntry
          ? { ...currentEntry, completed: !currentEntry.completed }
          : {
              id: crypto.randomUUID(),
              habitId,
              date,
              completed: true,
              createdAt: new Date().toISOString(),
            };

        return {
          ...prev,
          [date]: {
            ...dateEntries,
            [habitId]: newEntry,
          },
        };
      });
    },
    [setEntriesMap]
  );

  // Add or update a note for an entry
  const updateNote = useCallback(
    (habitId: string, date: string, note: string) => {
      setEntriesMap(prev => {
        const dateEntries = prev[date] || {};
        const currentEntry = dateEntries[habitId];

        if (!currentEntry) {
          // Create new entry with note
          const newEntry: Entry = {
            id: crypto.randomUUID(),
            habitId,
            date,
            completed: false,
            note: note.trim() || undefined,
            createdAt: new Date().toISOString(),
          };

          return {
            ...prev,
            [date]: {
              ...dateEntries,
              [habitId]: newEntry,
            },
          };
        }

        // Update existing entry
        return {
          ...prev,
          [date]: {
            ...dateEntries,
            [habitId]: {
              ...currentEntry,
              note: note.trim() || undefined,
            },
          },
        };
      });
    },
    [setEntriesMap]
  );

  // Get all entries for a specific habit
  const getHabitEntries = useCallback(
    (habitId: string): Entry[] => {
      const entries: Entry[] = [];
      Object.values(entriesMap).forEach(dateEntries => {
        const entry = dateEntries[habitId];
        if (entry) {
          entries.push(entry);
        }
      });
      return entries.sort((a, b) => a.date.localeCompare(b.date));
    },
    [entriesMap]
  );

  // Get all entries for a specific date
  const getDateEntries = useCallback(
    (date: string = today()): Entry[] => {
      const dateEntries = entriesMap[date];
      return dateEntries ? Object.values(dateEntries) : [];
    },
    [entriesMap]
  );

  // Get completion count for a date
  const getCompletionCount = useCallback(
    (date: string = today()): number => {
      const dateEntries = entriesMap[date];
      if (!dateEntries) return 0;
      return Object.values(dateEntries).filter(e => e.completed).length;
    },
    [entriesMap]
  );

  // Get all completed entries (flat array)
  const allCompletedEntries = useMemo(() => {
    const entries: Entry[] = [];
    Object.values(entriesMap).forEach(dateEntries => {
      Object.values(dateEntries).forEach(entry => {
        if (entry.completed) {
          entries.push(entry);
        }
      });
    });
    return entries.sort((a, b) => b.date.localeCompare(a.date));
  }, [entriesMap]);

  return {
    entriesMap,
    getEntry,
    isCompleted,
    toggleEntry,
    updateNote,
    getHabitEntries,
    getDateEntries,
    getCompletionCount,
    allCompletedEntries,
  };
}

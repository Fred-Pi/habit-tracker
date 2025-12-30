import { useState, useEffect, useCallback } from 'react';

/**
 * Hook for persisting state to localStorage with automatic sync
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  // Get initial value from localStorage or use provided default
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error loading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Update localStorage when value changes
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        // Allow value to be a function (like setState)
        const valueToStore = value instanceof Function ? value(storedValue) : value;

        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));

        // Dispatch custom event for cross-tab sync
        window.dispatchEvent(new CustomEvent('localStorage', { detail: { key } }));
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  // Listen for changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent | CustomEvent) => {
      if ('key' in e && e.key === key) {
        try {
          const newValue = e.newValue ? JSON.parse(e.newValue) : initialValue;
          setStoredValue(newValue);
        } catch (error) {
          console.error(`Error parsing localStorage change for "${key}":`, error);
        }
      } else if ('detail' in e && e.detail.key === key) {
        try {
          const item = window.localStorage.getItem(key);
          const newValue = item ? JSON.parse(item) : initialValue;
          setStoredValue(newValue);
        } catch (error) {
          console.error(`Error syncing localStorage for "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange as EventListener);
    window.addEventListener('localStorage', handleStorageChange as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange as EventListener);
      window.removeEventListener('localStorage', handleStorageChange as EventListener);
    };
  }, [key, initialValue]);

  return [storedValue, setValue];
}

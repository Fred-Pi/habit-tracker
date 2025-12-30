/**
 * Date utility functions
 * Using native Date API to keep bundle size small
 */

/**
 * Get ISO date string (YYYY-MM-DD) for a given date
 */
export function toISODate(date: Date = new Date()): string {
  return date.toISOString().split('T')[0];
}

/**
 * Get today's date as ISO string
 */
export function today(): string {
  return toISODate();
}

/**
 * Parse ISO date string to Date object
 */
export function parseISODate(dateStr: string): Date {
  return new Date(dateStr + 'T00:00:00');
}

/**
 * Add days to a date
 */
export function addDays(date: Date | string, days: number): Date {
  const d = typeof date === 'string' ? parseISODate(date) : new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

/**
 * Get date N days ago from today
 */
export function daysAgo(days: number): string {
  return toISODate(addDays(new Date(), -days));
}

/**
 * Check if two dates are the same day
 */
export function isSameDay(date1: Date | string, date2: Date | string): boolean {
  const d1 = typeof date1 === 'string' ? date1 : toISODate(date1);
  const d2 = typeof date2 === 'string' ? date2 : toISODate(date2);
  return d1 === d2;
}

/**
 * Check if date is today
 */
export function isToday(date: Date | string): boolean {
  return isSameDay(date, new Date());
}

/**
 * Format date for display
 */
export function formatDate(date: Date | string, format: 'short' | 'long' = 'short'): string {
  const d = typeof date === 'string' ? parseISODate(date) : date;

  if (format === 'short') {
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Get week start date (Monday) for a given date
 */
export function getWeekStart(date: Date | string): string {
  const d = typeof date === 'string' ? parseISODate(date) : new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day; // Monday as start of week
  return toISODate(addDays(d, diff));
}

/**
 * Get month string (YYYY-MM) for a given date
 */
export function getMonth(date: Date | string): string {
  const d = typeof date === 'string' ? parseISODate(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

/**
 * Get array of dates between start and end (inclusive)
 */
export function getDateRange(start: string, end: string): string[] {
  const dates: string[] = [];
  const current = parseISODate(start);
  const endDate = parseISODate(end);

  while (current <= endDate) {
    dates.push(toISODate(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

/**
 * Get dates for the last N days including today
 */
export function getLastNDays(n: number): string[] {
  const dates: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    dates.push(daysAgo(i));
  }
  return dates;
}

/**
 * Calculate difference in days between two dates
 */
export function daysBetween(date1: string, date2: string): number {
  const d1 = parseISODate(date1);
  const d2 = parseISODate(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Get days in a specific month
 */
export function getDaysInMonth(yearMonth: string): number {
  const [year, month] = yearMonth.split('-').map(Number);
  return new Date(year, month, 0).getDate();
}

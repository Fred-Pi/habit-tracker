import { Entry, HabitStats, DayCompletion, WeekData, MonthData, Habit } from '@/types';
import {
  today,
  getLastNDays,
  getWeekStart,
  getMonth,
  addDays,
  toISODate,
  getDaysInMonth,
} from '@/shared/utils/date';

export class StatsService {
  private cache = new Map<string, { data: HabitStats; timestamp: number; entriesCount: number }>();
  private readonly CACHE_TTL = 60000; // 1 minute

  /**
   * Get comprehensive statistics for a habit with caching
   */
  getHabitStats(habit: Habit, entries: Entry[]): HabitStats {
    const cacheKey = `${habit.id}-${entries.length}`;
    const cached = this.cache.get(cacheKey);

    // Return cached data if valid
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }

    // Compute fresh stats
    const stats = this.computeStats(habit, entries);

    // Update cache
    this.cache.set(cacheKey, {
      data: stats,
      timestamp: Date.now(),
      entriesCount: entries.length,
    });

    return stats;
  }

  /**
   * Compute all statistics for a habit
   */
  private computeStats(habit: Habit, entries: Entry[]): HabitStats {
    const completedEntries = entries
      .filter(e => e.completed)
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      habitId: habit.id,
      currentStreak: this.calculateCurrentStreak(completedEntries),
      longestStreak: this.calculateLongestStreak(completedEntries),
      completionRate: this.calculateCompletionRate(habit, completedEntries),
      totalCompletions: completedEntries.length,
      last7Days: this.getLast7DaysData(entries),
      last30Days: this.getLast30DaysData(entries),
      weeklyData: this.getWeeklyData(completedEntries, habit),
      monthlyData: this.getMonthlyData(completedEntries, habit),
    };
  }

  /**
   * Calculate current streak (consecutive days from today backwards)
   */
  private calculateCurrentStreak(completedEntries: Entry[]): number {
    if (completedEntries.length === 0) return 0;

    const completedDates = new Set(completedEntries.map(e => e.date));
    let streak = 0;
    let checkDate = new Date();

    // Start from today or yesterday (grace period)
    if (!completedDates.has(toISODate(checkDate))) {
      checkDate = addDays(checkDate, -1);
    }

    // Count backwards
    while (completedDates.has(toISODate(checkDate))) {
      streak++;
      checkDate = addDays(checkDate, -1);
    }

    return streak;
  }

  /**
   * Calculate longest streak ever
   */
  private calculateLongestStreak(completedEntries: Entry[]): number {
    if (completedEntries.length === 0) return 0;

    const dates = completedEntries.map(e => e.date).sort();
    let longestStreak = 1;
    let currentStreak = 1;

    for (let i = 1; i < dates.length; i++) {
      const prevDate = new Date(dates[i - 1]);
      const currDate = new Date(dates[i]);
      const dayDiff = Math.floor(
        (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (dayDiff === 1) {
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else if (dayDiff > 1) {
        currentStreak = 1;
      }
    }

    return longestStreak;
  }

  /**
   * Calculate completion rate since habit creation
   */
  private calculateCompletionRate(habit: Habit, completedEntries: Entry[]): number {
    const createdDate = new Date(habit.createdAt);
    const todayDate = new Date();
    const daysSinceCreation = Math.floor(
      (todayDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
    ) + 1;

    if (daysSinceCreation === 0) return 0;

    const completions = completedEntries.length;

    if (habit.targetFrequency === 'daily') {
      return Math.round((completions / daysSinceCreation) * 100);
    } else {
      // Weekly habit
      const weeksSinceCreation = Math.ceil(daysSinceCreation / 7);
      const expectedCompletions = weeksSinceCreation * (habit.targetCount || 3);
      return Math.round((completions / expectedCompletions) * 100);
    }
  }

  /**
   * Get last 7 days completion data
   */
  private getLast7DaysData(entries: Entry[]): DayCompletion[] {
    const dates = getLastNDays(7);
    const entriesMap = new Map(entries.map(e => [e.date, e]));

    return dates.map(date => ({
      date,
      completed: entriesMap.get(date)?.completed || false,
    }));
  }

  /**
   * Get last 30 days completion data
   */
  private getLast30DaysData(entries: Entry[]): DayCompletion[] {
    const dates = getLastNDays(30);
    const entriesMap = new Map(entries.map(e => [e.date, e]));

    return dates.map(date => ({
      date,
      completed: entriesMap.get(date)?.completed || false,
    }));
  }

  /**
   * Get weekly aggregated data (last 12 weeks)
   */
  private getWeeklyData(completedEntries: Entry[], habit: Habit): WeekData[] {
    const weeks: WeekData[] = [];
    const weekMap = new Map<string, number>();

    // Count completions per week
    completedEntries.forEach(entry => {
      const weekStart = getWeekStart(entry.date);
      weekMap.set(weekStart, (weekMap.get(weekStart) || 0) + 1);
    });

    // Generate last 12 weeks
    for (let i = 11; i >= 0; i--) {
      const weekStartDate = addDays(getWeekStart(today()), -i * 7);
      const weekStart = toISODate(weekStartDate);
      const completions = weekMap.get(weekStart) || 0;
      const target = habit.targetFrequency === 'daily' ? 7 : (habit.targetCount || 3);

      weeks.push({ weekStart, completions, target });
    }

    return weeks;
  }

  /**
   * Get monthly aggregated data (last 6 months)
   */
  private getMonthlyData(completedEntries: Entry[], habit: Habit): MonthData[] {
    const months: MonthData[] = [];
    const monthMap = new Map<string, number>();

    // Count completions per month
    completedEntries.forEach(entry => {
      const month = getMonth(entry.date);
      monthMap.set(month, (monthMap.get(month) || 0) + 1);
    });

    // Generate last 6 months
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = getMonth(date);
      const completions = monthMap.get(month) || 0;
      const daysInMonth = getDaysInMonth(month);
      const possibleDays = habit.targetFrequency === 'daily'
        ? daysInMonth
        : Math.ceil(daysInMonth / 7) * (habit.targetCount || 3);

      months.push({ month, completions, possibleDays });
    }

    return months;
  }

  /**
   * Clear cache (useful when entries are updated)
   */
  clearCache(habitId?: string): void {
    if (habitId) {
      Array.from(this.cache.keys())
        .filter(key => key.startsWith(habitId))
        .forEach(key => this.cache.delete(key));
    } else {
      this.cache.clear();
    }
  }
}

// Singleton instance
export const statsService = new StatsService();

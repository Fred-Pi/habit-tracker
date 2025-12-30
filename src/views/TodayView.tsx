import { useState } from 'react';
import { useHabits } from '@/features/habits/hooks/useHabits';
import { useEntries } from '@/features/entries/hooks/useEntries';
import { DailyCheckIn } from '@/features/entries/components/DailyCheckIn';
import { Modal } from '@/shared/components/Modal';
import { HabitForm } from '@/features/habits/components/HabitForm';
import { EmptyState } from '@/shared/components/EmptyState';
import { today } from '@/shared/utils/date';
import { Habit } from '@/types';

export function TodayView() {
  const { habits, addHabit, updateHabit } = useHabits();
  const { isCompleted, toggleEntry, getCompletionCount } = useEntries();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | undefined>();

  const todayCompletions = getCompletionCount(today());
  const totalHabits = habits.length;
  const completionPercentage = totalHabits > 0
    ? Math.round((todayCompletions / totalHabits) * 100)
    : 0;

  const handleAddHabit = (habitData: Omit<Habit, 'id' | 'createdAt'>) => {
    if (editingHabit) {
      updateHabit(editingHabit.id, habitData);
    } else {
      addHabit(habitData);
    }
    setIsModalOpen(false);
    setEditingHabit(undefined);
  };

  const handleOpenModal = () => {
    setEditingHabit(undefined);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header with progress */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Today</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <button
            onClick={handleOpenModal}
            className="px-4 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Habit
          </button>
        </div>

        {totalHabits > 0 && (
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600 dark:text-gray-400">Daily Progress</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {todayCompletions} / {totalHabits}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <div
                className="bg-primary-600 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Check-in list */}
      {habits.length === 0 ? (
        <EmptyState
          icon="🎯"
          title="No habits yet"
          description="Create your first habit to start building better routines"
          action={{
            label: 'Create Habit',
            onClick: handleOpenModal,
          }}
        />
      ) : (
        <DailyCheckIn
          habits={habits}
          isCompleted={isCompleted}
          onToggle={toggleEntry}
        />
      )}

      {/* Modal for creating/editing habits */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingHabit(undefined);
        }}
        title={editingHabit ? 'Edit Habit' : 'New Habit'}
      >
        <HabitForm
          habit={editingHabit}
          onSubmit={handleAddHabit}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingHabit(undefined);
          }}
        />
      </Modal>
    </div>
  );
}

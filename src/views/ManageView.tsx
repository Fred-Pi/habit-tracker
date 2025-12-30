import { useState } from 'react';
import { useHabits } from '@/features/habits/hooks/useHabits';
import { HabitCard } from '@/features/habits/components/HabitCard';
import { HabitForm } from '@/features/habits/components/HabitForm';
import { Modal } from '@/shared/components/Modal';
import { EmptyState } from '@/shared/components/EmptyState';
import { Habit } from '@/types';

export function ManageView() {
  const { habits, updateHabit, archiveHabit } = useHabits();
  const [editingHabit, setEditingHabit] = useState<Habit | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = (habit: Habit) => {
    setEditingHabit(habit);
    setIsModalOpen(true);
  };

  const handleUpdate = (habitData: Omit<Habit, 'id' | 'createdAt'>) => {
    if (editingHabit) {
      updateHabit(editingHabit.id, habitData);
    }
    setIsModalOpen(false);
    setEditingHabit(undefined);
  };

  const handleArchive = (id: string) => {
    if (window.confirm('Archive this habit? You can restore it later.')) {
      archiveHabit(id);
    }
  };

  if (habits.length === 0) {
    return (
      <EmptyState
        icon="🎯"
        title="No habits to manage"
        description="Create your first habit to get started"
        action={{
          label: 'Go to Today',
          onClick: () => window.location.reload(),
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Manage Habits</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Edit or archive your habits
        </p>
      </div>

      {/* Habits list */}
      <div className="space-y-3">
        {habits.map((habit) => (
          <HabitCard
            key={habit.id}
            habit={habit}
            onEdit={handleEdit}
            onArchive={handleArchive}
          />
        ))}
      </div>

      {/* Edit modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingHabit(undefined);
        }}
        title="Edit Habit"
      >
        <HabitForm
          habit={editingHabit}
          onSubmit={handleUpdate}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingHabit(undefined);
          }}
        />
      </Modal>
    </div>
  );
}

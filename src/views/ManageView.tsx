import { useState, useRef } from 'react';
import { useHabits } from '@/features/habits/hooks/useHabits';
import { useEntries } from '@/features/entries/hooks/useEntries';
import { HabitCard } from '@/features/habits/components/HabitCard';
import { HabitForm } from '@/features/habits/components/HabitForm';
import { Modal } from '@/shared/components/Modal';
import { EmptyState } from '@/shared/components/EmptyState';
import { Toast } from '@/shared/components/Toast';
import { exportData, downloadDataAsJSON, parseImportFile } from '@/shared/utils/dataExport';
import { Habit } from '@/types';

export function ManageView() {
  const { habits, habitsMap, updateHabit, archiveHabit } = useHabits();
  const { entriesMap } = useEntries();
  const [editingHabit, setEditingHabit] = useState<Habit | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleExport = () => {
    const data = exportData(habitsMap, entriesMap);
    const filename = `habit-tracker-${new Date().toISOString().split('T')[0]}.json`;
    downloadDataAsJSON(data, filename);
    setToastMessage('Data exported successfully!');
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const data = await parseImportFile(file);

      const confirmMessage = `Import ${Object.keys(data.habits).length} habits and ${
        Object.keys(data.entries).length
      } days of data?\n\nWarning: This will replace all existing data.`;

      if (!window.confirm(confirmMessage)) {
        return;
      }

      // Import data by updating localStorage directly
      localStorage.setItem('habits', JSON.stringify(data.habits));
      localStorage.setItem('entries', JSON.stringify(data.entries));

      setToastMessage('Data imported successfully! Refreshing...');

      // Reload page to reflect imported data
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to import data');
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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

      {/* Data Management */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Data Management
        </h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleExport}
            className="flex-1 px-4 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export Data
          </button>

          <label className="flex-1">
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
            <div className="px-4 py-2 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 cursor-pointer">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Import Data
            </div>
          </label>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
          Export your data as JSON to back it up or transfer to another device. Import will replace all existing data.
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

      {/* Toast for feedback */}
      <Toast
        message={toastMessage}
        isVisible={!!toastMessage}
        onClose={() => setToastMessage('')}
      />
    </div>
  );
}

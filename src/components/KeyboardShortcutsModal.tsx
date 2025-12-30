import { Modal } from '@/shared/components/Modal';

type Shortcut = {
  key: string;
  description: string;
  category?: string;
};

type KeyboardShortcutsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const shortcuts: Shortcut[] = [
  { key: 'N', description: 'Create new habit', category: 'Actions' },
  { key: '1-9', description: 'Quick toggle habits (Today view)', category: 'Actions' },
  { key: '?', description: 'Show keyboard shortcuts', category: 'Help' },
  { key: 'Esc', description: 'Close modal or dialog', category: 'Navigation' },
];

export function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  const categories = Array.from(new Set(shortcuts.map(s => s.category || 'General')));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Keyboard Shortcuts">
      <div className="space-y-6">
        {categories.map(category => (
          <div key={category}>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              {category}
            </h3>
            <div className="space-y-2">
              {shortcuts
                .filter(s => (s.category || 'General') === category)
                .map((shortcut, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
                  >
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {shortcut.description}
                    </span>
                    <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">
                      {shortcut.key}
                    </kbd>
                  </div>
                ))}
            </div>
          </div>
        ))}

        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Press <kbd className="px-1 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 rounded">?</kbd> anytime to view shortcuts
          </p>
        </div>
      </div>
    </Modal>
  );
}

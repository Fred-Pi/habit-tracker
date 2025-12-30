import { useEffect } from 'react';

export type KeyboardShortcut = {
  key: string;
  description: string;
  action: () => void;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
};

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[], enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      for (const shortcut of shortcuts) {
        const keyMatches = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatches = !shortcut.ctrl || event.ctrlKey || event.metaKey;
        const shiftMatches = !shortcut.shift || event.shiftKey;
        const altMatches = !shortcut.alt || event.altKey;

        if (keyMatches && ctrlMatches && shiftMatches && altMatches) {
          // Only prevent default if modifiers match exactly
          const exactModifierMatch =
            (shortcut.ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey) &&
            (shortcut.shift ? event.shiftKey : !event.shiftKey) &&
            (shortcut.alt ? event.altKey : !event.altKey);

          if (exactModifierMatch) {
            event.preventDefault();
            shortcut.action();
            break;
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts, enabled]);
}

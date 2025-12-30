import { HabitsMap, EntriesMap } from '@/types';

export type ExportData = {
  version: string;
  exportedAt: string;
  habits: HabitsMap;
  entries: EntriesMap;
};

/**
 * Export all app data as JSON
 */
export function exportData(habits: HabitsMap, entries: EntriesMap): ExportData {
  return {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    habits,
    entries,
  };
}

/**
 * Download data as JSON file
 */
export function downloadDataAsJSON(data: ExportData, filename = 'habit-tracker-export.json') {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/**
 * Validate imported data structure
 */
export function validateImportData(data: unknown): data is ExportData {
  if (!data || typeof data !== 'object') {
    return false;
  }

  const d = data as Record<string, unknown>;

  // Check required fields
  if (!d.version || typeof d.version !== 'string') {
    return false;
  }

  if (!d.exportedAt || typeof d.exportedAt !== 'string') {
    return false;
  }

  if (!d.habits || typeof d.habits !== 'object') {
    return false;
  }

  if (!d.entries || typeof d.entries !== 'object') {
    return false;
  }

  return true;
}

/**
 * Parse imported JSON file
 */
export async function parseImportFile(file: File): Promise<ExportData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const data = JSON.parse(text);

        if (!validateImportData(data)) {
          reject(new Error('Invalid data format. Please upload a valid export file.'));
          return;
        }

        resolve(data);
      } catch (error) {
        reject(new Error('Failed to parse JSON file. Please check the file format.'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file.'));
    };

    reader.readAsText(file);
  });
}

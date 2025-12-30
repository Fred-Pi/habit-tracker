import { DayCompletion } from '@/types';
import { formatDate, parseISODate } from '@/shared/utils/date';

type HeatMapProps = {
  data: DayCompletion[];
  color?: string;
};

export function HeatMap({ data, color = 'bg-green-500' }: HeatMapProps) {
  const getDayName = (date: string) => {
    const d = parseISODate(date);
    return d.toLocaleDateString('en-US', { weekday: 'short' });
  };

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Last 30 Days
      </h3>

      <div className="grid grid-cols-10 gap-2">
        {data.map((day, index) => {
          const isWeekStart = index % 7 === 0;

          return (
            <div key={day.date} className="flex flex-col items-center">
              {isWeekStart && index < 7 && (
                <div className="text-xs text-gray-500 mb-1 h-4">
                  {getDayName(day.date).slice(0, 1)}
                </div>
              )}
              {!isWeekStart && index < 7 && <div className="h-4 mb-1" />}

              <div
                className={`w-8 h-8 rounded transition-all ${
                  day.completed
                    ? `${color} ring-2 ring-green-200`
                    : 'bg-gray-100 border border-gray-200'
                }`}
                title={`${formatDate(day.date)}: ${
                  day.completed ? 'Completed' : 'Not completed'
                }`}
              />

              {index >= data.length - 7 && (
                <div className="text-xs text-gray-400 mt-1">
                  {formatDate(day.date, 'short').split(' ')[1]}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-600">
        <div className="flex items-center gap-1">
          <div className={`w-3 h-3 rounded ${color}`} />
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-gray-100 border border-gray-200" />
          <span>Not completed</span>
        </div>
      </div>
    </div>
  );
}

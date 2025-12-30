import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import { WeekData } from '@/types';
import { formatDate } from '@/shared/utils/date';

type WeeklyChartProps = {
  data: WeekData[];
};

export function WeeklyChart({ data }: WeeklyChartProps) {
  const chartData = data.map(week => ({
    week: formatDate(week.weekStart, 'short'),
    completions: week.completions,
    target: week.target,
  }));

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Weekly Progress (Last 12 Weeks)
      </h3>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <XAxis
            dataKey="week"
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Bar dataKey="completions" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => {
              const completionRate = entry.target > 0
                ? entry.completions / entry.target
                : 0;
              const cellColor =
                completionRate >= 1
                  ? '#10b981' // green - target met
                  : completionRate >= 0.7
                  ? '#f59e0b' // orange - close to target
                  : '#3b82f6'; // blue - below target

              return <Cell key={`cell-${index}`} fill={cellColor} />;
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-600">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-green-500" />
          <span>Target met</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-orange-500" />
          <span>Close</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-blue-500" />
          <span>Below target</span>
        </div>
      </div>
    </div>
  );
}

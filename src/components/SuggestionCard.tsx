import { parseLocalDate } from '../lib/calendar';
import type { Period } from '../types';

type Props = {
  period: Period;
  rank: number;
};

const RANK_CONFIG = [
  { icon: '🏆', border: 'border-yellow-400', bg: 'bg-yellow-50', badge: 'bg-yellow-100 text-yellow-800' },
  { icon: '🥈', border: 'border-gray-400',   bg: 'bg-gray-50',   badge: 'bg-gray-100 text-gray-700'   },
  { icon: '🥉', border: 'border-orange-400', bg: 'bg-orange-50', badge: 'bg-orange-100 text-orange-800' },
] as const;

const DEFAULT_CONFIG = { icon: '', border: 'border-indigo-200', bg: 'bg-white', badge: 'bg-indigo-100 text-indigo-700' };

function formatDay(dateStr: string): string {
  return parseLocalDate(dateStr).toLocaleDateString(undefined, { day: 'numeric', month: 'long' });
}

function formatRange(start: string, end: string): string {
  const s = parseLocalDate(start).toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
  const e = parseLocalDate(end).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
  return `${s} – ${e}`;
}

export default function SuggestionCard({ period, rank }: Props) {
  const cfg = rank <= 3 ? RANK_CONFIG[rank - 1] : DEFAULT_CONFIG;
  const vacDays = period.requiredVacationDays;

  return (
    <div className={`rounded-2xl border-2 ${cfg.border} ${cfg.bg} p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-baseline gap-2 flex-wrap">
          {cfg.icon && <span className="text-2xl leading-none">{cfg.icon}</span>}
          {!cfg.icon && (
            <span className="text-sm font-bold text-indigo-400 tabular-nums">#{rank}</span>
          )}
          <span className="text-4xl font-bold text-indigo-900 tabular-nums leading-none">
            {period.totalDays}
          </span>
          <span className="text-base font-medium text-indigo-700">
            sammenhængende fridage
          </span>
        </div>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${cfg.badge}`}>
          {period.roi.toFixed(1)}×
        </span>
      </div>

      {/* Date range */}
      <p className="text-sm text-gray-500 -mt-2">{formatRange(period.start, period.end)}</p>

      {/* Vacation days list */}
      <div className="border-t border-black/5 pt-4">
        <p className="text-sm font-semibold text-gray-700 mb-2">
          Brug {vacDays} feriedag{vacDays !== 1 ? 'e' : ''} fri:
        </p>
        <ul className="space-y-1.5">
          {period.vacationDates.map((date) => (
            <li key={date} className="flex items-center gap-2 text-sm text-gray-800">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
              {formatDay(date)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

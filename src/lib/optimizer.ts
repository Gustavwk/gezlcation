import type { Day, Period } from '../types';

const MAX_VACATION_DAYS = 20;
const TOP_N = 10;

/**
 * Finds the top vacation periods by enumerating all contiguous intervals.
 *
 * For each start i, extend j until we've consumed MAX_VACATION_DAYS workdays.
 * Track the best period (most total days) per number of vacation days spent.
 * Sort by ROI = totalDays / requiredVacationDays and return top N.
 *
 * Complexity: O(n × MAX_VACATION_DAYS) ≈ 7 300 iterations for a 365-day year.
 */
export function findBestPeriods(days: Day[]): Period[] {
  const n = days.length;
  const best = new Map<number, Period>();

  for (let i = 0; i < n; i++) {
    let vacationCount = 0;

    for (let j = i; j < n; j++) {
      const day = days[j];
      if (!day.isWeekend && !day.isHoliday) {
        vacationCount++;
      }
      if (vacationCount > MAX_VACATION_DAYS) break;
      if (vacationCount === 0) continue;

      const totalDays = j - i + 1;
      const existing = best.get(vacationCount);
      if (!existing || totalDays > existing.totalDays) {
        const { vacationDates, holidayDates } = collectDates(days, i, j);
        best.set(vacationCount, {
          start: days[i].date,
          end: days[j].date,
          totalDays,
          requiredVacationDays: vacationCount,
          roi: totalDays / vacationCount,
          vacationDates,
          holidayDates,
        });
      }
    }
  }

  return Array.from(best.values())
    .sort((a, b) => b.roi - a.roi || b.totalDays - a.totalDays)
    .slice(0, TOP_N);
}

function collectDates(days: Day[], from: number, to: number): { vacationDates: string[]; holidayDates: string[] } {
  const vacationDates: string[] = [];
  const holidayDates: string[] = [];
  for (let k = from; k <= to; k++) {
    if (!days[k].isWeekend && !days[k].isHoliday) {
      vacationDates.push(days[k].date);
    } else if (days[k].isHoliday) {
      holidayDates.push(days[k].date);
    }
  }
  return { vacationDates, holidayDates };
}

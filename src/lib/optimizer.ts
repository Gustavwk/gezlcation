import type { Day, Period, VacationFilter } from '../types';

const MAX_VACATION_DAYS = 20;
const TOP_N = 3;

/**
 * Finds the top vacation periods by enumerating all contiguous intervals.
 *
 * When a VacationFilter is supplied the search is constrained to days within
 * [filter.from, filter.to] and vacation days are capped at filter.budget.
 *
 * Complexity: O(n × MAX_VACATION_DAYS) ≈ 7 300 iterations for a 365-day year.
 */
export function findBestPeriods(days: Day[], filter?: VacationFilter): Period[] {
  const n = days.length;
  const maxVac = filter?.budget ?? MAX_VACATION_DAYS;

  // Resolve index bounds when a filter window is given
  let startIdx = 0;
  let endIdx = n - 1;

  if (filter?.from) {
    const idx = days.findIndex((d) => d.date >= filter.from);
    if (idx === -1) return [];
    startIdx = idx;
  }

  if (filter?.to) {
    let idx = -1;
    for (let i = n - 1; i >= 0; i--) {
      if (days[i].date <= filter.to) { idx = i; break; }
    }
    if (idx === -1) return [];
    endIdx = idx;
  }

  if (startIdx > endIdx) return [];

  const best = new Map<number, Period>();

  for (let i = startIdx; i <= endIdx; i++) {
    let vacationCount = 0;

    for (let j = i; j <= endIdx; j++) {
      const day = days[j];
      if (!day.isWeekend && !day.isHoliday) vacationCount++;
      if (vacationCount > maxVac) break;
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

function collectDates(
  days: Day[],
  from: number,
  to: number,
): { vacationDates: string[]; holidayDates: string[] } {
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

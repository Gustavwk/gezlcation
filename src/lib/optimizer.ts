import type { Day, Period, VacationFilter } from '../types';

const MAX_VACATION_DAYS = 20;
const TOP_N = 3;

/**
 * Finds the top 3 periods that include at least one public holiday, sorted by ROI.
 * Pure weekend extensions (no holidays) are intentionally excluded as trivial.
 */
export function findBestPeriods(days: Day[], filter?: VacationFilter): Period[] {
  const maxVac = filter?.budget ?? MAX_VACATION_DAYS;
  const startIdx = resolveStart(days, filter?.from);
  const endIdx = resolveEnd(days, filter?.to);
  if (startIdx === -1 || endIdx === -1 || startIdx > endIdx) return [];

  const best = new Map<number, Period>();

  for (let i = startIdx; i <= endIdx; i++) {
    let vacationCount = 0;
    let holidayCount = 0;
    for (let j = i; j <= endIdx; j++) {
      const day = days[j];
      if (!day.isWeekend && !day.isHoliday) vacationCount++;
      if (day.isHoliday) holidayCount++;
      if (vacationCount > maxVac) break;
      if (vacationCount === 0) continue;
      if (holidayCount === 0) continue; // skip trivial weekend-extension periods

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

/**
 * Finds the single contiguous period that maximises total calendar days
 * while using at most filter.budget vacation days.
 * This is the one answer to "how do I get the longest possible holiday?"
 */
export function findBestVacation(days: Day[], filter: VacationFilter): Period | null {
  const startIdx = resolveStart(days, filter.from);
  const endIdx = resolveEnd(days, filter.to);
  if (startIdx === -1 || endIdx === -1 || startIdx > endIdx) return null;

  let best: Period | null = null;

  for (let i = startIdx; i <= endIdx; i++) {
    let vacationCount = 0;
    let lastJ = -1;
    let lastVacCount = 0;

    for (let j = i; j <= endIdx; j++) {
      const day = days[j];
      if (!day.isWeekend && !day.isHoliday) vacationCount++;
      if (vacationCount > filter.budget) break;
      lastJ = j;
      lastVacCount = vacationCount;
    }

    if (lastJ === -1 || lastVacCount === 0) continue;

    // Extend past filter.to with free days (weekends/holidays) that follow immediately —
    // this is what lets a Dec vacation naturally wrap into the New Year.
    let tailJ = lastJ;
    while (tailJ + 1 < days.length) {
      const next = days[tailJ + 1];
      if (!next.isWeekend && !next.isHoliday) break;
      tailJ++;
    }

    const totalDays = tailJ - i + 1;
    if (
      !best ||
      totalDays > best.totalDays ||
      (totalDays === best.totalDays && lastVacCount < best.requiredVacationDays)
    ) {
      const { vacationDates, holidayDates } = collectDates(days, i, tailJ);
      best = {
        start: days[i].date,
        end: days[tailJ].date,
        totalDays,
        requiredVacationDays: lastVacCount,
        roi: totalDays / lastVacCount,
        vacationDates,
        holidayDates,
      };
    }
  }

  return best;
}

// ─── helpers ────────────────────────────────────────────────────────────────

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

function resolveStart(days: Day[], from?: string): number {
  if (!from) return 0;
  const idx = days.findIndex((d) => d.date >= from);
  return idx;
}

function resolveEnd(days: Day[], to?: string): number {
  if (!to) return days.length - 1;
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].date <= to) return i;
  }
  return -1;
}

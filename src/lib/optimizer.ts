import type { Day, Period, VacationFilter } from '../types';

const MAX_VACATION_DAYS = 20;
const TOP_N = 3;

/**
 * Finds the top 3 vacation periods by enumerating all contiguous intervals.
 * For each start i, extend j until we've consumed MAX_VACATION_DAYS workdays.
 * Track the best period (most total days) per vacation-day count, sort by ROI.
 */
export function findBestPeriods(days: Day[], filter?: VacationFilter): Period[] {
  const maxVac = filter?.budget ?? MAX_VACATION_DAYS;
  const startIdx = resolveStart(days, filter?.from);
  const endIdx = resolveEnd(days, filter?.to);
  if (startIdx === -1 || endIdx === -1 || startIdx > endIdx) return [];

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

/**
 * Greedy vacation planner: iteratively picks the highest-ROI period from the
 * remaining calendar until the vacation budget is exhausted.
 *
 * Each selected period splits the available window into two non-overlapping
 * segments, preventing double-counting of days.
 *
 * Returns periods sorted chronologically — ready to render as a travel plan.
 */
export function findVacationPlan(days: Day[], filter: VacationFilter): Period[] {
  const startIdx = resolveStart(days, filter.from);
  const endIdx = resolveEnd(days, filter.to);
  if (startIdx === -1 || endIdx === -1 || startIdx > endIdx) return [];

  const plan: Period[] = [];
  let remaining = filter.budget;
  let segments: [number, number][] = [[startIdx, endIdx]];

  while (remaining > 0 && segments.length > 0) {
    let best: SegmentBest | null = null;
    let bestSegIdx = -1;

    for (let si = 0; si < segments.length; si++) {
      const [s, e] = segments[si];
      const candidate = bestInSegment(days, s, e, remaining);
      if (candidate && (!best || candidate.period.roi > best.period.roi ||
          (candidate.period.roi === best.period.roi &&
           candidate.period.totalDays > best.period.totalDays))) {
        best = candidate;
        bestSegIdx = si;
      }
    }

    if (!best) break;

    plan.push(best.period);
    remaining -= best.period.requiredVacationDays;

    // Split the chosen segment around the selected period
    const [segStart, segEnd] = segments[bestSegIdx];
    const next: [number, number][] = segments.filter((_, i) => i !== bestSegIdx);
    if (best.startIdx > segStart) next.push([segStart, best.startIdx - 1]);
    if (best.endIdx < segEnd)     next.push([best.endIdx + 1, segEnd]);
    segments = next;
  }

  return plan.sort((a, b) => a.start.localeCompare(b.start));
}

// ─── helpers ────────────────────────────────────────────────────────────────

type SegmentBest = { period: Period; startIdx: number; endIdx: number };

function bestInSegment(
  days: Day[],
  segStart: number,
  segEnd: number,
  maxVac: number,
): SegmentBest | null {
  const best = new Map<number, SegmentBest>();

  for (let i = segStart; i <= segEnd; i++) {
    let vacationCount = 0;
    for (let j = i; j <= segEnd; j++) {
      const day = days[j];
      if (!day.isWeekend && !day.isHoliday) vacationCount++;
      if (vacationCount > maxVac) break;
      if (vacationCount === 0) continue;

      const totalDays = j - i + 1;
      const existing = best.get(vacationCount);
      if (!existing || totalDays > existing.period.totalDays) {
        const { vacationDates, holidayDates } = collectDates(days, i, j);
        best.set(vacationCount, {
          period: {
            start: days[i].date,
            end: days[j].date,
            totalDays,
            requiredVacationDays: vacationCount,
            roi: totalDays / vacationCount,
            vacationDates,
            holidayDates,
          },
          startIdx: i,
          endIdx: j,
        });
      }
    }
  }

  if (best.size === 0) return null;
  return Array.from(best.values())
    .sort((a, b) => b.period.roi - a.period.roi || b.period.totalDays - a.period.totalDays)[0];
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

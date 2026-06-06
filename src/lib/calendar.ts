import type { Day } from '../types';

export function buildCalendar(year: number, holidayDates: string[]): Day[] {
  const holidaySet = new Set(holidayDates);
  const days: Day[] = [];

  const cursor = new Date(year, 0, 1);
  const end = new Date(year + 1, 11, 31); // include full next year
  while (cursor <= end) {
    const dateStr = toISODate(cursor);
    const dow = cursor.getDay();
    days.push({
      date: dateStr,
      isWeekend: dow === 0 || dow === 6,
      isHoliday: holidaySet.has(dateStr),
    });
    cursor.setDate(cursor.getDate() + 1);
  }

  return days;
}

export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

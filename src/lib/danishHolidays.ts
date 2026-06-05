import type { Holiday } from '../types';
// Valid for years 1583+ (Gregorian calendar)
function easterSunday(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

function shift(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function iso(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getDanishHolidays(year: number): Holiday[] {
  const easter = easterSunday(year);

  const entries: { date: Date; localName: string; name: string }[] = [
    { date: new Date(year, 0, 1),      localName: 'Nytårsdag',            name: "New Year's Day" },
    { date: shift(easter, -3),          localName: 'Skærtorsdag',          name: 'Maundy Thursday' },
    { date: shift(easter, -2),          localName: 'Langfredag',           name: 'Good Friday' },
    { date: easter,                     localName: '1. Påskedag',          name: 'Easter Sunday' },
    { date: shift(easter,  1),          localName: '2. Påskedag',          name: 'Easter Monday' },
    // Store Bededag was abolished as a public holiday from 2024
    ...(year < 2024
      ? [{ date: shift(easter, 26), localName: 'Store Bededag', name: 'General Prayer Day' }]
      : []),
    { date: shift(easter, 39),          localName: 'Kristi Himmelfartsdag', name: 'Ascension Day' },
    { date: shift(easter, 49),          localName: '1. Pinsedag',          name: 'Whit Sunday' },
    { date: shift(easter, 50),          localName: '2. Pinsedag',          name: 'Whit Monday' },
    { date: new Date(year, 11, 25),    localName: 'Juledag',              name: 'Christmas Day' },
    { date: new Date(year, 11, 26),    localName: '2. Juledag',           name: "St. Stephen's Day" },
  ];

  return entries
    .map(({ date, localName, name }) => ({ date: iso(date), localName, name }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

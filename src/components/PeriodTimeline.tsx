import { parseLocalDate, toISODate } from '../lib/calendar';
import styles from './PeriodTimeline.module.css';

type DayType = 'vacation' | 'holiday' | 'weekend' | 'outside';

type DayEntry = {
  date: string;
  num: number;
  type: DayType;
};

type Props = {
  start: string;
  end: string;
  vacationDates: string[];
  holidayDates: string[];
};

const WEEK_HEADERS = ['Ma', 'Ti', 'On', 'To', 'Fr', 'Lø', 'Sø'];

function buildDays(start: string, end: string, vacSet: Set<string>, holSet: Set<string>): DayEntry[] {
  const entries: DayEntry[] = [];
  const cursor = parseLocalDate(start);
  const endDate = parseLocalDate(end);

  while (cursor <= endDate) {
    const dateStr = toISODate(cursor);
    const type: DayType = vacSet.has(dateStr) ? 'vacation'
                        : holSet.has(dateStr)  ? 'holiday'
                        : 'weekend';
    entries.push({ date: dateStr, num: cursor.getDate(), type });
    cursor.setDate(cursor.getDate() + 1);
  }

  return entries;
}

function toWeekRows(entries: DayEntry[]): DayEntry[][] {
  if (entries.length === 0) return [];

  const firstDow = (parseLocalDate(entries[0].date).getDay() + 6) % 7;

  // Pre-padding: days before the period start to fill the first week row
  const prePad: DayEntry[] = [];
  const startDate = parseLocalDate(entries[0].date);
  for (let i = firstDow; i > 0; i--) {
    const d = new Date(startDate);
    d.setDate(d.getDate() - i);
    prePad.push({ date: toISODate(d), num: d.getDate(), type: 'outside' });
  }

  const all = [...prePad, ...entries];
  const rem = all.length % 7;

  // Post-padding: days after the period end to fill the last week row
  if (rem > 0) {
    const lastDate = parseLocalDate(all[all.length - 1].date);
    for (let i = 1; i <= 7 - rem; i++) {
      const d = new Date(lastDate);
      d.setDate(d.getDate() + i);
      all.push({ date: toISODate(d), num: d.getDate(), type: 'outside' });
    }
  }

  const rows: DayEntry[][] = [];
  for (let i = 0; i < all.length; i += 7) {
    rows.push(all.slice(i, i + 7));
  }
  return rows;
}

export default function PeriodTimeline({ start, end, vacationDates, holidayDates }: Props) {
  const vacSet = new Set(vacationDates);
  const holSet = new Set(holidayDates);
  const rows = toWeekRows(buildDays(start, end, vacSet, holSet));

  return (
    <div className={styles.wrapper}>
      <div className={styles.grid}>
        {WEEK_HEADERS.map((h) => (
          <div key={h} className={styles.dayHeader}>{h}</div>
        ))}
      </div>

      {rows.map((row, ri) => (
        <div key={ri} className={styles.grid}>
          {row.map((day) => (
            <div key={day.date} className={`${styles.cell} ${styles[day.type]}`}>
              <span className={styles.cellNum}>{day.num}</span>
            </div>
          ))}
        </div>
      ))}

      <div className={styles.legend}>
        <span className={`${styles.legendSwatch} ${styles.vacation}`} />
        <span className={styles.legendLabel}>Feriedag</span>
        <span className={`${styles.legendSwatch} ${styles.holiday}`} />
        <span className={styles.legendLabel}>Helligdag</span>
        <span className={`${styles.legendSwatch} ${styles.weekend}`} />
        <span className={styles.legendLabel}>Weekend</span>
        <span className={`${styles.legendSwatch} ${styles.outside}`} />
        <span className={styles.legendLabel}>Hverdag</span>
      </div>
    </div>
  );
}

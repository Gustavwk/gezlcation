import { parseLocalDate, toISODate } from '../lib/calendar';
import styles from './PeriodTimeline.module.css';

type DayType = 'vacation' | 'holiday' | 'weekend';

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

// Monday-first week headers (Danish)
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

function toWeekRows(entries: DayEntry[]): (DayEntry | null)[][] {
  if (entries.length === 0) return [];
  // Convert JS Sunday=0 to Monday=0 offset
  const firstDow = (parseLocalDate(entries[0].date).getDay() + 6) % 7;
  const padded: (DayEntry | null)[] = [...Array(firstDow).fill(null), ...entries];
  const rem = padded.length % 7;
  if (rem > 0) padded.push(...Array(7 - rem).fill(null));

  const rows: (DayEntry | null)[][] = [];
  for (let i = 0; i < padded.length; i += 7) {
    rows.push(padded.slice(i, i + 7) as (DayEntry | null)[]);
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
          {row.map((day, di) =>
            day ? (
              <div key={day.date} className={`${styles.cell} ${styles[day.type]}`}>
                <span className={styles.cellNum}>{day.num}</span>
              </div>
            ) : (
              <div key={`pad-${ri}-${di}`} className={styles.emptyCell} />
            )
          )}
        </div>
      ))}

      <div className={styles.legend}>
        <span className={`${styles.legendSwatch} ${styles.vacation}`} />
        <span className={styles.legendLabel}>Feriedag</span>
        <span className={`${styles.legendSwatch} ${styles.holiday}`} />
        <span className={styles.legendLabel}>Helligdag</span>
        <span className={`${styles.legendSwatch} ${styles.weekend}`} />
        <span className={styles.legendLabel}>Weekend</span>
      </div>
    </div>
  );
}

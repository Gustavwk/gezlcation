import { parseLocalDate } from '../lib/calendar';
import type { Period } from '../types';
import PeriodTimeline from './PeriodTimeline';
import styles from './SuggestionCard.module.css';

type Props = {
  period: Period;
  rank: number;
};

type Variant = 'Gold' | 'Silver' | 'Bronze' | 'Other';

function rankVariant(rank: number): Variant {
  if (rank === 1) return 'Gold';
  if (rank === 2) return 'Silver';
  if (rank === 3) return 'Bronze';
  return 'Other';
}

function formatRange(start: string, end: string): string {
  const s = parseLocalDate(start).toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
  const e = parseLocalDate(end).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
  return `${s} – ${e}`;
}

export default function SuggestionCard({ period, rank }: Props) {
  const variant = rankVariant(rank);

  return (
    <div className={`${styles.card} ${styles[`card${variant}`]}`}>

      <div className={styles.cardHeader}>
        <div className={styles.titleGroup}>
          <span className={`${styles.rankBadge} ${styles[`rankBadge${variant}`]}`}>
            #{rank}
          </span>
          <span className={styles.totalDays}>
            {period.totalDays}
            <span className={styles.totalUnit}>Fridage</span>
          </span>
        </div>
        <span className={`${styles.roiBadge} ${styles[`roiBadge${variant}`]}`}>
          {period.roi.toFixed(1)}×
        </span>
      </div>

      <p className={styles.dateRange}>{formatRange(period.start, period.end)}</p>

      <PeriodTimeline
        start={period.start}
        end={period.end}
        vacationDates={period.vacationDates}
        holidayDates={period.holidayDates}
      />

    </div>
  );
}

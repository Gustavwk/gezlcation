import type { Period } from '../types';
import SuggestionCard from './SuggestionCard';
import styles from './SuggestionList.module.css';

type Props = {
  periods: Period[];
  title: string;
  subtitle?: string;
};

export default function SuggestionList({ periods, title, subtitle }: Props) {
  return (
    <section>
      <h2 className={styles.heading}>{title}</h2>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      <div className={styles.grid}>
        {periods.map((period, i) => (
          <SuggestionCard
            key={`${period.start}-${period.end}-${period.requiredVacationDays}`}
            period={period}
            rank={i + 1}
          />
        ))}
      </div>
    </section>
  );
}

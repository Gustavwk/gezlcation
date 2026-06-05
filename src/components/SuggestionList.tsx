import type { Period } from '../types';
import SuggestionCard from './SuggestionCard';
import styles from './SuggestionList.module.css';

type Props = {
  periods: Period[];
};

export default function SuggestionList({ periods }: Props) {
  return (
    <section>
      <h2 className={styles.heading}>Top {periods.length} ferieperioder</h2>
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

import type { Period } from '../types';
import React from 'react';
import SuggestionCard from './SuggestionCard';
import styles from './SuggestionList.module.css';

type Props = {
  periods: Period[];
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
};

export default function SuggestionList({ periods, title, subtitle, action }: Props) {
  return (
    <section>
      <div className={styles.headingRow}>
        <h2 className={styles.heading}>{title}</h2>
        {action && <div>{action}</div>}
      </div>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      <div className={periods.length === 1 ? styles.gridSingle : styles.grid}>
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

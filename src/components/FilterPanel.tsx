import { useEffect, useState } from 'react';
import type { VacationFilter } from '../types';
import styles from './FilterPanel.module.css';

type Props = {
  year: number;
  isActive: boolean;
  onFilter: (f: VacationFilter) => void;
  onClear: () => void;
};

export default function FilterPanel({ year, isActive, onFilter, onClear }: Props) {
  const [from, setFrom] = useState(`${year}-06-01`);
  const [to, setTo] = useState(`${year}-08-31`);
  const [budget, setBudget] = useState(5);

  useEffect(() => {
    setFrom(`${year}-06-01`);
    setTo(`${year}-08-31`);
  }, [year]);

  const isValid = from.length > 0 && to.length > 0 && from <= to && budget >= 1;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isValid) onFilter({ from, to, budget });
  }

  function planRestOfYear() {
    const today = new Date();
    const f = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const t = `${year}-12-31`;
    setFrom(f);
    setTo(t);
    onFilter({ from: f, to: t, budget });
  }

  return (
    <div className={styles.panel}>
      <h3 className={styles.heading}>Planlæg din ferie</h3>
      <p className={styles.description}>
        Vælg en periode og dit feriebudget for at se de bedste muligheder inden for dine rammer.
      </p>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.fields}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="filter-from">Fra</label>
            <input
              id="filter-from"
              type="date"
              value={from}
              min={`${year}-01-01`}
              max={`${year}-12-31`}
              onChange={(e) => setFrom(e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="filter-to">Til</label>
            <input
              id="filter-to"
              type="date"
              value={to}
              min={from || `${year}-01-01`}
              max={`${year}-12-31`}
              onChange={(e) => setTo(e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="filter-budget">
              Feriedage til rådighed
            </label>
            <div className={styles.budgetRow}>
              <input
                id="filter-budget"
                type="number"
                min={1}
                max={30}
                value={budget}
                onChange={(e) => setBudget(Math.max(1, Number(e.target.value)))}
                className={`${styles.input} ${styles.budgetInput}`}
              />
              <span className={styles.budgetUnit}>dage</span>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button type="submit" disabled={!isValid} className={styles.submitButton}>
            Find perioder
          </button>
          <button type="button" onClick={planRestOfYear} className={styles.quickButton}>
            Fra i dag til årets slut
          </button>
          {isActive && (
            <button type="button" onClick={onClear} className={styles.clearButton}>
              Ryd filter
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

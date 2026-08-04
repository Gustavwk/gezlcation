import { useEffect, useState } from 'react';
import type { VacationFilter } from '../types';
import { availableDaysAt } from '../lib/optimizer';
import styles from './FilterPanel.module.css';

type Props = {
  year: number;
  isActive: boolean;
  onFilter: (f: VacationFilter) => void;
  onClear: () => void;
};

const STATUTORY_RATE = 2.08; // lovpligtig ferie: 25 dage/år
const EXTRA_RATE = 0.5;      // feriefridage / 6. ferieuge: 6 dage/år

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function FilterPanel({ year, isActive, onFilter, onClear }: Props) {
  const [from, setFrom] = useState(todayStr);
  const [to, setTo] = useState(`${year}-08-31`);
  const [balanceStr, setBalanceStr] = useState('10');
  const [statutory, setStatutory] = useState(true);
  const [extra, setExtra] = useState(true);

  useEffect(() => {
    setFrom(todayStr());
    setTo(`${year}-08-31`);
  }, [year]);

  const balanceNum = Number(balanceStr);
  const accrualPerMonth =
    (statutory ? STATUTORY_RATE : 0) + (extra ? EXTRA_RATE : 0);

  const isValid =
    from.length > 0 &&
    to.length > 0 &&
    from <= to &&
    balanceStr !== '' &&
    !isNaN(balanceNum) &&
    balanceNum >= 0;

  function buildFilter(f: string, t: string): VacationFilter {
    return {
      from: f,
      to: t,
      asOf: f, // balance is measured at the chosen Fra-date; accrual runs from there
      balance: balanceNum,
      accrualPerMonth,
    };
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isValid) onFilter(buildFilter(from, to));
  }

  function planRestOfYear() {
    const f = todayStr();
    const t = `${year}-12-31`;
    setFrom(f);
    setTo(t);
    if (isValid) onFilter(buildFilter(f, t));
  }

  // Preview: whole days you'll have accrued by the end of the chosen window,
  // starting from the balance entered for the Fra-date.
  const daysByEnd = isValid ? availableDaysAt(buildFilter(from, to), to) : null;

  return (
    <div className={styles.panel}>
      <h3 className={styles.heading}>Planlæg din ferie</h3>
      <p className={styles.description}>
        Angiv din feriesaldo og hvordan du optjener — så finder Gezlcation det tidspunkt, hvor
        dine optjente feriedage giver flest sammenhængende fridage op ad helligdage og weekender.
      </p>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.fields}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="filter-from">Fra</label>
            <input
              id="filter-from"
              type="date"
              value={from}
              min={todayStr()}
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
              min={from || todayStr()}
              onChange={(e) => setTo(e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="filter-balance">
              Feriesaldo pr. {from || 'fra-dato'}
            </label>
            <div className={styles.budgetRow}>
              <input
                id="filter-balance"
                type="text"
                inputMode="decimal"
                value={balanceStr}
                onChange={(e) => setBalanceStr(e.target.value)}
                className={`${styles.input} ${styles.budgetInput}`}
              />
              <span className={styles.budgetUnit}>dage</span>
            </div>
          </div>
        </div>

        <fieldset className={styles.accrual}>
          <legend className={styles.label}>Optjening pr. måned</legend>
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={statutory}
              onChange={(e) => setStatutory(e.target.checked)}
            />
            <span>Lovpligtig ferie — 2,08 dage/måned <em>(25 dage/år)</em></span>
          </label>
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={extra}
              onChange={(e) => setExtra(e.target.checked)}
            />
            <span>Feriefridage / 6. ferieuge — 0,5 dage/måned <em>(6 dage/år)</em></span>
          </label>
        </fieldset>

        {daysByEnd !== null && (
          <p className={styles.projection}>
            Du har ca. <strong>{daysByEnd} feriedage</strong> optjent frem mod {to}
            {accrualPerMonth > 0 && ` (optjener ${accrualPerMonth.toLocaleString('da-DK')} dage/måned)`}.
          </p>
        )}

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

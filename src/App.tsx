import { useEffect, useRef, useState } from 'react';
import type { Day, Period, VacationFilter } from './types';
import { getDanishHolidays } from './lib/danishHolidays';
import { buildCalendar } from './lib/calendar';
import { findBestPeriods, findBestVacation } from './lib/optimizer';
import YearSelect from './components/YearSelect';
import FilterPanel from './components/FilterPanel';
import SuggestionList from './components/SuggestionList';
import styles from './App.module.css';

const CURRENT_YEAR = new Date().getFullYear();

export default function App() {
  const [year, setYear] = useState(CURRENT_YEAR);

  const [calendar, setCalendar] = useState<Day[]>([]);
  const [periods, setPeriods] = useState<Period[]>([]);

  const [filter, setFilter] = useState<VacationFilter | null>(null);
  const [bestVacation, setBestVacation] = useState<Period | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const holidays = [
      ...getDanishHolidays(year),
      ...getDanishHolidays(year + 1),
    ];
    const cal = buildCalendar(year, holidays.map((h) => h.date));
    setCalendar(cal);
    setPeriods(findBestPeriods(cal));
  }, [year]);

  useEffect(() => {
    if (calendar.length === 0 || !filter) {
      setBestVacation(null);
      return;
    }
    const result = findBestVacation(calendar, filter);
    setBestVacation(result);
    if (result) {
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  }, [calendar, filter]);

  return (
    <div className={styles.page}>
      <img src="/header-picture.webp" alt="Gezl" className={styles.headerImage} />
      <div className={styles.container}>

        {periods.length > 0 && (
          <FilterPanel
            year={year}
            isActive={filter !== null}
            onFilter={setFilter}
            onClear={() => setFilter(null)}
          />
        )}

        {filter !== null && bestVacation !== null && (
          <div ref={resultRef}>
          <SuggestionList
            periods={[bestVacation]}
            title="Din bedste ferie"
            subtitle={`${bestVacation.totalDays} sammenhængende fridage · ${bestVacation.requiredVacationDays} af ${filter.budget} feriedage brugt`}
          />
          </div>
        )}

        {filter !== null && bestVacation === null && (
          <div className={styles.feedback}>
            <p className={styles.emptyMessage}>
              Ingen perioder fundet i den valgte periode — prøv et bredere datointerval.
            </p>
          </div>
        )}

        {periods.length > 0 && (
          <SuggestionList
            periods={periods}
            title="Top 3 ferieperioder"
            action={<YearSelect value={year} onChange={setYear} subtle />}
          />
        )}

        {periods.length === 0 && (
          <div className={styles.feedback}>
            <p className={styles.emptyMessage}>Ingen perioder fundet for dette år.</p>
          </div>
        )}

      </div>

      <footer className={styles.footer}>
        <p>Helligdagsdata er vejledende — verificér altid med din arbejdsgiver.</p>
        <p>
          Skabt af Gustav Weber Kinch &middot;{' '}
          <a href="mailto:ggeezzll@proton.me" className={styles.footerLink}>
            ggeezzll@proton.me
          </a>
        </p>
      </footer>
    </div>
  );
}

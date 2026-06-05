import { useEffect, useState } from 'react';
import type { Country, Period } from './types';
import { fetchCountries, fetchHolidays } from './data/holidays';
import { buildCalendar } from './lib/calendar';
import { findBestPeriods } from './lib/optimizer';
import CountrySelect from './components/CountrySelect';
import YearSelect from './components/YearSelect';
import SuggestionList from './components/SuggestionList';
import styles from './App.module.css';

const CURRENT_YEAR = new Date().getFullYear();

type Status = 'idle' | 'loading' | 'done' | 'error';

export default function App() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [country, setCountry] = useState('DK');
  const [year, setYear] = useState(CURRENT_YEAR);
  const [periods, setPeriods] = useState<Period[]>([]);
  const [status, setStatus] = useState<Status>('idle');

  useEffect(() => {
    fetchCountries().then(setCountries);
  }, []);

  useEffect(() => {
    setStatus('loading');
    setPeriods([]);
    fetchHolidays(country, year)
      .then((holidays) => {
        const calendar = buildCalendar(year, holidays.map((h) => h.date));
        setPeriods(findBestPeriods(calendar));
        setStatus('done');
      })
      .catch(() => setStatus('error'));
  }, [country, year]);

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        <header className={styles.header}>
          <h1 className={styles.title}>Gezel Holiday</h1>
          <p className={styles.subtitle}>Få mest muligt ud af dine feriedage</p>
        </header>

        <div className={styles.controls}>
          <CountrySelect countries={countries} value={country} onChange={setCountry} />
          <YearSelect value={year} onChange={setYear} />
        </div>

        {status === 'loading' && (
          <div className={styles.loading}>
            <div className={styles.spinner} />
            <p className={styles.loadingText}>Beregner bedste ferieperioder…</p>
          </div>
        )}

        {status === 'error' && (
          <div className={styles.feedback}>
            <p className={styles.errorMessage}>
              Kunne ikke hente helligdage — tjek din internetforbindelse og prøv igen.
            </p>
          </div>
        )}

        {status === 'done' && periods.length === 0 && (
          <div className={styles.feedback}>
            <p className={styles.emptyMessage}>Ingen perioder fundet for dette land og år.</p>
          </div>
        )}

        {status === 'done' && periods.length > 0 && (
          <SuggestionList periods={periods} />
        )}

      </div>
    </div>
  );
}

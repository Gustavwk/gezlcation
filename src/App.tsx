import { useEffect, useState } from 'react';
import type { Country, Day, Period, VacationFilter } from './types';
import { fetchCountries, fetchHolidays } from './data/holidays';
import { buildCalendar } from './lib/calendar';
import { findBestPeriods } from './lib/optimizer';
import CountrySelect from './components/CountrySelect';
import YearSelect from './components/YearSelect';
import FilterPanel from './components/FilterPanel';
import SuggestionList from './components/SuggestionList';
import styles from './App.module.css';

const CURRENT_YEAR = new Date().getFullYear();

type Status = 'idle' | 'loading' | 'done' | 'error';

export default function App() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [country, setCountry] = useState('DK');
  const [year, setYear] = useState(CURRENT_YEAR);

  const [calendar, setCalendar] = useState<Day[]>([]);
  const [periods, setPeriods] = useState<Period[]>([]);
  const [status, setStatus] = useState<Status>('idle');

  const [filter, setFilter] = useState<VacationFilter | null>(null);
  const [filteredPeriods, setFilteredPeriods] = useState<Period[]>([]);

  useEffect(() => {
    fetchCountries().then(setCountries);
  }, []);

  // Fetch holidays and compute default top 3 whenever country/year changes
  useEffect(() => {
    setStatus('loading');
    setCalendar([]);
    fetchHolidays(country, year)
      .then((holidays) => {
        const cal = buildCalendar(year, holidays.map((h) => h.date));
        setCalendar(cal);
        setPeriods(findBestPeriods(cal));
        setStatus('done');
      })
      .catch(() => setStatus('error'));
  }, [country, year]);

  // Recompute filtered results whenever the calendar or filter changes
  useEffect(() => {
    if (calendar.length === 0 || !filter) {
      setFilteredPeriods([]);
      return;
    }
    setFilteredPeriods(findBestPeriods(calendar, filter));
  }, [calendar, filter]);

  function handleFilter(f: VacationFilter) {
    setFilter(f);
  }

  function handleClearFilter() {
    setFilter(null);
    setFilteredPeriods([]);
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* Hero */}
        <header className={styles.hero}>
          <h1 className={styles.title}>Gezel Holiday</h1>
          <p className={styles.subtitle}>Få mest muligt ud af dine feriedage</p>
          <div className={styles.controls}>
            <CountrySelect countries={countries} value={country} onChange={setCountry} />
            <YearSelect value={year} onChange={setYear} />
          </div>
        </header>

        {/* Loading / error feedback */}
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

        {/* Default top 3 */}
        {status === 'done' && periods.length > 0 && (
          <SuggestionList periods={periods} title={`Top 3 ferieperioder i ${year}`} />
        )}

        {status === 'done' && periods.length === 0 && (
          <div className={styles.feedback}>
            <p className={styles.emptyMessage}>Ingen perioder fundet for dette land og år.</p>
          </div>
        )}

        {/* Filter panel — always visible once data is loaded */}
        {status === 'done' && (
          <FilterPanel
            year={year}
            isActive={filter !== null}
            onFilter={handleFilter}
            onClear={handleClearFilter}
          />
        )}

        {/* Filtered results */}
        {filter !== null && filteredPeriods.length > 0 && (
          <SuggestionList periods={filteredPeriods} title="Din søgning" />
        )}

        {filter !== null && filteredPeriods.length === 0 && (
          <div className={styles.feedback}>
            <p className={styles.emptyMessage}>
              Ingen perioder fundet i den valgte periode med {filter.budget} feriedag{filter.budget !== 1 ? 'e' : ''}.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}

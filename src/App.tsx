import { useEffect, useState } from 'react';
import type { Country, Day, Period, VacationFilter } from './types';
import { fetchCountries, fetchHolidays } from './data/holidays';
import { buildCalendar } from './lib/calendar';
import { findBestPeriods, findVacationPlan } from './lib/optimizer';
import CountrySelect from './components/CountrySelect';
import YearSelect from './components/YearSelect';
import FilterPanel from './components/FilterPanel';
import SuggestionList from './components/SuggestionList';
import styles from './App.module.css';

const CURRENT_YEAR = new Date().getFullYear();

type Status = 'idle' | 'loading' | 'done' | 'error';

function planSubtitle(plan: Period[], budget: number): string {
  const used = plan.reduce((s, p) => s + p.requiredVacationDays, 0);
  const free = plan.reduce((s, p) => s + p.totalDays, 0);
  const unused = budget - used;
  const trips = plan.length;
  const base = `${used} af ${budget} feriedage brugt — ${free} fri dage fordelt på ${trips} periode${trips !== 1 ? 'r' : ''}`;
  return unused > 0
    ? `${base} · ${unused} feriedag${unused !== 1 ? 'e' : ''} bruges bedst udenfor den valgte periode`
    : base;
}

export default function App() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [country, setCountry] = useState('DK');
  const [year, setYear] = useState(CURRENT_YEAR);

  const [calendar, setCalendar] = useState<Day[]>([]);
  const [periods, setPeriods] = useState<Period[]>([]);
  const [status, setStatus] = useState<Status>('idle');

  const [filter, setFilter] = useState<VacationFilter | null>(null);
  const [vacationPlan, setVacationPlan] = useState<Period[]>([]);
  const [filteredPeriods, setFilteredPeriods] = useState<Period[]>([]);

  useEffect(() => {
    fetchCountries().then(setCountries);
  }, []);

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

  useEffect(() => {
    if (calendar.length === 0 || !filter) {
      setVacationPlan([]);
      setFilteredPeriods([]);
      return;
    }
    setVacationPlan(findVacationPlan(calendar, filter));
    setFilteredPeriods(findBestPeriods(calendar, filter));
  }, [calendar, filter]);

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        <header className={styles.hero}>
          <h1 className={styles.title}>Gezel Holiday</h1>
          <p className={styles.subtitle}>Få mest muligt ud af dine feriedage</p>
          <div className={styles.controls}>
            <CountrySelect countries={countries} value={country} onChange={setCountry} />
            <YearSelect value={year} onChange={setYear} />
          </div>
        </header>

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

        {status === 'done' && periods.length > 0 && (
          <SuggestionList periods={periods} title={`Top 3 ferieperioder i ${year}`} />
        )}

        {status === 'done' && periods.length === 0 && (
          <div className={styles.feedback}>
            <p className={styles.emptyMessage}>Ingen perioder fundet for dette land og år.</p>
          </div>
        )}

        {status === 'done' && (
          <FilterPanel
            year={year}
            isActive={filter !== null}
            onFilter={setFilter}
            onClear={() => setFilter(null)}
          />
        )}

        {/* Primary: full vacation plan using the entire budget */}
        {filter !== null && vacationPlan.length > 0 && (
          <SuggestionList
            periods={vacationPlan}
            title="Din ferieplan"
            subtitle={planSubtitle(vacationPlan, filter.budget)}
          />
        )}

        {filter !== null && vacationPlan.length === 0 && (
          <div className={styles.feedback}>
            <p className={styles.emptyMessage}>
              Ingen gode perioder fundet i den valgte periode — prøv et bredere datointerval.
            </p>
          </div>
        )}

        {/* Secondary: top 3 single-period picks by ROI */}
        {filter !== null && filteredPeriods.length > 0 && (
          <SuggestionList
            periods={filteredPeriods}
            title="Bedste enkeltperioder"
            subtitle="De tre perioder med bedst ROI inden for din søgning."
          />
        )}

      </div>
    </div>
  );
}

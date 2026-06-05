import { useEffect, useState } from 'react';
import type { Country, Period } from './types';
import { fetchCountries, fetchHolidays } from './data/holidays';
import { buildCalendar } from './lib/calendar';
import { findBestPeriods } from './lib/optimizer';
import CountrySelect from './components/CountrySelect';
import YearSelect from './components/YearSelect';
import SuggestionList from './components/SuggestionList';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-12">

        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-indigo-900 tracking-tight mb-3">
            Gezel Holiday
          </h1>
          <p className="text-xl text-indigo-500 font-light">
            Få mest muligt ud af dine feriedage
          </p>
        </header>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 justify-center mb-12">
          <CountrySelect countries={countries} value={country} onChange={setCountry} />
          <YearSelect value={year} onChange={setYear} />
        </div>

        {/* Results */}
        {status === 'loading' && (
          <div className="flex flex-col items-center gap-4 py-20 text-indigo-400">
            <div className="w-10 h-10 border-4 border-current border-t-transparent rounded-full animate-spin" />
            <p className="text-sm">Beregner bedste ferieperioder…</p>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center py-20">
            <p className="text-red-500 font-medium">Kunne ikke hente helligdage — tjek din internetforbindelse og prøv igen.</p>
          </div>
        )}

        {status === 'done' && periods.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400">Ingen perioder fundet for dette land og år.</p>
          </div>
        )}

        {status === 'done' && periods.length > 0 && (
          <SuggestionList periods={periods} />
        )}

      </div>
    </div>
  );
}

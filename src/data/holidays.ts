import type { Country, Holiday } from '../types';

const BASE = 'https://date.nager.at/api/v3';

const FALLBACK_COUNTRIES: Country[] = [
  { countryCode: 'DK', name: 'Denmark' },
  { countryCode: 'NO', name: 'Norway' },
  { countryCode: 'SE', name: 'Sweden' },
  { countryCode: 'FI', name: 'Finland' },
  { countryCode: 'DE', name: 'Germany' },
  { countryCode: 'GB', name: 'United Kingdom' },
  { countryCode: 'US', name: 'United States' },
  { countryCode: 'FR', name: 'France' },
  { countryCode: 'NL', name: 'Netherlands' },
  { countryCode: 'ES', name: 'Spain' },
  { countryCode: 'IT', name: 'Italy' },
  { countryCode: 'PL', name: 'Poland' },
  { countryCode: 'AT', name: 'Austria' },
  { countryCode: 'CH', name: 'Switzerland' },
  { countryCode: 'BE', name: 'Belgium' },
];

export async function fetchCountries(): Promise<Country[]> {
  const res = await fetch(`${BASE}/AvailableCountries`);
  if (!res.ok) return FALLBACK_COUNTRIES;
  const data: Country[] = await res.json();
  return data.sort((a, b) => a.name.localeCompare(b.name));
}

export async function fetchHolidays(countryCode: string, year: number): Promise<Holiday[]> {
  const res = await fetch(`${BASE}/PublicHolidays/${year}/${countryCode}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

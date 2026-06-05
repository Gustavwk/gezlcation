import type { Country } from '../types';

type Props = {
  countries: Country[];
  value: string;
  onChange: (code: string) => void;
};

export default function CountrySelect({ countries, value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-indigo-700">Land</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-w-52 px-4 py-2.5 rounded-xl border-2 border-indigo-200 bg-white text-indigo-900 font-medium shadow-sm focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
      >
        {countries.length === 0 ? (
          <option value="DK">Denmark</option>
        ) : (
          countries.map((c) => (
            <option key={c.countryCode} value={c.countryCode}>
              {c.name}
            </option>
          ))
        )}
      </select>
    </div>
  );
}

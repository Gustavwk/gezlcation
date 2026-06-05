import type { Country } from '../types';
import styles from './CountrySelect.module.css';

type Props = {
  countries: Country[];
  value: string;
  onChange: (code: string) => void;
};

export default function CountrySelect({ countries, value, onChange }: Props) {
  return (
    <div className={styles.wrapper}>
      <label className={styles.label}>Land</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={styles.select}
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

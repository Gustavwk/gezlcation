import styles from './YearSelect.module.css';

type Props = {
  value: number;
  onChange: (year: number) => void;
};

const BASE_YEAR = new Date().getFullYear();
const YEARS = [BASE_YEAR - 1, BASE_YEAR, BASE_YEAR + 1, BASE_YEAR + 2];

export default function YearSelect({ value, onChange }: Props) {
  return (
    <div className={styles.wrapper}>
      <label className={styles.label}>År</label>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={styles.select}
      >
        {YEARS.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
}

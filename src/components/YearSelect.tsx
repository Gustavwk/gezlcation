import styles from './YearSelect.module.css';

type Props = {
  value: number;
  onChange: (year: number) => void;
  subtle?: boolean;
};

const BASE_YEAR = new Date().getFullYear();
const YEARS = [BASE_YEAR - 1, BASE_YEAR, BASE_YEAR + 1, BASE_YEAR + 2];

export default function YearSelect({ value, onChange, subtle = false }: Props) {
  return (
    <div className={subtle ? styles.wrapperSubtle : styles.wrapper}>
      {!subtle && <label className={styles.label}>År</label>}
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={subtle ? styles.selectSubtle : styles.select}
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

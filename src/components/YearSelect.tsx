type Props = {
  value: number;
  onChange: (year: number) => void;
};

const BASE_YEAR = new Date().getFullYear();
const YEARS = [BASE_YEAR - 1, BASE_YEAR, BASE_YEAR + 1, BASE_YEAR + 2];

export default function YearSelect({ value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-indigo-700">År</label>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="px-4 py-2.5 rounded-xl border-2 border-indigo-200 bg-white text-indigo-900 font-medium shadow-sm focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
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

import type { Period } from '../types';
import SuggestionCard from './SuggestionCard';

type Props = {
  periods: Period[];
};

export default function SuggestionList({ periods }: Props) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-indigo-800 mb-6">
        Top {periods.length} ferieperioder
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {periods.map((period, i) => (
          <SuggestionCard
            key={`${period.start}-${period.end}-${period.requiredVacationDays}`}
            period={period}
            rank={i + 1}
          />
        ))}
      </div>
    </section>
  );
}

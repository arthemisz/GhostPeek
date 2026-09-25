import { type ReactElement } from 'react';
import type { RepoSortOption } from '../types/github';
import { ArrowDownWideNarrow } from 'lucide-react';

interface SortSelectProps {
  value: RepoSortOption;
  onChange: (option: RepoSortOption) => void;
}

const SORT_LABELS: Record<RepoSortOption, string> = {
  stars: 'Most stars',
  forks: 'Most forks',
  updated: 'Recently updated',
  name: 'Name',
};

export function SortSelect({ value, onChange }: SortSelectProps): ReactElement {
  function handleChange(e: React.ChangeEvent<HTMLSelectElement>): void {
    onChange(e.target.value as RepoSortOption);
  }

  return (
    <div className="relative">
      <ArrowDownWideNarrow
        size={14}
        className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
        aria-hidden="true"
      />
      <select
        value={value}
        onChange={handleChange}
        aria-label="Sort repositories"
        className="appearance-none rounded-md border border-gray-300 bg-gray-50 py-1.5 pl-8 pr-6 text-xs text-gray-700 transition-colors focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500/40 dark:border-gray-700/40 dark:bg-gray-900/50 dark:text-gray-300"
      >
        {(Object.keys(SORT_LABELS) as RepoSortOption[]).map((key) => (
          <option key={key} value={key}>
            {SORT_LABELS[key]}
          </option>
        ))}
      </select>
    </div>
  );
}

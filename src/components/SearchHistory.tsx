import { type ReactElement } from 'react';
import { Clock, X } from 'lucide-react';

interface SearchHistoryProps {
  history: string[];
  onSelect: (query: string) => void;
  onClear: () => void;
}

export function SearchHistory({
  history,
  onSelect,
  onClear,
}: SearchHistoryProps): ReactElement | null {
  if (history.length === 0) return null;

  return (
    <div className="mt-6">
      <div className="mb-2.5 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Clock size={12} aria-hidden="true" />
          <span>Recent searches</span>
        </div>
        <button
          onClick={onClear}
          className="flex items-center gap-1 rounded px-1.5 py-0.5 text-xs text-gray-500 transition-colors hover:bg-gray-800 hover:text-gray-300"
          aria-label="Clear search history"
        >
          <X size={11} aria-hidden="true" />
          <span>Clear</span>
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {history.map((query) => (
          <button
            key={query}
            onClick={() => onSelect(query)}
            className="rounded-md border border-gray-700/50 bg-gray-800/60 px-3 py-1.5 text-sm text-gray-300 transition-colors hover:border-teal-500/40 hover:bg-gray-800 hover:text-teal-400"
          >
            {query}
          </button>
        ))}
      </div>
    </div>
  );
}

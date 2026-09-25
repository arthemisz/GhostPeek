import { type ReactElement } from 'react';

interface LanguageFilterProps {
  languages: string[];
  selected: string | null;
  onSelect: (lang: string | null) => void;
}

export function LanguageFilter({
  languages,
  selected,
  onSelect,
}: LanguageFilterProps): ReactElement {
  if (languages.length === 0) return <></>;

  return (
    <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by language">
      <button
        onClick={() => onSelect(null)}
        className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
          selected === null
            ? 'bg-teal-500/15 text-teal-600 border border-teal-500/30 dark:text-teal-400'
            : 'border border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:border-gray-700/40 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-300'
        }`}
      >
        All
      </button>
      {languages.map((lang) => (
        <button
          key={lang}
          onClick={() => onSelect(lang)}
          className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
            selected === lang
              ? 'bg-teal-500/15 text-teal-600 border border-teal-500/30 dark:text-teal-400'
              : 'border border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:border-gray-700/40 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-300'
          }`}
        >
          {lang}
        </button>
      ))}
    </div>
  );
}

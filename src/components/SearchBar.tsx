import { useState, type ReactElement } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  initialValue?: string;
  autoFocus?: boolean;
  size?: 'default' | 'large';
}

export function SearchBar({
  onSearch,
  initialValue = '',
  autoFocus = false,
  size = 'default',
}: SearchBarProps): ReactElement {
  const [query, setQuery] = useState<string>(initialValue);
  const [touched, setTouched] = useState<boolean>(false);

  const isEmpty = touched && query.trim() === '';

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    setTouched(true);
    const trimmed = query.trim();
    if (trimmed === '') return;
    onSearch(trimmed);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setQuery(e.target.value);
    if (touched) setTouched(false);
  }

  const isLarge = size === 'large';

  return (
    <form onSubmit={handleSubmit} className="w-full" role="search">
      <div className="relative">
        <Search
          size={isLarge ? 20 : 16}
          className={`absolute top-1/2 -translate-y-1/2 text-gray-500 ${isLarge ? 'left-4' : 'left-3'}`}
          aria-hidden="true"
        />
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Search GitHub users…"
          autoFocus={autoFocus}
          aria-label="Search GitHub users"
          aria-invalid={isEmpty}
          className={`w-full rounded-lg border bg-gray-900/50 text-gray-100 placeholder-gray-500 transition-colors focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500/40 ${
            isEmpty
              ? 'border-red-500/60'
              : 'border-gray-700/60'
          } ${
            isLarge
              ? 'py-3.5 pl-12 pr-4 text-lg'
              : 'py-2 pl-9 pr-3 text-sm'
          }`}
        />
      </div>
      {isEmpty && (
        <p className="mt-1.5 text-xs text-red-400" role="alert">
          Enter a username to search
        </p>
      )}
    </form>
  );
}

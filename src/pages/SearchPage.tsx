import { type ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchBar } from '../components/SearchBar';
import { SearchHistory } from '../components/SearchHistory';
import { useSearchHistory } from '../hooks/useSearchHistory';
import { Ghost } from 'lucide-react';

export function SearchPage(): ReactElement {
  const navigate = useNavigate();
  const { history, addSearch, clearHistory } = useSearchHistory();

  function handleSearch(query: string): void {
    addSearch(query);
    navigate(`/user/${encodeURIComponent(query)}`);
  }

  return (
    <main className="flex min-h-[calc(100vh-3.5rem)] items-start justify-center px-4 pt-[18vh]">
      <div className="w-full max-w-lg">
        <div className="mb-8 flex flex-col items-center">
          <Ghost size={40} className="mb-4 text-teal-400" aria-hidden="true" />
          <h1 className="mb-1 text-2xl font-semibold tracking-tight text-gray-100">
            GhostPeek
          </h1>
          <p className="text-sm text-gray-400">
            Explore GitHub profiles and repositories
          </p>
        </div>

        <SearchBar onSearch={handleSearch} autoFocus size="large" />

        <SearchHistory
          history={history}
          onSelect={handleSearch}
          onClear={clearHistory}
        />
      </div>
    </main>
  );
}

import { type ReactElement } from 'react';
import type { GitHubRepo, RepoSortOption } from '../types/github';
import { RepoCard } from './RepoCard';
import { LanguageFilter } from './LanguageFilter';
import { SortSelect } from './SortSelect';
import { Search, PackageOpen } from 'lucide-react';

interface RepoListProps {
  repos: GitHubRepo[];
  filteredRepos: GitHubRepo[];
  languages: string[];
  loading: boolean;
  username: string;
  sortOption: RepoSortOption;
  onSortChange: (option: RepoSortOption) => void;
  languageFilter: string | null;
  onLanguageChange: (lang: string | null) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function RepoList({
  repos,
  filteredRepos,
  languages,
  loading,
  username,
  sortOption,
  onSortChange,
  languageFilter,
  onLanguageChange,
  searchQuery,
  onSearchChange,
}: RepoListProps): ReactElement {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-28 animate-pulse rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-800/40 dark:bg-gray-900/30"
          />
        ))}
      </div>
    );
  }

  if (repos.length === 0) {
    return (
      <div className="flex flex-col items-center py-12 text-gray-400 dark:text-gray-500">
        <PackageOpen size={32} className="mb-3" aria-hidden="true" />
        <p className="text-sm">No public repositories</p>
      </div>
    );
  }

  function handleSearchInput(e: React.ChangeEvent<HTMLInputElement>): void {
    onSearchChange(e.target.value);
  }

  return (
    <section aria-label="Repositories">
      <div className="mb-4 space-y-3">
        {/* Search + Sort row */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search
              size={14}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
              aria-hidden="true"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchInput}
              placeholder="Find a repository…"
              aria-label="Filter repositories by name or description"
              className="w-full rounded-md border border-gray-300 bg-gray-50 py-1.5 pl-8 pr-3 text-xs text-gray-700 placeholder-gray-400 transition-colors focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500/40 dark:border-gray-700/40 dark:bg-gray-900/50 dark:text-gray-300 dark:placeholder-gray-600"
            />
          </div>
          <SortSelect value={sortOption} onChange={onSortChange} />
        </div>

        {/* Language filter */}
        <LanguageFilter
          languages={languages}
          selected={languageFilter}
          onSelect={onLanguageChange}
        />
      </div>

      {filteredRepos.length === 0 ? (
        <div className="flex flex-col items-center py-10 text-gray-400 dark:text-gray-500">
          <Search size={24} className="mb-2" aria-hidden="true" />
          <p className="text-sm">No repositories match your filters</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {filteredRepos.map((repo) => (
            <RepoCard key={repo.id} repo={repo} username={username} />
          ))}
        </div>
      )}

      <p className="mt-4 text-center text-xs text-gray-400 dark:text-gray-600">
        Showing {filteredRepos.length} of {repos.length} repositories
      </p>
    </section>
  );
}

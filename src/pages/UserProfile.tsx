import { useEffect, type ReactElement } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGitHubUser } from '../hooks/useGitHubUser';
import { useGitHubRepos } from '../hooks/useGitHubRepos';
import { useSearchHistory } from '../hooks/useSearchHistory';
import { UserCard } from '../components/UserCard';
import { RepoList } from '../components/RepoList';
import { SearchBar } from '../components/SearchBar';
import { NotFound } from './NotFound';
import { Loader2 } from 'lucide-react';

export function UserProfile(): ReactElement {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { addSearch } = useSearchHistory();

  const { user, loading: userLoading, error: userError, notFound, fetchUser } =
    useGitHubUser();

  const {
    repos,
    filteredRepos,
    languages,
    loading: reposLoading,
    sortOption,
    setSortOption,
    languageFilter,
    setLanguageFilter,
    searchQuery,
    setSearchQuery,
    fetchRepos,
  } = useGitHubRepos();

  useEffect(() => {
    if (username !== undefined) {
      fetchUser(username);
      fetchRepos(username);
    }
  }, [username, fetchUser, fetchRepos]);

  function handleSearch(query: string): void {
    addSearch(query);
    navigate(`/user/${encodeURIComponent(query)}`);
  }

  if (notFound) {
    return <NotFound username={username} />;
  }

  if (userLoading) {
    return (
      <main className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center">
        <Loader2
          size={28}
          className="animate-spin text-teal-400"
          aria-label="Loading profile"
        />
      </main>
    );
  }

  if (userError !== null) {
    return (
      <main className="flex min-h-[calc(100vh-3.5rem)] items-start justify-center px-4 pt-[20vh]">
        <div className="text-center">
          <p className="mb-2 text-sm text-red-400">{userError}</p>
          <button
            onClick={() => {
              if (username !== undefined) {
                fetchUser(username);
                fetchRepos(username);
              }
            }}
            className="text-sm text-teal-400 transition-colors hover:text-teal-300"
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  if (user === null) {
    return <></>;
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      {/* Inline search */}
      <div className="mb-8 max-w-md">
        <SearchBar onSearch={handleSearch} initialValue={username ?? ''} />
      </div>

      {/* Profile card */}
      <header className="mb-8 rounded-xl border border-gray-800/50 bg-gray-900/30 p-6">
        <UserCard user={user} />
      </header>

      {/* Repositories */}
      <RepoList
        repos={repos}
        filteredRepos={filteredRepos}
        languages={languages}
        loading={reposLoading}
        username={user.login}
        sortOption={sortOption}
        onSortChange={setSortOption}
        languageFilter={languageFilter}
        onLanguageChange={setLanguageFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
    </main>
  );
}

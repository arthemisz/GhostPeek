import { useState, useCallback, useMemo } from 'react';
import type { GitHubRepo, RepoSortOption } from '../types/github';
import { extractRateLimit } from './useGitHubUser';

interface UseGitHubReposResult {
  repos: GitHubRepo[];
  filteredRepos: GitHubRepo[];
  languages: string[];
  loading: boolean;
  error: string | null;
  sortOption: RepoSortOption;
  setSortOption: (option: RepoSortOption) => void;
  languageFilter: string | null;
  setLanguageFilter: (lang: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  fetchRepos: (username: string) => Promise<void>;
}

export function useGitHubRepos(): UseGitHubReposResult {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<RepoSortOption>('updated');
  const [languageFilter, setLanguageFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchRepos = useCallback(async (username: string): Promise<void> => {
    setLoading(true);
    setError(null);
    setRepos([]);

    try {
      const response = await fetch(
        `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`,
        {
          headers: { Accept: 'application/vnd.github.v3+json' },
        }
      );

      extractRateLimit(response);

      if (!response.ok) {
        throw new Error(`Failed to fetch repositories: ${response.status}`);
      }

      const data: GitHubRepo[] = await response.json();
      setRepos(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to fetch repositories');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const languages = useMemo<string[]>(() => {
    const langSet = new Set<string>();
    for (const repo of repos) {
      if (repo.language !== null) {
        langSet.add(repo.language);
      }
    }
    return Array.from(langSet).sort();
  }, [repos]);

  const filteredRepos = useMemo<GitHubRepo[]>(() => {
    let result = [...repos];

    // Language filter
    if (languageFilter !== null) {
      result = result.filter((repo) => repo.language === languageFilter);
    }

    // Search query filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (repo) =>
          repo.name.toLowerCase().includes(query) ||
          (repo.description !== null &&
            repo.description.toLowerCase().includes(query))
      );
    }

    // Sort
    result.sort((a, b) => {
      switch (sortOption) {
        case 'stars':
          return b.stargazers_count - a.stargazers_count;
        case 'forks':
          return b.forks_count - a.forks_count;
        case 'updated':
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return result;
  }, [repos, languageFilter, searchQuery, sortOption]);

  return {
    repos,
    filteredRepos,
    languages,
    loading,
    error,
    sortOption,
    setSortOption,
    languageFilter,
    setLanguageFilter,
    searchQuery,
    setSearchQuery,
    fetchRepos,
  };
}

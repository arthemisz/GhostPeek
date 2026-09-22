import { useState, useCallback } from 'react';
import type { GitHubUser, RateLimitState } from '../types/github';

interface UseGitHubUserResult {
  user: GitHubUser | null;
  loading: boolean;
  error: string | null;
  notFound: boolean;
  fetchUser: (username: string) => Promise<void>;
}

let sharedRateLimitUpdate: ((state: RateLimitState) => void) | null = null;

export function setRateLimitCallback(cb: (state: RateLimitState) => void): void {
  sharedRateLimitUpdate = cb;
}

function extractRateLimit(response: Response): void {
  const limit = response.headers.get('X-RateLimit-Limit');
  const remaining = response.headers.get('X-RateLimit-Remaining');
  const reset = response.headers.get('X-RateLimit-Reset');

  if (limit && remaining && reset && sharedRateLimitUpdate) {
    sharedRateLimitUpdate({
      limit: parseInt(limit, 10),
      remaining: parseInt(remaining, 10),
      reset: parseInt(reset, 10),
    });
  }
}

export function useGitHubUser(): UseGitHubUserResult {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState<boolean>(false);

  const fetchUser = useCallback(async (username: string): Promise<void> => {
    setLoading(true);
    setError(null);
    setNotFound(false);
    setUser(null);

    try {
      const response = await fetch(
        `https://api.github.com/users/${encodeURIComponent(username)}`,
        {
          headers: { Accept: 'application/vnd.github.v3+json' },
        }
      );

      extractRateLimit(response);

      if (response.status === 404) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const data: GitHubUser = await response.json();
      setUser(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return { user, loading, error, notFound, fetchUser };
}

export { extractRateLimit };

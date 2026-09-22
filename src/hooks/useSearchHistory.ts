import { useState, useCallback } from 'react';

const STORAGE_KEY = 'ghostpeek-search-history';
const MAX_HISTORY = 6;

interface UseSearchHistoryResult {
  history: string[];
  addSearch: (query: string) => void;
  clearHistory: () => void;
}

function readFromStorage(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === null) return [];
    const parsed: unknown = JSON.parse(stored);
    if (Array.isArray(parsed) && parsed.every((item): item is string => typeof item === 'string')) {
      return parsed.slice(0, MAX_HISTORY);
    }
    return [];
  } catch {
    return [];
  }
}

function writeToStorage(history: string[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function useSearchHistory(): UseSearchHistoryResult {
  const [history, setHistory] = useState<string[]>(() => readFromStorage());

  const addSearch = useCallback((query: string): void => {
    const trimmed = query.trim().toLowerCase();
    if (trimmed === '') return;

    setHistory((prev) => {
      const filtered = prev.filter((item) => item !== trimmed);
      const next = [trimmed, ...filtered].slice(0, MAX_HISTORY);
      writeToStorage(next);
      return next;
    });
  }, []);

  const clearHistory = useCallback((): void => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { history, addSearch, clearHistory };
}

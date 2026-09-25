import { useState, type ReactElement } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { SearchPage } from './pages/SearchPage';
import { UserProfile } from './pages/UserProfile';
import { RepoDetail } from './pages/RepoDetail';
import { NotFound } from './pages/NotFound';
import type { RateLimitState } from './types/github';
import { setRateLimitCallback } from './hooks/useGitHubUser';
import { ThemeContext, useThemeProvider } from './hooks/useTheme';

export default function App(): ReactElement {
  const [rateLimit, setRateLimit] = useState<RateLimitState>({
    limit: 60,
    remaining: 60,
    reset: 0,
  });

  // Wire up the global rate limit callback
  setRateLimitCallback(setRateLimit);

  const themeValue = useThemeProvider();

  return (
    <ThemeContext.Provider value={themeValue}>
      <BrowserRouter>
        <div className="min-h-screen bg-white text-gray-900 dark:bg-black dark:text-gray-100 transition-colors">
          <Navbar rateLimit={rateLimit} />
          <Routes>
            <Route path="/" element={<SearchPage />} />
            <Route path="/user/:username" element={<UserProfile />} />
            <Route path="/user/:username/repo/:repo" element={<RepoDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ThemeContext.Provider>
  );
}

import { useState, type ReactElement } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { SearchPage } from './pages/SearchPage';
import { UserProfile } from './pages/UserProfile';
import { RepoDetail } from './pages/RepoDetail';
import { NotFound } from './pages/NotFound';
import type { RateLimitState } from './types/github';
import { setRateLimitCallback } from './hooks/useGitHubUser';

export default function App(): ReactElement {
  const [rateLimit, setRateLimit] = useState<RateLimitState>({
    limit: 60,
    remaining: 60,
    reset: 0,
  });

  // Wire up the global rate limit callback
  setRateLimitCallback(setRateLimit);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0d1117] text-gray-100">
        <Navbar rateLimit={rateLimit} />
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/user/:username" element={<UserProfile />} />
          <Route path="/user/:username/repo/:repo" element={<RepoDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

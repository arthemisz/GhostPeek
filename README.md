# Github GhostPeek

A type-safe GitHub profile and repository explorer built with **React**, **TypeScript**, and **Vite**. 

This project demonstrates strict end-to-end TypeScript architecture across every layer of a modern client-side application: strongly typed REST API responses, custom hooks, component props, DOM event handlers, and persistent browser storage.

---

## 🚀 Features

- **Profile Search:** Search any GitHub handle with instant feedback, skeleton loaders, and dedicated 404/not-found handling.
- **Rich Profile Overview:** Displays avatar, bio, location, company, followers, following count, public repo count, and formatted join date.
- **Repository Browser:**
  - View key metrics: primary language badge, star count, forks, and last-updated timestamps.
  - **Sort:** Dynamically order repositories by stars, forks, recent updates, or alphabetical order.
  - **Filter:** Isolate repositories using an auto-generated list of languages extracted from search results.
- **Repository Deep-Dive:** Dedicated route (`/user/:username/repo/:repoName`) that fetches and renders raw repository README files via GitHub's raw markdown endpoint.
- **Search History:** Persists recent successful lookups in `localStorage` for one-click re-querying.
- **API Rate-Limit Tracker:** Reads response headers (`x-ratelimit-remaining`, `x-ratelimit-limit`) to show remaining unauthenticated requests (standard 60/hr quota).

---

## 🛠 Tech Stack & Architecture

- **Core:** [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/)
- **Routing:** [React Router](https://reactrouter.com/) (strictly typed route params)
- **Linting & Code Quality:** [Oxlint](https://oxc.rs/) with type-aware analysis
- **Data Source:** [GitHub REST API v3](https://docs.github.com/en/rest) (Public endpoints, no API key required)

### TypeScript Principles Enforced
- **Zero `any` Policy:** Standard `strict: true` compiler configuration; no fallback to `any` or loose type assertions.
- **API Contracts:** Complete payload shapes defined for GitHub `User`, `Repository`, and `RateLimit` entities.
- **Hook State:** Explicit generic bounds on all `useState`, `useCallback`, and custom hook return tuples.
- **Event Typing:** Strict handling of `React.FormEvent<HTMLFormElement>` and `React.ChangeEvent<HTMLInputElement | HTMLSelectElement>`.

---

## 📁 Project Structure

```text
src/
├── components/
│   ├── LanguageFilter.tsx   # Dynamic language extraction and filter chips
│   ├── RateLimitBadge.tsx   # Displays remaining GitHub API quota
│   ├── RepoCard.tsx         # Single repository presentation card
│   ├── RepoList.tsx         # Grid wrapper with sorting/filtering pipeline
│   ├── SearchBar.tsx        # Typed input and submission handler
│   ├── SearchHistory.tsx    # Recent searches list populated from localStorage
│   ├── SortSelect.tsx       # Repo sorting controller dropdown
│   └── UserCard.tsx         # User metadata, metrics, and profile badge
├── hooks/
│   ├── useGitHubRepos.ts    # Fetch logic, sort/filter reducers, repo cache
│   ├── useGitHubUser.ts     # Profile query hook with loading and error boundaries
│   └── useSearchHistory.ts  # Typed localStorage synchronization hook
├── pages/
│   ├── NotFound.tsx         # 404 state for missing users or invalid routes
│   ├── RepoDetail.tsx       # Markdown README viewer for individual repos
│   ├── SearchPage.tsx       # Landing search interface and recent queries
│   └── UserProfile.tsx      # Main layout aggregating user profile and repo lists
├── types/
│   └── github.ts            # Canonical domain models and API interface declarations
├── App.tsx                  # Route definitions and application shell
└── main.tsx                 # Root entrypoint

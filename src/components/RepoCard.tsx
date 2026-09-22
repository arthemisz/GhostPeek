import { type ReactElement } from 'react';
import { Link } from 'react-router-dom';
import type { GitHubRepo } from '../types/github';
import { Star, GitFork, Circle, Clock } from 'lucide-react';

interface RepoCardProps {
  repo: GitHubRepo;
  username: string;
}

const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572a5',
  Java: '#b07219',
  Go: '#00add8',
  Rust: '#dea584',
  Ruby: '#701516',
  PHP: '#4f5d95',
  'C++': '#f34b7d',
  C: '#555555',
  'C#': '#178600',
  Swift: '#f05138',
  Kotlin: '#a97bff',
  Dart: '#00b4ab',
  Shell: '#89e051',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Vue: '#41b883',
  Svelte: '#ff3e00',
  Lua: '#000080',
  Scala: '#c22d40',
  Elixir: '#6e4a7e',
  Haskell: '#5e5086',
  Zig: '#ec915c',
};

function getLanguageColor(language: string): string {
  return LANGUAGE_COLORS[language] ?? '#8b949e';
}

function formatRelativeDate(isoDate: string): string {
  const now = Date.now();
  const then = new Date(isoDate).getTime();
  const diffMs = now - then;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'today';
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 30) return `${diffDays}d ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
  return `${Math.floor(diffDays / 365)}y ago`;
}

export function RepoCard({ repo, username }: RepoCardProps): ReactElement {
  return (
    <article className="group rounded-lg border border-gray-800/60 bg-gray-900/40 p-4 transition-colors hover:border-gray-700/80 hover:bg-gray-900/60">
      <div className="mb-2 flex items-start justify-between gap-2">
        <Link
          to={`/user/${username}/repo/${repo.name}`}
          className="text-sm font-medium text-teal-400 transition-colors group-hover:text-teal-300"
        >
          {repo.name}
        </Link>

        {repo.fork && (
          <span className="shrink-0 rounded border border-gray-700/40 px-1.5 py-0.5 text-[10px] text-gray-500">
            fork
          </span>
        )}
      </div>

      {repo.description !== null && (
        <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-gray-400">
          {repo.description}
        </p>
      )}

      {repo.topics !== undefined && repo.topics.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1.5">
          {repo.topics.slice(0, 5).map((topic) => (
            <span
              key={topic}
              className="rounded-full bg-teal-500/10 px-2 py-0.5 text-[10px] text-teal-400"
            >
              {topic}
            </span>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
        {repo.language !== null && (
          <span className="flex items-center gap-1">
            <Circle
              size={8}
              fill={getLanguageColor(repo.language)}
              stroke="none"
              aria-hidden="true"
            />
            {repo.language}
          </span>
        )}

        {repo.stargazers_count > 0 && (
          <span className="flex items-center gap-1">
            <Star size={12} aria-hidden="true" />
            {repo.stargazers_count.toLocaleString()}
          </span>
        )}

        {repo.forks_count > 0 && (
          <span className="flex items-center gap-1">
            <GitFork size={12} aria-hidden="true" />
            {repo.forks_count.toLocaleString()}
          </span>
        )}

        <span className="flex items-center gap-1 ml-auto">
          <Clock size={11} aria-hidden="true" />
          {formatRelativeDate(repo.updated_at)}
        </span>
      </div>
    </article>
  );
}

import { useState, useEffect, type ReactElement } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { extractRateLimit } from '../hooks/useGitHubUser';
import {
  ArrowLeft,
  ExternalLink,
  Star,
  GitFork,
  Eye,
  Loader2,
  FileWarning,
} from 'lucide-react';

interface RepoMeta {
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  language: string | null;
}

export function RepoDetail(): ReactElement {
  const { username, repo } = useParams<{ username: string; repo: string }>();
  const [readme, setReadme] = useState<string | null>(null);
  const [repoMeta, setRepoMeta] = useState<RepoMeta | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (username === undefined || repo === undefined) return;

    let cancelled = false;

    async function fetchData(): Promise<void> {
      setLoading(true);
      setError(null);

      try {
        // Fetch repo metadata and readme in parallel
        const [metaRes, readmeRes] = await Promise.all([
          fetch(
            `https://api.github.com/repos/${encodeURIComponent(username!)}/${encodeURIComponent(repo!)}`,
            { headers: { Accept: 'application/vnd.github.v3+json' } }
          ),
          fetch(
            `https://api.github.com/repos/${encodeURIComponent(username!)}/${encodeURIComponent(repo!)}/readme`,
            { headers: { Accept: 'application/vnd.github.v3+json' } }
          ),
        ]);

        extractRateLimit(metaRes);
        extractRateLimit(readmeRes);

        if (!cancelled) {
          if (metaRes.ok) {
            const meta: RepoMeta = await metaRes.json();
            setRepoMeta(meta);
          }

          if (readmeRes.ok) {
            const readmeData: { content: string; encoding: string } =
              await readmeRes.json();
            if (readmeData.encoding === 'base64') {
              const decoded = atob(readmeData.content.replace(/\n/g, ''));
              setReadme(decoded);
            } else {
              setReadme(readmeData.content);
            }
          } else if (readmeRes.status === 404) {
            setReadme(null);
          } else {
            throw new Error(`Failed to fetch readme: ${readmeRes.status}`);
          }
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load repository');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void fetchData();

    return () => {
      cancelled = true;
    };
  }, [username, repo]);

  if (loading) {
    return (
      <main className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center">
        <Loader2
          size={28}
          className="animate-spin text-teal-400"
          aria-label="Loading repository"
        />
      </main>
    );
  }

  if (error !== null) {
    return (
      <main className="flex min-h-[calc(100vh-3.5rem)] items-start justify-center px-4 pt-[20vh]">
        <p className="text-sm text-red-400">{error}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-6">
      {/* Navigation */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          to={`/user/${username ?? ''}`}
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 transition-colors hover:text-teal-400"
        >
          <ArrowLeft size={14} aria-hidden="true" />
          Back to profile
        </Link>

        {repoMeta !== null && (
          <a
            href={repoMeta.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md border border-gray-700/60 bg-gray-800/60 px-3 py-1.5 text-xs font-medium text-gray-300 transition-colors hover:border-teal-500/40 hover:text-teal-400"
          >
            Open on GitHub
            <ExternalLink size={12} aria-hidden="true" />
          </a>
        )}
      </div>

      {/* Repo header */}
      {repoMeta !== null && (
        <header className="mb-6 rounded-lg border border-gray-800/50 bg-gray-900/30 p-5">
          <h1 className="mb-1 text-lg font-semibold text-gray-100">
            <span className="text-gray-500">{username}/</span>
            {repoMeta.name}
          </h1>
          {repoMeta.description !== null && (
            <p className="mb-3 text-sm text-gray-400">{repoMeta.description}</p>
          )}
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Star size={13} aria-hidden="true" />
              {repoMeta.stargazers_count.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <GitFork size={13} aria-hidden="true" />
              {repoMeta.forks_count.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <Eye size={13} aria-hidden="true" />
              {repoMeta.watchers_count.toLocaleString()}
            </span>
            {repoMeta.language !== null && (
              <span className="text-gray-400">{repoMeta.language}</span>
            )}
          </div>
        </header>
      )}

      {/* README */}
      {readme !== null ? (
        <article className="prose-gh rounded-lg border border-gray-800/50 bg-gray-900/30 p-6">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
            {readme}
          </ReactMarkdown>
        </article>
      ) : (
        <div className="flex flex-col items-center py-12 text-gray-500">
          <FileWarning size={28} className="mb-3" aria-hidden="true" />
          <p className="text-sm">This repository doesn't have a README</p>
        </div>
      )}
    </main>
  );
}

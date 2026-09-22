import { type ReactElement } from 'react';
import type { GitHubUser } from '../types/github';
import {
  MapPin,
  Building2,
  Link as LinkIcon,
  Calendar,
  Users,
  ExternalLink,
} from 'lucide-react';

interface UserCardProps {
  user: GitHubUser;
}

function formatJoinDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
}

export function UserCard({ user }: UserCardProps): ReactElement {
  return (
    <article className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
      <img
        src={user.avatar_url}
        alt={`${user.login}'s avatar`}
        className="h-28 w-28 shrink-0 rounded-full border-2 border-gray-700/50 sm:h-36 sm:w-36"
        loading="eager"
      />

      <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
        <div className="mb-1">
          {user.name !== null ? (
            <>
              <h1 className="text-xl font-semibold text-gray-100">{user.name}</h1>
              <p className="text-sm text-gray-400">@{user.login}</p>
            </>
          ) : (
            <h1 className="text-xl font-semibold text-gray-100">@{user.login}</h1>
          )}
        </div>

        {user.bio !== null && (
          <p className="mb-3 max-w-md text-sm leading-relaxed text-gray-300">
            {user.bio}
          </p>
        )}

        <div className="mb-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs text-gray-400 sm:justify-start">
          {user.company !== null && (
            <span className="flex items-center gap-1">
              <Building2 size={13} aria-hidden="true" />
              {user.company}
            </span>
          )}
          {user.location !== null && (
            <span className="flex items-center gap-1">
              <MapPin size={13} aria-hidden="true" />
              {user.location}
            </span>
          )}
          {user.blog !== null && user.blog !== '' && (
            <a
              href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-teal-400 transition-colors hover:text-teal-300"
            >
              <LinkIcon size={13} aria-hidden="true" />
              {user.blog.replace(/^https?:\/\//, '')}
            </a>
          )}
          <span className="flex items-center gap-1">
            <Calendar size={13} aria-hidden="true" />
            Joined {formatJoinDate(user.created_at)}
          </span>
        </div>

        <div className="mb-4 flex items-center gap-4 text-sm">
          <span className="text-gray-300">
            <Users size={13} className="mr-1 inline" aria-hidden="true" />
            <strong className="font-medium text-gray-100">{user.followers.toLocaleString()}</strong>{' '}
            followers
          </span>
          <span className="text-gray-300">
            <strong className="font-medium text-gray-100">{user.following.toLocaleString()}</strong>{' '}
            following
          </span>
          <span className="text-gray-300">
            <strong className="font-medium text-gray-100">{user.public_repos}</strong>{' '}
            repos
          </span>
        </div>

        <a
          href={user.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-md border border-gray-700/60 bg-gray-800/60 px-3 py-1.5 text-xs font-medium text-gray-300 transition-colors hover:border-teal-500/40 hover:text-teal-400"
        >
          View on GitHub
          <ExternalLink size={12} aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}

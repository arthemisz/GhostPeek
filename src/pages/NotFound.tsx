import { type ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { Ghost, SearchX } from 'lucide-react';

interface NotFoundProps {
  message?: string;
  username?: string;
}

export function NotFound({ message, username }: NotFoundProps): ReactElement {
  const displayMessage =
    message ??
    (username !== undefined
      ? `No GitHub user found with the handle "${username}"`
      : "The page you're looking for doesn't exist");

  return (
    <main className="flex min-h-[calc(100vh-3.5rem)] items-start justify-center px-4 pt-[20vh]">
      <div className="flex flex-col items-center text-center">
        <SearchX size={40} className="mb-4 text-gray-600" aria-hidden="true" />
        <h1 className="mb-2 text-lg font-medium text-gray-200">Not found</h1>
        <p className="mb-6 max-w-sm text-sm text-gray-400">{displayMessage}</p>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 rounded-md border border-gray-700/60 bg-gray-800/60 px-4 py-2 text-sm text-gray-300 transition-colors hover:border-teal-500/40 hover:text-teal-400"
        >
          <Ghost size={14} aria-hidden="true" />
          Back to search
        </Link>
      </div>
    </main>
  );
}

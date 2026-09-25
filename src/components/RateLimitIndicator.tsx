import { type ReactElement } from 'react';
import type { RateLimitState } from '../types/github';
import { Activity } from 'lucide-react';

interface RateLimitIndicatorProps {
  rateLimit: RateLimitState;
}

export function RateLimitIndicator({ rateLimit }: RateLimitIndicatorProps): ReactElement {
  const { remaining, limit } = rateLimit;

  let colorClass: string;
  if (remaining <= 5) {
    colorClass = 'bg-red-500/20 text-red-500 border-red-500/30 dark:text-red-400';
  } else if (remaining <= 15) {
    colorClass = 'bg-amber-500/20 text-amber-600 border-amber-500/30 dark:text-amber-400';
  } else {
    colorClass = 'bg-teal-500/10 text-teal-600 border-teal-500/20 dark:bg-teal-500/15 dark:text-teal-400';
  }

  return (
    <div
      className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium tabular-nums ${colorClass}`}
      aria-label={`API quota: ${remaining} of ${limit} requests remaining`}
    >
      <Activity size={12} aria-hidden="true" />
      <span>{remaining}/{limit}</span>
    </div>
  );
}

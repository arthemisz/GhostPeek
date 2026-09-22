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
    colorClass = 'bg-red-500/20 text-red-400 border-red-500/30';
  } else if (remaining <= 15) {
    colorClass = 'bg-amber-500/20 text-amber-400 border-amber-500/30';
  } else {
    colorClass = 'bg-teal-500/15 text-teal-400 border-teal-500/20';
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

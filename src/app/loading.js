import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
      <Loader2 className="w-9 h-9 animate-spin text-indigo-600 dark:text-indigo-400" />
      <p className="text-xs font-semibold tracking-wider uppercase text-neutral-400 dark:text-neutral-500">
        Loading StudioSpace...
      </p>
    </div>
  );
}
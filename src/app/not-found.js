import Link from 'next/link';
import { Sparkles, Compass, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-3xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40 shadow-inner">
          <Sparkles className="w-8 h-8" />
        </div>

        <span className="text-xs font-black tracking-widest uppercase text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-3 py-1 rounded-full border border-indigo-200/60 dark:border-indigo-800/60">
          Error 404
        </span>

        <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-neutral-50 tracking-tight mt-4">
          Studio Space Not Found
        </h1>

        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2 leading-relaxed">
          The stage, booth, or workspace you are trying to visit does not exist or has been relocated by the host.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-600/20 transition"
          >
            <Home className="w-4 h-4" /> Return Home
          </Link>

          <Link
            href="/studios"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 text-sm font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
          >
            <Compass className="w-4 h-4" /> Browse Studios
          </Link>
        </div>
      </div>
    </div>
  );
}
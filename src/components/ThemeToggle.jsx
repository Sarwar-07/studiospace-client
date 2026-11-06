'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-[108px] h-7" aria-hidden="true" />;
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <div className="flex items-center gap-2.5 select-none">
      {/* Flanking Sun Icon */}
      <Sun
        className={`w-4 h-4 transition-colors duration-200 ${
          isDark ? 'text-zinc-500' : 'text-zinc-600'
        }`}
        aria-hidden="true"
      />

      {/* Neumorphic Recessed Track */}
      <button
        type="button"
        role="switch"
        aria-checked={isDark}
        aria-label="Toggle dark mode"
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        className={`w-14 h-7 p-1 rounded-full relative cursor-pointer transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
          isDark
            ? 'bg-zinc-800 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] border border-zinc-700/60'
            : 'bg-zinc-200/90 shadow-[inset_0_2px_4px_rgba(0,0,0,0.18),inset_0_-1px_1px_rgba(255,255,255,0.8)] border border-zinc-300/60'
        }`}
      >
        {/* Raised Sliding Thumb / Knob */}
        <span
          className={`block w-5 h-5 rounded-full transition-transform duration-300 ease-out ${
            isDark
              ? 'bg-zinc-400 dark:bg-zinc-300 shadow-[0_2px_5px_rgba(0,0,0,0.5)] translate-x-7'
              : 'bg-white shadow-[0_2px_5px_rgba(0,0,0,0.22)] translate-x-0'
          }`}
        />
      </button>

      {/* Flanking Moon Icon */}
      <Moon
        className={`w-4 h-4 transition-colors duration-200 ${
          isDark ? 'text-zinc-300' : 'text-zinc-400'
        }`}
        aria-hidden="true"
      />
    </div>
  );
}

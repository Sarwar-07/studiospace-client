'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Camera, Music, Video, Palette } from 'lucide-react';

export default function Footer() {
  const [year, setYear] = useState(2026);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);
  return (
    <footer className="mt-auto border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-3 font-bold text-lg text-neutral-900 dark:text-neutral-50 hover:opacity-90 transition-opacity">
              <Image
                src="/studio-space-logo.png"
                alt="StudioSpace Logo"
                width={36}
                height={36}
                className="w-9 h-9 object-contain rounded-md"
              />
              <span className="font-bold text-lg">Studio<span className="text-indigo-600 dark:text-indigo-400">Space</span></span>
            </Link>
            <p className="text-sm">
              The premier marketplace connecting photographers, podcasters, sound engineers, and visual artists with rentable creative studios.
            </p>
          </div>

          {/* Studio Disciplines */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-neutral-900 dark:text-neutral-100 mb-4">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><Camera className="w-4 h-4 text-indigo-500" /> Photo Studios</li>
              <li className="flex items-center gap-2"><Music className="w-4 h-4 text-violet-500" /> Recording Booths</li>
              <li className="flex items-center gap-2"><Video className="w-4 h-4 text-emerald-500" /> Film Sets & Cycloramas</li>
              <li className="flex items-center gap-2"><Palette className="w-4 h-4 text-amber-500" /> Art & Dance Lofts</li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-neutral-900 dark:text-neutral-100 mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/studios" className="hover:text-indigo-600 dark:hover:text-indigo-400">Browse Spaces</Link></li>
              <li><Link href="/studios/add" className="hover:text-indigo-600 dark:hover:text-indigo-400">Host a Studio</Link></li>
              <li><Link href="/dashboard" className="hover:text-indigo-600 dark:hover:text-indigo-400">Creator Hub</Link></li>
              <li><Link href="/terms" className="hover:text-indigo-600 dark:hover:text-indigo-400">Safety & Trust</Link></li>
            </ul>
          </div>

          {/* Security & Reliability */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-neutral-900 dark:text-neutral-100 mb-4">Guaranteed Trust</h4>
            <p className="text-sm">
              Every booking is protected by automated slot conflict locking, verified host identities, and encrypted session management.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-neutral-200 dark:border-neutral-800 text-center text-xs text-neutral-500">
          © {year} StudioSpace Marketplace Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Building2,
  CalendarCheck,
  Bookmark,
  DollarSign,
  PlusCircle,
  Compass,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Loader2,
  UserCheck
} from 'lucide-react';
import { toast } from 'sonner';

export default function DashboardOverviewPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [stats, setStats] = useState({
    totalListings: 0,
    totalBookings: 0,
    totalWishlist: 0,
    totalSpent: 0
  });
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/dashboard/stats`, {
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Failed to load dashboard metrics');
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error(err);
      toast.error('Could not load analytics metrics');
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?from=/dashboard');
      return;
    }
    if (user) {
      fetchStats();
    }
  }, [user, authLoading, router, fetchStats]);

  if (authLoading || loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400" />
        <p className="text-sm text-neutral-500">Calculating your studio analytics...</p>
      </div>
    );
  }

  const statCards = [
    {
      label: 'My Listed Spaces',
      value: stats.totalListings,
      description: 'Active workspaces open for reservations',
      icon: Building2,
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-50 dark:bg-indigo-950/40',
      border: 'border-indigo-100 dark:border-indigo-900/40',
      href: '/dashboard/my-listings'
    },
    {
      label: 'Total Reservations',
      value: stats.totalBookings,
      description: 'Booked studio production sessions',
      icon: CalendarCheck,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      border: 'border-emerald-100 dark:border-emerald-900/40',
      href: '/dashboard/my-bookings'
    },
    {
      label: 'Saved to Wishlist',
      value: stats.totalWishlist,
      description: 'Bookmarked workspaces for upcoming projects',
      icon: Bookmark,
      color: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-50 dark:bg-rose-950/40',
      border: 'border-rose-100 dark:border-rose-900/40',
      href: '/dashboard/wishlist'
    },
    {
      label: 'Total Production Spend',
      value: `$${Number(stats.totalSpent || 0).toLocaleString()}`,
      description: 'Total invested in studio rental hours',
      icon: DollarSign,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      border: 'border-amber-100 dark:border-amber-900/40',
      href: '/dashboard/my-bookings'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-900 text-white p-8 sm:p-10 shadow-xl mb-10">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold mb-4 text-indigo-200">
            <Sparkles className="w-3.5 h-3.5" />
            Verified Creator Account
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Welcome, {user?.displayName || 'Creator'}
          </h1>
          <p className="text-sm sm:text-base text-indigo-100/90 mt-2 leading-relaxed">
            Here is your live production overview across listed spaces, upcoming bookings, and saved studio favorites.
          </p>

          <div className="flex flex-wrap gap-3 mt-6">
            <Link
              href="/studios/add"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-indigo-900 font-bold text-xs sm:text-sm hover:bg-neutral-100 transition shadow"
            >
              <PlusCircle className="w-4 h-4" /> Add New Space
            </Link>
            <Link
              href="/studios"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-700/60 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm border border-indigo-400/30 transition backdrop-blur-md"
            >
              <Compass className="w-4 h-4" /> Explore Studios
            </Link>
          </div>
        </div>

        {/* Decorative background shapes */}
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-64 h-64 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Analytics Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link
              key={idx}
              href={card.href}
              className={`group p-6 rounded-3xl bg-white dark:bg-neutral-900 border ${card.border} shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${card.bg} ${card.color} transition-transform group-hover:scale-110`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition group-hover:translate-x-1" />
                </div>
                <h3 className="text-3xl font-black text-neutral-900 dark:text-neutral-50 tracking-tight">
                  {card.value}
                </h3>
                <p className="text-sm font-bold text-neutral-700 dark:text-neutral-300 mt-1">
                  {card.label}
                </p>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                {card.description}
              </p>
            </Link>
          );
        })}
      </div>

      {/* Quick Access Control Grid */}
      <div>
        <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          Workspace Management Hub
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/dashboard/my-listings"
            className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-indigo-500 hover:shadow-md transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
              Manage Host Listings
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5 leading-relaxed">
              Review active studio listings, adjust hourly pricing, modify amenity lists, or delete spaces.
            </p>
          </Link>

          <Link
            href="/dashboard/my-bookings"
            className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-indigo-500 hover:shadow-md transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
              View Bookings & Receipts
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5 leading-relaxed">
              Inspect confirmed schedules, download official PDF booking receipts, and track pending approval status.
            </p>
          </Link>

          <Link
            href="/dashboard/wishlist"
            className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-indigo-500 hover:shadow-md transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4">
              <Bookmark className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition">
              Bookmarked Wishlist
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5 leading-relaxed">
              Quickly jump into reserved spaces bookmarked for future video shoots, podcasts, or recording sessions.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  Bookmark,
  Trash2,
  MapPin,
  Star,
  Users,
  Loader2,
  ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';

export default function WishlistPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const fetchWishlist = useCallback(async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('access-token') : null;
      const res = await fetch(`${API_URL}/api/wishlist`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Failed to retrieve wishlist');
      const data = await res.json();
      setWishlist(data);
    } catch (err) {
      console.error(err);
      toast.error('Could not load your saved studios');
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error('Please sign in to view your saved wishlist');
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/dashboard/wishlist';
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }
    if (user) {
      fetchWishlist();
    }
  }, [user, authLoading, router, fetchWishlist]);

  const handleRemove = async (studioId, studioTitle) => {
    setRemovingId(studioId);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('access-token') : null;
      const res = await fetch(`${API_URL}/api/wishlist/${studioId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include'
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to remove from wishlist');
      }

      setWishlist((prev) => prev.filter((item) => (item.studioId !== studioId && item.studio?._id !== studioId)));
      toast.success(`Removed "${studioTitle || 'Studio'}" from wishlist`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setRemovingId(null);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400" />
        <p className="text-sm text-neutral-500">Retrieving your saved spaces...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
            Saved Workspaces
          </span>
          <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-neutral-50 tracking-tight mt-1">
            My Wishlist
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Curated list of production lofts, booths, and stages saved for upcoming sessions
          </p>
        </div>

        <Link
          href="/studios"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 transition self-start sm:self-auto"
        >
          Discover More Studios
        </Link>
      </div>

      {/* Wishlist Grid */}
      {wishlist.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item) => {
            const studio = item.studio;
            if (!studio) return null;

            const studioId = studio._id || item.studioId;
            const displayImg = studio.images?.[0] || studio.image || 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80';

            return (
              <div
                key={item._id}
                className="group rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                {/* Image */}
                <Link href={`/studios/${studioId}`} className="block relative aspect-[16/10] overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                  <img
                    src={displayImg}
                    alt={studio.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md text-xs font-semibold px-3 py-1 rounded-full text-indigo-600 dark:text-indigo-400 border border-neutral-200/50 dark:border-neutral-700/50">
                    {studio.category}
                  </div>
                  <div className="absolute top-3 right-3 bg-neutral-900/80 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{Number(studio.rating || 5).toFixed(1)}</span>
                  </div>
                </Link>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col">
                  <Link href={`/studios/${studioId}`}>
                    <h3 className="font-bold text-lg text-neutral-900 dark:text-neutral-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                      {studio.title}
                    </h3>
                  </Link>

                  <div className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400 text-sm mt-1 mb-4">
                    <MapPin className="w-4 h-4 text-neutral-400 shrink-0" />
                    <span className="truncate">{studio.location}</span>
                  </div>

                  <div className="mt-auto pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">
                        ${studio.hourlyRate}
                      </span>
                      <span className="text-xs text-neutral-500 font-medium">/ hour</span>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
                      <Users className="w-3.5 h-3.5" />
                      <span>Up to {studio.maxCapacity || 10}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Link
                      href={`/studios/${studioId}`}
                      className="py-2.5 px-3 text-center text-xs font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition flex items-center justify-center gap-1.5"
                    >
                      <span>Book Space</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <button
                      onClick={() => handleRemove(studioId, studio.title)}
                      disabled={removingId === studioId}
                      className="py-2.5 px-3 text-center text-xs font-semibold rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      {removingId === studioId ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-16 text-center rounded-3xl border border-dashed border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-rose-50 dark:bg-rose-950/50 flex items-center justify-center text-rose-600 dark:text-rose-400">
            <Bookmark className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
            Your wishlist is empty
          </h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-sm mx-auto">
            You haven&apos;t saved any studio workspaces yet. Click the heart icon on any studio listing to keep track of spaces you like.
          </p>
          <Link
            href="/studios"
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow transition"
          >
            Explore Studio Directory
          </Link>
        </div>
      )}
    </div>
  );
}

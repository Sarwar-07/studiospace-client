'use client';

import { Suspense, useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import StudioCard from '@/components/StudioCard';
import { Search, SlidersHorizontal, Loader2, Sparkles, X } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Photo Studio',
  'Recording Booth',
  'Film Stage',
  'Podcast Suite',
  'Art Loft'
];

function StudiosExplorer() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [studios, setStudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('recommended');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const fetchStudios = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory && selectedCategory !== 'All') {
        params.append('category', selectedCategory);
      }
      if (searchTerm.trim()) {
        params.append('search', searchTerm.trim());
      }

      const res = await fetch(`${API_URL}/api/studios?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch studios');
      const data = await res.json();
      setStudios(data);
    } catch (err) {
      console.error(err);
      setStudios([]);
    } finally {
      setLoading(false);
    }
  }, [API_URL, selectedCategory, searchTerm]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStudios();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchStudios]);

  // Client-side Sorting
  const sortedStudios = [...studios].sort((a, b) => {
    if (sortBy === 'price-low') return Number(a.hourlyRate) - Number(b.hourlyRate);
    if (sortBy === 'price-high') return Number(b.hourlyRate) - Number(a.hourlyRate);
    if (sortBy === 'rating') return Number(b.rating || 0) - Number(a.rating || 0);
    return 0; // Default/recommended
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          Studio Directory
        </span>
        <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-neutral-50 tracking-tight mt-1">
          Explore Creative Spaces
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Find and reserve verified production environments by discipline, equipment, and location
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-neutral-900 p-4 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-neutral-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by space title or city..."
              className="w-full pl-10 pr-9 py-2.5 text-sm rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-3 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <SlidersHorizontal className="w-4 h-4 text-neutral-400 shrink-0" />
            <label htmlFor="sortSelect" className="text-xs font-medium text-neutral-500 dark:text-neutral-400 shrink-0">
              Sort by:
            </label>
            <select
              id="sortSelect"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="py-2 px-3 text-xs md:text-sm rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="recommended">Featured / Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Listings Grid */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3 text-neutral-400">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400" />
          <p className="text-sm">Fetching verified studio spaces...</p>
        </div>
      ) : sortedStudios.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedStudios.map((studio) => (
            <StudioCard key={studio._id} studio={studio} />
          ))}
        </div>
      ) : (
        <div className="p-16 text-center rounded-3xl border border-dashed border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900/50">
          <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
            No studio spaces found
          </h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search query, selecting another category, or clearing the filter.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}

export default function StudiosPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    }>
      <StudiosExplorer />
    </Suspense>
  );
}
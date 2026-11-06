import Link from 'next/link';
import HeroSlider from '@/components/HeroSlider';
import StudioCard from '@/components/StudioCard';
import { Camera, Music, Video, Palette, Mic2, ShieldCheck, Clock, Zap, ArrowRight, Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getFeaturedStudios() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  try {
    const res = await fetch(`${API_URL}/api/studios/featured`, {
      cache: 'no-store'
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error('Failed to fetch featured studios:', error);
    return [];
  }
}

const categories = [
  { name: 'Photo Studio', icon: Camera, color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50' },
  { name: 'Recording Booth', icon: Music, color: 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/50' },
  { name: 'Film Stage', icon: Video, color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50' },
  { name: 'Podcast Suite', icon: Mic2, color: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50' },
  { name: 'Art Loft', icon: Palette, color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50' }
];

export default async function HomePage() {
  const featuredStudios = await getFeaturedStudios();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
      {/* 1. Modern Cinematic Hero Section */}
      <HeroSlider />

      {/* 2. Browse by Creative Discipline */}
      <section className="mb-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Specialized Production Hubs
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
              Browse by Creative Discipline
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Find purpose-built spaces optimized for your specific recording or shooting pipeline
            </p>
          </div>
          <Link
            href="/studios"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors shrink-0"
          >
            <span>All Spaces</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                href={`/studios?category=${encodeURIComponent(cat.name)}`}
                className="group hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all duration-300 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 p-5 text-center flex flex-col items-center justify-center"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 mb-3 ${cat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-sm text-zinc-800 dark:text-zinc-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {cat.name}
                </h3>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. Top Rated Creative Studios */}
      <section className="mb-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Curated Production Spaces
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
              Top Rated Creative Studios
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Handpicked environments verified for acoustics, continuous lighting, and rigging capacity
            </p>
          </div>
          <Link
            href="/studios"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors shrink-0"
          >
            <span>View Directory</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {featuredStudios.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredStudios.map((studio) => (
              <StudioCard key={studio._id} studio={studio} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
            <h3 className="text-lg font-semibold text-zinc-700 dark:text-zinc-300">
              No studios featured yet
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto">
              Be the first creator to list a sound booth, cyclorama, or loft on StudioSpace.
            </p>
            <Link
              href="/studios/add"
              className="mt-4 inline-block px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm transition"
            >
              Add Listing
            </Link>
          </div>
        )}
      </section>

      {/* 4. Engineered for Creators (Value Props Bento Grid) */}
      <section className="bg-gradient-to-b from-zinc-50/50 to-white dark:from-zinc-900/40 dark:to-zinc-950 border-y border-zinc-200/60 dark:border-zinc-800/60 py-16 px-4 sm:px-8 rounded-3xl">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Platform Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight mt-1">
            Engineered for Creators & Professional Hosts
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
            Eliminating booking friction and scheduling collisions with verified production-ready specifications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="p-6 sm:p-8 rounded-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border border-zinc-200/70 dark:border-zinc-800 shadow-sm hover:shadow-md hover:border-indigo-500/30 transition-all">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-5">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 mb-2">
              Slot Conflict Prevention
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Our automated engine checks time-slot intersections, making double booking mathematically impossible.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border border-zinc-200/70 dark:border-zinc-800 shadow-sm hover:shadow-md hover:border-violet-500/30 transition-all">
            <div className="w-12 h-12 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-5">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 mb-2">
              Verified Host Equipment
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Every space includes explicit equipment inventories, acoustic ratings, and transparent hourly rates.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border border-zinc-200/70 dark:border-zinc-800 shadow-sm hover:shadow-md hover:border-emerald-500/30 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 mb-2">
              Instant Confirmations
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Lock down production days with transparent rates, downloadable PDF receipts, and immediate host notifications.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

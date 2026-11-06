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
  { name: 'Photo Studio', icon: Camera },
  { name: 'Recording Booth', icon: Music },
  { name: 'Film Stage', icon: Video },
  { name: 'Podcast Suite', icon: Mic2 },
  { name: 'Art Loft', icon: Palette }
];

export default async function HomePage() {
  const featuredStudios = await getFeaturedStudios();

  return (
    <div className="bg-zinc-50 dark:bg-[#090a0f] min-h-screen text-zinc-900 dark:text-zinc-100 selection:bg-indigo-500 selection:text-white relative overflow-hidden transition-colors duration-300">
      {/* Subtle Top Radial Gradient Mesh */}
      <div className="absolute top-0 inset-x-0 h-[640px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100/50 via-zinc-50/20 to-transparent dark:from-indigo-950/20 dark:via-[#090a0f]/30 dark:to-transparent pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        {/* 1. High-Impact Cinematic Hero Section */}
        <HeroSlider />

        {/* 2. Category Discipline Grid */}
        <section className="mb-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 mb-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Creative Disciplines
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
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
              <span>Explore All Spaces</span>
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
                  className="p-5 rounded-2xl bg-white dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:border-indigo-500 dark:hover:border-indigo-500 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-3 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
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

        {/* 3. Top Rated Creative Studios (Peerspace / Airbnb Luxe Showcase) */}
        <section className="mb-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 mb-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Curated Luxury Workspaces
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
                Top Rated Creative Studios
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                Verified high-production environments for commercial shoots, sound design, and art galleries
              </p>
            </div>
            <Link
              href="/studios"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors shrink-0"
            >
              <span>View Full Directory</span>
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
            <div className="p-12 text-center rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-sm">
              <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">
                No featured studios currently listed
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto">
                Be the first verified host to showcase your creative studio on StudioSpace.
              </p>
              <Link
                href="/studios/add"
                className="mt-4 inline-block px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm transition"
              >
                List Your Space
              </Link>
            </div>
          )}
        </section>

        {/* 4. "Engineered for Creators" Section */}
        <section className="bg-zinc-100/60 dark:bg-zinc-900/40 border-y border-zinc-200 dark:border-zinc-800/80 rounded-3xl p-8 sm:p-12 mb-12">
          <div className="max-w-2xl mx-auto text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              The StudioSpace Difference
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight mt-1">
              Engineered for Creators & Professional Hosts
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
              Eliminating double-booking friction with verified acoustic, electrical, and lighting specs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">
                Slot Conflict Prevention
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Our automated collision engine validates time-slot intervals, guaranteeing overlapping sessions are mathematically impossible.
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">
                Verified Host Equipment
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Every space includes explicit equipment inventories, power specs, acoustic isolation ratings, and transparent hourly rates.
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">
                Instant Confirmations
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Lock down production days with transparent rates, downloadable PDF reservation slips, and immediate host alerts.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

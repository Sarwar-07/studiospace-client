import Link from 'next/link';
import HeroSlider from '@/components/HeroSlider';
import StudioCard from '@/components/StudioCard';
import { Camera, Music, Video, Palette, Mic2, ShieldCheck, Clock, Zap, ArrowRight } from 'lucide-react';

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
  { name: 'Photo Studio', icon: Camera, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40' },
  { name: 'Recording Booth', icon: Music, color: 'text-violet-500 bg-violet-50 dark:bg-violet-950/40' },
  { name: 'Film Stage', icon: Video, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40' },
  { name: 'Podcast Suite', icon: Mic2, color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/40' },
  { name: 'Art Loft', icon: Palette, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40' }
];

export default async function HomePage() {
  const featuredStudios = await getFeaturedStudios();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* 1. Hero Carousel Banner */}
      <HeroSlider />

      {/* 2. Category Browse Grid */}
      <section className="mb-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">
              Browse by Creative Discipline
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              Find purpose-built spaces optimized for your production pipeline
            </p>
          </div>
          <Link
            href="/studios"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            All Spaces <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                href={`/studios?category=${encodeURIComponent(cat.name)}`}
                className="group p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-indigo-500 hover:shadow-lg transition flex flex-col items-center text-center"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${cat.color}`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="font-semibold text-sm text-neutral-800 dark:text-neutral-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                  {cat.name}
                </h3>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. Featured Creative Spaces (Dynamic limit 6) */}
      <section className="mb-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Curated Production Spaces
            </span>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight mt-1">
              Top Rated Creative Studios
            </h2>
          </div>
          <Link
            href="/studios"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            View Directory <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {featuredStudios.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredStudios.map((studio) => (
              <StudioCard key={studio._id} studio={studio} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center rounded-3xl border border-dashed border-neutral-300 dark:border-neutral-800 bg-neutral-100/50 dark:bg-neutral-900/50">
            <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-300">
              No studios featured yet
            </h3>
            <p className="text-sm text-neutral-500 mt-1 max-w-sm mx-auto">
              Be the first creator to list a sound booth, cyclorama, or loft on StudioSpace.
            </p>
            <Link
              href="/studios/add"
              className="mt-4 inline-block px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold shadow"
            >
              Add Listing
            </Link>
          </div>
        )}
      </section>

      {/* 4. Why Choose StudioSpace Platform Highlights */}
      <section className="rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-gradient-to-b from-white to-neutral-100/50 dark:from-neutral-900 dark:to-neutral-950 p-8 md:p-14">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-900 dark:text-neutral-50 tracking-tight">
            Engineered for Creators & Professional Hosts
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
            Eliminating booking friction and double bookings with verified production-ready specifications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100 mb-2">
              Slot Conflict Prevention
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Our automated engine checks time-slot intersections, making double booking mathematically impossible.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100 mb-2">
              Verified Host Equipment
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Every space includes explicit equipment inventories, acoustic ratings, and transparent hourly rates.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100 mb-2">
              Instant Confirmations
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Lock down production days with transparent rates, downloadable PDF receipts, and immediate host notifications.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
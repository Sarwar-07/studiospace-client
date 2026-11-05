import Link from 'next/link';
import { MapPin, Star, DollarSign, Users } from 'lucide-react';

export default function StudioCard({ studio }) {
  const {
    _id,
    title,
    category,
    images = [],
    image,
    location,
    hourlyRate,
    rating = 5.0,
    maxCapacity = 10
  } = studio;

  const displayImage = images?.[0] || image || 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="group rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
      {/* Thumbnail */}
      <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100 dark:bg-neutral-800">
        <img
          src={displayImage}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md text-xs font-semibold px-3 py-1 rounded-full text-indigo-600 dark:text-indigo-400 border border-neutral-200/50 dark:border-neutral-700/50">
          {category}
        </div>
        <div className="absolute top-3 right-3 bg-neutral-900/80 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{Number(rating).toFixed(1)}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-bold text-lg text-neutral-900 dark:text-neutral-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
          {title}
        </h3>

        <div className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400 text-sm mt-1.5 mb-4">
          <MapPin className="w-4 h-4 text-neutral-400 shrink-0" />
          <span className="truncate">{location}</span>
        </div>

        <div className="mt-auto pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">
              ${hourlyRate}
            </span>
            <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">/ hour</span>
          </div>

          <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
            <Users className="w-3.5 h-3.5" />
            <span>Up to {maxCapacity}</span>
          </div>
        </div>

        <Link
          href={`/studios/${_id}`}
          className="mt-4 w-full py-2.5 px-4 text-center text-sm font-semibold rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 group-hover:bg-indigo-600 group-hover:text-white transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
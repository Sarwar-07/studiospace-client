import Link from 'next/link';
import { MapPin, Star, Users, ArrowRight } from 'lucide-react';

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
    <div className="group relative bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 flex flex-col">
      {/* Image Container with Fixed Aspect Ratio */}
      <Link href={`/studios/${_id}`} className="aspect-[16/10] overflow-hidden relative block bg-zinc-100 dark:bg-zinc-800">
        <img
          src={displayImage}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        {/* Floating Badges */}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium bg-black/50 backdrop-blur-md text-white border border-white/10">
          {category}
        </div>
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-black/50 backdrop-blur-md text-amber-400 border border-white/10 flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{Number(rating).toFixed(1)}</span>
        </div>
      </Link>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <Link href={`/studios/${_id}`}>
            <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-base line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {title}
            </h3>
          </Link>

          <div className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1 mt-1">
            <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <span className="truncate">{location}</span>
          </div>
        </div>

        {/* Footer Row */}
        <div className="mt-4 pt-3.5 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
          <div>
            <span className="text-lg font-extrabold text-zinc-900 dark:text-white">
              ${hourlyRate}
            </span>
            <span className="text-xs font-normal text-zinc-500 dark:text-zinc-400"> / hour</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
              <Users className="w-3.5 h-3.5" />
              <span>{maxCapacity} max</span>
            </div>

            <Link
              href={`/studios/${_id}`}
              className="group/btn inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
            >
              <span>View</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

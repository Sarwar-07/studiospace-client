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
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-2xl dark:hover:border-zinc-700 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col group">
      {/* Luxury Property Image Showcase */}
      <Link href={`/studios/${_id}`} className="relative aspect-[16/10] overflow-hidden block bg-zinc-100 dark:bg-zinc-800">
        <img
          src={displayImage}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 backdrop-blur-md bg-black/60 text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/20">
          {category}
        </div>
        <div className="absolute top-3 right-3 backdrop-blur-md bg-black/60 text-amber-400 text-xs font-bold px-2.5 py-1 rounded-full border border-white/20 flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{Number(rating).toFixed(1)}</span>
        </div>
      </Link>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <Link href={`/studios/${_id}`}>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
              {title}
            </h3>
          </Link>

          <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 shrink-0" />
            <span className="truncate">{location}</span>
          </div>
        </div>

        <div>
          {/* Specs Bar */}
          <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 pt-4 mt-4">
            <div>
              <span className="text-xl font-extrabold text-zinc-900 dark:text-white">
                ${hourlyRate}
              </span>
              <span className="text-xs font-normal text-zinc-500 dark:text-zinc-400"> / hr</span>
            </div>

            <div className="bg-zinc-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 text-xs font-medium px-2.5 py-1 rounded-md flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
              <span>Up to {maxCapacity} guests</span>
            </div>
          </div>

          {/* Solid Full-Width Action Button */}
          <Link
            href={`/studios/${_id}`}
            className="w-full mt-4 py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-indigo-600 text-white dark:bg-zinc-800 dark:hover:bg-indigo-600 border border-transparent dark:border-zinc-700/60 text-sm font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <span>View Studio Details</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}

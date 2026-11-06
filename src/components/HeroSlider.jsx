'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1600&q=80',
    tag: 'Acoustic Precision',
    title: 'Sound Stages & High-End Recording Suites',
    desc: 'Rent acoustically isolated tracking rooms, vocal booths, and mixing environments by the hour.'
  },
  {
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1600&q=80',
    tag: 'Natural Light Lofts',
    title: 'Editorial Photography & Daylight Cycloramas',
    desc: 'Discover north-facing infinity walls, continuous softboxes, and high-ceiling warehouse studios.'
  },
  {
    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1600&q=80',
    tag: 'Cinema Production',
    title: 'Full-Scale Film Sets & Virtual Production',
    desc: 'Equipped with heavy rigging grids, multi-angle LED panels, and 3-phase high amperage power.'
  }
];

export default function HeroSlider() {
  return (
    <div className="relative w-full mb-12 sm:mb-16">
      {/* Subtle Ambient Background Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-violet-600/20 via-indigo-600/15 to-pink-600/20 rounded-3xl blur-xl opacity-50 pointer-events-none -z-10" />

      {/* Compact & Balanced Slider Container */}
      <div className="relative w-full max-w-7xl mx-auto rounded-3xl overflow-hidden shadow-xl h-[380px] sm:h-[420px] lg:h-[450px] border border-zinc-200/70 dark:border-zinc-800/80">
        <Swiper
          modules={[Autoplay, Pagination, EffectFade]}
          effect="fade"
          speed={900}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          className="w-full h-full [&_.swiper-pagination]:!bottom-3.5 sm:[&_.swiper-pagination]:!bottom-4 [&_.swiper-pagination]:!z-20 [&_.swiper-pagination-bullet]:!bg-white/60 [&_.swiper-pagination-bullet-active]:!bg-white [&_.swiper-pagination-bullet-active]:!w-6 [&_.swiper-pagination-bullet]:!transition-all"
        >
          {slides.map((slide, idx) => (
            <SwiperSlide key={idx} className="relative w-full h-full">
              {/* Full-bleed Background Image */}
              <img
                src={slide.image}
                alt={slide.title}
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Crisp Contrast Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/20" />

              {/* Vertically Centered Content */}
              <div className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-12 max-w-2xl text-white">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md text-white border border-white/20 w-fit mb-2.5 tracking-wider uppercase">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  {slide.tag}
                </span>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
                  {slide.title}
                </h1>

                <p className="text-sm sm:text-base text-zinc-300 mt-2 line-clamp-2 leading-relaxed">
                  {slide.desc}
                </p>

                {/* CTA Action Buttons */}
                <div className="mt-6 flex items-center gap-3">
                  <Link
                    href="/studios"
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold px-6 py-2.5 sm:py-3 rounded-xl shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-0.5 inline-flex items-center gap-2 text-sm"
                  >
                    <span>Explore Studios</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/studios/add"
                    className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-medium px-5 py-2.5 sm:py-3 rounded-xl transition-all inline-flex items-center gap-2 text-sm"
                  >
                    Host Your Space
                  </Link>
                </div>

                {/* Compact Inline Trust Badges */}
                <div className="text-xs text-zinc-400 mt-4 flex items-center gap-3 sm:gap-4 flex-wrap">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="text-amber-400 font-bold">✦</span> 500+ Verified Spaces
                  </span>
                  <span className="hidden sm:inline text-zinc-600">•</span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="text-amber-400 font-bold">★</span> 4.9 Average Host Rating
                  </span>
                  <span className="hidden sm:inline text-zinc-600">•</span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="text-amber-400 font-bold">⚡</span> Instant Booking
                  </span>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

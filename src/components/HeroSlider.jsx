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
    <div className="relative w-full mb-16 sm:mb-20">
      {/* Ambient Background Glow */}
      <div className="absolute -inset-1.5 bg-gradient-to-r from-violet-600/30 via-indigo-600/25 to-pink-600/30 rounded-3xl blur-2xl opacity-60 dark:opacity-40 -z-10 pointer-events-none" />

      <div className="relative rounded-3xl overflow-hidden shadow-2xl mx-auto max-w-7xl border border-zinc-200/70 dark:border-zinc-800/80">
        <Swiper
          modules={[Autoplay, Pagination, EffectFade]}
          effect="fade"
          speed={900}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          className="w-full min-h-[520px] lg:min-h-[580px]"
        >
          {slides.map((slide, idx) => (
            <SwiperSlide key={idx} className="relative w-full min-h-[520px] lg:min-h-[580px]">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full min-h-[520px] lg:min-h-[580px] object-cover"
              />
              {/* Rich and Dramatic Horizontal Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/20 flex items-center p-8 sm:p-14 lg:p-16">
                <div className="max-w-3xl text-white">
                  <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md text-white border border-white/20 mb-4 tracking-wider uppercase">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    {slide.tag}
                  </span>
                  <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1]">
                    {slide.title}
                  </h1>
                  <p className="text-zinc-300 text-base sm:text-lg max-w-xl mt-4 leading-relaxed">
                    {slide.desc}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-8">
                    <Link
                      href="/studios"
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold px-7 py-3.5 rounded-xl shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-0.5 inline-flex items-center gap-2"
                    >
                      <span>Explore All Studios</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      href="/studios/add"
                      className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-medium px-6 py-3.5 rounded-xl transition-all inline-flex items-center gap-2"
                    >
                      Host Your Space
                    </Link>
                  </div>

                  {/* Floating Trust Pill Row */}
                  <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 mt-8 pt-6 border-t border-white/15 text-xs text-zinc-300">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 font-medium">
                      <span className="text-amber-400 font-bold">✦</span> 500+ Verified Spaces
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 font-medium">
                      <span className="text-amber-400 font-bold">★</span> 4.9 Average Host Rating
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 font-medium">
                      <span className="text-amber-400 font-bold">⚡</span> Instant Booking
                    </span>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

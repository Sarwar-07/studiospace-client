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

      <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl border border-zinc-200/70 dark:border-zinc-800/80">
        <Swiper
          modules={[Autoplay, Pagination, EffectFade]}
          effect="fade"
          speed={900}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          className="w-full h-[480px] sm:h-[540px] lg:h-[580px]"
        >
          {slides.map((slide, idx) => (
            <SwiperSlide key={idx} className="relative w-full h-full">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              {/* Cinematic Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end">
                <div className="p-8 sm:p-12 lg:p-16 max-w-3xl text-white">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md text-white border border-white/20 mb-4 tracking-wider uppercase">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    {slide.tag}
                  </span>
                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white mb-4">
                    {slide.title}
                  </h1>
                  <p className="text-sm sm:text-base text-zinc-200/90 mb-8 max-w-xl font-normal leading-relaxed">
                    {slide.desc}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                    <Link
                      href="/studios"
                      className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all transform hover:-translate-y-0.5 inline-flex items-center gap-2 text-sm"
                    >
                      <span>Explore All Studios</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      href="/studios/add"
                      className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/25 text-white font-medium px-6 py-3 rounded-xl transition-all inline-flex items-center gap-2 text-sm"
                    >
                      Host Your Space
                    </Link>
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

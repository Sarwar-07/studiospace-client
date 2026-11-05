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
    <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl border border-neutral-200 dark:border-neutral-800 mb-16">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        speed={900}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        className="w-full h-[460px] md:h-[540px]"
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={idx} className="relative w-full h-full">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20 flex items-end">
              <div className="p-8 md:p-14 max-w-3xl text-white">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/80 backdrop-blur-md mb-4 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  {slide.tag}
                </span>
                <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight mb-3">
                  {slide.title}
                </h1>
                <p className="text-sm md:text-base text-neutral-200 mb-6 max-w-xl">
                  {slide.desc}
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <Link
                    href="/studios"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition shadow-lg shadow-indigo-600/30"
                  >
                    Explore All Studios
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/studios/add"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-semibold text-sm border border-white/20 transition"
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
  );
}
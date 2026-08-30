'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ChevronRight, ChevronLeft } from 'lucide-react';
import { getImageUrl } from '@/lib/utils';

const MotionImage = motion(Image);

export default function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-ink-900 to-ink-800">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'linear-gradient(var(--color-ink-100) 1px, transparent 1px), linear-gradient(90deg, var(--color-ink-100) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-brand-500/10 text-brand-500">
          <Zap className="h-8 w-8" strokeWidth={1.5} />
        </span>
      </div>
    );
  }

  const goTo = (index: number) => {
    setActiveIndex((index + images.length) % images.length);
  };

  return (
    <div>
      <div className="relative mb-3 aspect-square w-full overflow-hidden rounded-xl bg-ink-100">
        <AnimatePresence mode="wait">
          <MotionImage
            key={activeIndex}
            src={getImageUrl(images[activeIndex])}
            alt={`${name} - تصویر ${activeIndex + 1}`}
            fill
            priority={activeIndex === 0}
            sizes="(max-width: 768px) 100vw, 50vw"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="object-cover"
          />
        </AnimatePresence>

        {images.length > 1 && (
          <>
            <button
              onClick={() => goTo(activeIndex - 1)}
              className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink-900 shadow-md transition hover:bg-white"
              aria-label="تصویر قبلی"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => goTo(activeIndex + 1)}
              className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink-900 shadow-md transition hover:bg-white"
              aria-label="تصویر بعدی"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((img, index) => (
            <button
              key={img}
              onClick={() => setActiveIndex(index)}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                index === activeIndex ? 'border-brand-500' : 'border-transparent opacity-60'
              }`}
            >
              <Image src={getImageUrl(img)} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
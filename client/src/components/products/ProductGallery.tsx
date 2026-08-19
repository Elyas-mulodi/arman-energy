'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';

export default function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  const hasImages = images.length > 0;

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-md border border-ink-800/10 bg-ink-100">
        {hasImages ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative h-full w-full"
            >
              <Image
                src={images[active]}
                alt={alt}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-ink-800/30">
            بدون تصویر
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={img}
              onClick={() => setActive(i)}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 transition ${
                active === i ? 'border-brand-500' : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <Image src={img} alt={`${alt} ${i + 1}`} fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
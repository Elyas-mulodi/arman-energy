'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { ImagePlus, X } from 'lucide-react';
import { getImageUrl } from '@/lib/utils';

interface ImageUploaderProps {
  existingImages: string[];
  onRemoveExisting: (url: string) => void;
  newFiles: File[];
  onNewFilesChange: (files: File[]) => void;
}

export default function ImageUploader({
  existingImages,
  onRemoveExisting,
  newFiles,
  onNewFilesChange,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    onNewFilesChange([...newFiles, ...selected]);
    e.target.value = '';
  };

  const removeNewFile = (index: number) => {
    onNewFilesChange(newFiles.filter((_, i) => i !== index));
  };

  return (
    <div className="mb-6">
      <label className="mb-2 block text-xs font-bold text-ink-800/60">تصاویر محصول</label>

      <div className="flex flex-wrap gap-3">
        {existingImages.map((img) => (
          <div key={img} className="group relative h-20 w-20 overflow-hidden rounded-md border border-ink-800/10">
            <Image src={getImageUrl(img)} alt="" fill sizes="80px" className="object-cover" />
            <button
              type="button"
              onClick={() => onRemoveExisting(img)}
              className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 opacity-0 transition group-hover:opacity-100"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>
        ))}

        {newFiles.map((file, index) => {
          // برای فایل‌های محلی (هنوز آپلود نشده)، next/image امکان استفاده از object URL رو نداره
          // (چون این یه blob موقته، نه یه مسیر واقعی رو دیسک/CDN) - پس اینجا از img خام استفاده می‌کنیم، عمداً
          const previewUrl = URL.createObjectURL(file);
          return (
            // eslint-disable-next-line @next/next/no-img-element
            <div key={index} className="group relative h-20 w-20 overflow-hidden rounded-md border-2 border-brand-500/40">
              <img src={previewUrl} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeNewFile(index)}
                className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition group-hover:opacity-100"
              >
                <X className="h-5 w-5 text-white" />
              </button>
            </div>
          );
        })}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-md border-2 border-dashed border-ink-800/20 text-ink-800/40 transition hover:border-brand-500 hover:text-brand-500"
        >
          <ImagePlus className="h-5 w-5" />
          <span className="text-[10px]">افزودن</span>
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
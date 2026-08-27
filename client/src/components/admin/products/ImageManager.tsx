'use client';

import { useRef } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { X, ImagePlus, Loader2 } from 'lucide-react';
import { deleteProductImage } from '@/lib/adminProducts';

export default function ImageManager({
  productId,
  existingImages,
  onExistingImagesChange,
  newFiles,
  onNewFilesChange,
  removingImage,
  setRemovingImage,
}: {
  productId?: string; // فقط تو حالت ویرایش وجود داره
  existingImages: string[];
  onExistingImagesChange: (next: string[]) => void;
  newFiles: File[];
  onNewFilesChange: (next: File[]) => void;
  removingImage: string | null;
  setRemovingImage: (url: string | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSelectFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    onNewFilesChange([...newFiles, ...files]);
    if (inputRef.current) inputRef.current.value = '';
  };

  const removeNewFile = (index: number) => {
    onNewFilesChange(newFiles.filter((_, i) => i !== index));
  };

  const removeExisting = async (url: string) => {
    if (!productId) return;
    setRemovingImage(url);
    try {
      const result = await deleteProductImage(productId, url);
      onExistingImagesChange(result.images);
    } catch {
      toast.error('خطا در حذف تصویر');
    } finally {
      setRemovingImage(null);
    }
  };

  return (
    <div>
      <label className="mb-3 block text-xs font-bold text-ink-800/60">تصاویر محصول</label>

      <div className="flex flex-wrap gap-3">
        {existingImages.map((url) => (
          <div key={url} className="relative h-24 w-24 overflow-hidden rounded-md border border-ink-800/10">
            <Image src={url} alt="" fill sizes="96px" className="object-cover" />
            <button
              type="button"
              onClick={() => removeExisting(url)}
              disabled={removingImage === url}
              className="absolute left-1 top-1 flex h-5 w-5 items-center justify-center rounded bg-ink-900/70 text-white hover:bg-red-500"
            >
              {removingImage === url ? <Loader2 className="h-3 w-3 animate-spin" /> : <X className="h-3 w-3" />}
            </button>
          </div>
        ))}

        {newFiles.map((file, index) => (
          <div key={index} className="relative h-24 w-24 overflow-hidden rounded-md border-2 border-dashed border-brand-500/40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={URL.createObjectURL(file)} alt="" className="h-full w-full object-cover" />
            <span className="absolute bottom-0 right-0 rounded-tr bg-brand-500 px-1.5 py-0.5 text-[9px] font-bold text-white">
              جدید
            </span>
            <button
              type="button"
              onClick={() => removeNewFile(index)}
              className="absolute left-1 top-1 flex h-5 w-5 items-center justify-center rounded bg-ink-900/70 text-white hover:bg-red-500"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-md border-2 border-dashed border-ink-800/15 text-ink-800/40 transition hover:border-brand-500/40 hover:text-brand-600"
        >
          <ImagePlus className="h-5 w-5" />
          <span className="text-[10px] font-medium">افزودن</span>
        </button>
        <input ref={inputRef} type="file" accept="image/*" multiple onChange={handleSelectFiles} className="hidden" />
      </div>
    </div>
  );
}
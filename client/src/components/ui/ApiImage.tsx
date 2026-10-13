import Image, { ImageProps } from 'next/image';
import { getImageUrl } from '@/lib/utils';

type ApiImageProps = Omit<ImageProps, 'src'> & { src: string };

// جایگزین مستقیم next/image برای همه‌ی تصاویری که از بک‌اند میان
export default function ApiImage({ src, alt, ...rest }: ApiImageProps) {
  return <Image src={getImageUrl(src)} alt={alt} {...rest} />;
}
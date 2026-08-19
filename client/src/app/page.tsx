import Hero from '@/components/site/Hero';
import USPStrip from '@/components/site/USPStrip';
import FeaturedCategories from '@/components/site/FeaturedCategories';
import FeaturedProducts from '@/components/site/FeaturedProducts';
import CTABanner from '@/components/site/CTABanner';

export default function HomePage() {
  return (
    <>
      <Hero />
      <USPStrip />
      <FeaturedCategories />
      <FeaturedProducts />
      <CTABanner />
    </>
  );
}
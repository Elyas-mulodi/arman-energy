import AboutHero from "@/components/about/AboutHero";
import AboutProcess from "@/components/about/AboutProcess";
import AboutStats from "@/components/about/AboutState";
import AboutStory from "@/components/about/AboutStory";
import AboutValues from "@/components/about/AboutValues";
import CTABanner from "@/components/site/CTABanner";

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutStory />
      <AboutStats />
      <AboutValues />
      <AboutProcess />
      <CTABanner />
    </>
  );
}

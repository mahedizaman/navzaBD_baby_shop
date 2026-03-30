import Link from "next/link";
import Container from "@/components/common/Container";
import { Button } from "@/components/ui/button";
import HeroSlider from "@/components/HeroSlider";
import CategoryGrid from "@/components/CategoryGrid";
import FeaturedProducts from "@/components/FeatureProducts";
import PromoBanner from "@/components/PromoBanner";
import TrustSignals from "@/components/TrustSignals";
import Testimonials from "@/components/Testimonials";
import Newsletter from "@/components/Newsletter";

export default function HomePage() {
  return (
    <Container className="px-4 py-16 text-center md:py-24">
      <HeroSlider />
      <CategoryGrid />
      <FeaturedProducts />
      <PromoBanner />
      <TrustSignals />
      <Testimonials />
      <Newsletter />
    </Container>
  );
}

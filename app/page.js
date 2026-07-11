import Hero from "@/components/Hero";
import CategoryGrid from "@/components/CategoryGrid";
import FeaturedProducts from "@/components/FeaturedProducts";
import SellerCTA from "@/components/SellerCTA";
import MarketplaceStats from "@/components/MarketplaceStats";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">

      <Hero />

      <CategoryGrid />

      <FeaturedProducts />

      <MarketplaceStats />

      <SellerCTA />

    </main>
  );
}

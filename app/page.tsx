import HeroBanner from "@/components/hero-banner"
import Categories from "@/components/categories"
import FeaturedProducts from "@/components/featured-products"
import DealOfDay from "@/components/deal-of-day"

export default function Home() {
  return (
    <main>
      <HeroBanner />
      <Categories />
      <FeaturedProducts />
      <DealOfDay />
    </main>
  )
}


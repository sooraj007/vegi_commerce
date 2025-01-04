import ProductDetails from "@/components/product-details"
import HowWeFarm from "@/components/how-we-farm"
import ProductTabs from "@/components/product-tabs"
import PopularOrganic from "@/components/popular-organic"

export default function ProductPage({ params }) {
  return (
    <main className="container py-8">
      <ProductDetails productId={params.id} />
      <HowWeFarm />
      <ProductTabs />
      <PopularOrganic />
    </main>
  )
}


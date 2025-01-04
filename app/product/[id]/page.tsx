import ProductDetails from "@/components/product-details";
import HowWeFarm from "@/components/how-we-farm";
import ProductTabs from "@/components/product-tabs";
import PopularOrganic from "@/components/popular-organic";

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  return (
    <main className="container py-8">
      <ProductDetails productId={params.id} />
      <HowWeFarm />
      <ProductTabs />
      <PopularOrganic />
    </main>
  );
}

import ProductDetails from "@/components/product-details";
import HowWeFarm from "@/components/how-we-farm";
import ProductTabs from "@/components/product-tabs";
import PopularOrganic from "@/components/popular-organic";
import { Suspense } from "react";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = await params;

  return (
    <main className="container py-8">
      <Suspense fallback={<div>Loading...</div>}>
        <ProductDetails productId={resolvedParams.id} />
        <HowWeFarm />
        <ProductTabs />
        <PopularOrganic />
      </Suspense>
    </main>
  );
}

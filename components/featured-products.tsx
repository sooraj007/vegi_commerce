"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface Product {
  id: number;
  name: string;
  price: number;
  old_price: number;
  category_name: string;
  images: Array<{
    id: number;
    image_url: string;
    is_primary: boolean;
  }>;
}

export default function FeaturedProducts() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast({
          message: "Failed to load products. Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [toast]);

  const addToCart = (product: Product) => {
    toast({
      message: `${product.name} has been added to your cart.`,
    });
  };

  if (loading) {
    return (
      <section className="container py-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="h-8 w-48 animate-pulse rounded-lg bg-muted" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-2xl bg-card p-4"
            >
              <div className="absolute right-3 top-3 z-10 flex gap-2">
                <div className="h-9 w-9 animate-pulse rounded-full bg-muted" />
                <div className="h-9 w-9 animate-pulse rounded-full bg-muted" />
              </div>
              <div className="aspect-square animate-pulse rounded-xl bg-muted" />
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 animate-pulse rounded-full bg-muted" />
                </div>
                <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                <div className="h-5 w-32 animate-pulse rounded bg-muted" />
                <div className="flex items-center gap-2">
                  <div className="h-6 w-16 animate-pulse rounded bg-muted" />
                  <div className="h-4 w-12 animate-pulse rounded bg-muted" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="container py-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">All Products</h2>
        <Button
          variant="link"
          className="text-[#DEB887] hover:text-[#DEB887]/90"
        >
          See All
        </Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="group relative overflow-hidden rounded-2xl bg-card p-4 transition-all hover:bg-muted"
          >
            <div className="absolute right-3 top-3 z-10 flex gap-2">
              <Button
                variant="secondary"
                size="icon"
                className="h-9 w-9 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/30"
              >
                <Heart className="h-5 w-5 text-white" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="h-9 w-9 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/30"
                onClick={() => addToCart(product)}
              >
                <ShoppingCart className="h-5 w-5 text-white" />
              </Button>
            </div>
            <Link href={`/product/${product.id}`}>
              <div className="aspect-square overflow-hidden rounded-xl bg-white dark:bg-[#454545]">
                <Image
                  src={
                    product.images?.[0]?.image_url &&
                    product.images[0].image_url.startsWith("/") &&
                    !product.images[0].image_url.includes("undefined") &&
                    !product.images[0].image_url.includes("null") &&
                    !product.images[0].image_url.includes("products/")
                      ? product.images[0].image_url
                      : "/placeholder.svg"
                  }
                  alt={product.name}
                  width={200}
                  height={200}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  placeholder="blur"
                  blurDataURL="/placeholder.svg"
                  priority={false}
                  onError={() => {
                    const target = event?.target as HTMLImageElement;
                    if (
                      target &&
                      target.src !== `${window.location.origin}/placeholder.svg`
                    ) {
                      target.src = "/placeholder.svg";
                    }
                  }}
                />
              </div>
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-[#96C93D] p-1.5">
                    <Star className="h-3 w-3 fill-white text-white" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {product.category_name}
                </p>
                <h3 className="font-semibold">{product.name}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-[#DEB887]">
                    ${product.price}
                  </span>
                  {product.old_price && (
                    <span className="text-sm text-muted-foreground line-through">
                      ${product.old_price}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

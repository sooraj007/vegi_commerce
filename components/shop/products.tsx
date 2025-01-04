"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Star, Heart, ShoppingBasket } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Product {
  id: string;
  name: string;
  price: number;
  old_price: number | null;
  category_name: string;
  is_new?: boolean;
  rating?: number;
  reviews_count?: number;
  images: Array<{
    id: number;
    image_url: string;
    is_primary: boolean;
  }>;
}

interface ShopData {
  products: Product[];
  pagination: {
    total: number;
    pages: number;
    currentPage: number;
    limit: number;
  };
}

export function ShopProducts() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<ShopData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const response = await fetch(`/api/shop?${searchParams.toString()}`);
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast({
          message: "Failed to load products. Please try again later.",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [searchParams, toast]);

  const addToCart = (product: Product) => {
    toast({
      message: `${product.name} has been added to your cart.`,
    });
  };

  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="group relative overflow-hidden rounded-2xl bg-[#1C1C1C] p-4"
          >
            <div className="absolute right-4 top-4 z-10 flex gap-2">
              <div className="h-8 w-8 animate-pulse rounded-full bg-white/10" />
              <div className="h-8 w-8 animate-pulse rounded-full bg-white/10" />
            </div>
            <div className="relative">
              <div className="aspect-square animate-pulse rounded-xl bg-[#2C2C2C]" />
              <div className="absolute bottom-2 left-1/2 h-9 w-28 -translate-x-1/2 animate-pulse rounded-md bg-white/10" />
            </div>
            <div className="mt-8 space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-4 w-4 animate-pulse rounded bg-white/10"
                    />
                  ))}
                </div>
                <div className="h-4 w-12 animate-pulse rounded bg-white/10" />
              </div>
              <div className="h-5 w-32 animate-pulse rounded bg-white/10" />
              <div className="flex items-center gap-2">
                <div className="h-6 w-16 animate-pulse rounded bg-white/10" />
                <div className="h-4 w-12 animate-pulse rounded bg-white/10" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!data || !data.products.length) {
    return (
      <div className="text-center">
        <p className="text-muted-foreground">No products found.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {data.products.map((product) => (
        <div
          key={product.id}
          className="group relative overflow-hidden rounded-2xl bg-[#1C1C1C] p-4"
        >
          {product.is_new && (
            <span className="absolute left-5 top-5 z-10 rounded-full bg-[#96C93D] px-2 py-1 text-xs font-medium text-white">
              NEW
            </span>
          )}
          <div className="absolute right-5 top-5 z-10 flex gap-2">
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8 rounded-full bg-black/20 hover:bg-black/30"
            >
              <Heart className="h-4 w-4 text-white" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8 rounded-full bg-black/20 hover:bg-black/30"
            >
              <ShoppingBasket className="h-4 w-4 text-white" />
            </Button>
          </div>
          <div className="relative">
            <div className="aspect-square overflow-hidden rounded-xl bg-[#2C2C2C]">
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
                width={400}
                height={400}
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
            <Button
              className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/20 text-white backdrop-blur-sm hover:bg-black/30"
              onClick={() => addToCart(product)}
            >
              Quick View
            </Button>
          </div>
          <div className="mt-8 space-y-2">
            {product.rating !== undefined && (
              <div className="flex items-center gap-2">
                <div className="flex text-[#DEB887]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating ?? 0)
                          ? "fill-current"
                          : "fill-none"
                      }`}
                    />
                  ))}
                </div>
                {product.reviews_count !== undefined && (
                  <span className="text-sm text-gray-400">
                    ({product.reviews_count})
                  </span>
                )}
              </div>
            )}
            <h3 className="font-semibold text-white">{product.name}</h3>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-[#DEB887]">
                ${Number(product.price).toFixed(2)}
              </span>
              {product.old_price && (
                <span className="text-sm text-gray-400 line-through">
                  ${Number(product.old_price).toFixed(2)}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

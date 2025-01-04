"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import Image from "next/image";

interface Category {
  id: string;
  name: string;
  count?: number;
}

interface PriceRange {
  min: number;
  max: number;
}

interface FiltersData {
  categories: Category[];
  priceRange: PriceRange;
}

export function ShopFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [data, setData] = useState<FiltersData | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get("category") || ""
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  useEffect(() => {
    async function fetchFiltersData() {
      try {
        const response = await fetch("/api/shop");
        if (!response.ok) throw new Error("Failed to fetch filters data");
        const data = await response.json();
        setData(data.filters);
        setPriceRange([0, 100]);
      } catch (error) {
        console.error("Error fetching filters data:", error);
      }
    }

    fetchFiltersData();
  }, []);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category === selectedCategory ? "" : category);
    router.push(
      `/shop?${createQueryString(
        "category",
        category === selectedCategory ? "" : category
      )}`
    );
  };

  const handlePriceChange = (value: [number, number]) => {
    setPriceRange(value);
    const params = new URLSearchParams(searchParams.toString());
    params.set("minPrice", value[0].toString());
    params.set("maxPrice", value[1].toString());
    router.push(`/shop?${params.toString()}`);
  };

  if (!data) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-32 animate-pulse rounded bg-muted" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-6 w-full animate-pulse rounded bg-muted"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="rounded-xl bg-card p-4">
        <h2 className="mb-4 text-lg font-semibold text-white">Categories</h2>
        <div className="space-y-2">
          {data.categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.name)}
              className={`flex w-full items-center justify-between py-1 text-sm hover:text-white ${
                selectedCategory === category.name
                  ? "text-white font-semibold"
                  : "text-gray-400"
              }`}
            >
              <span>{category.name}</span>
              <span>({category.count || 0})</span>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl bg-card p-4">
        <h2 className="mb-4 text-lg font-semibold text-white">
          Filter by Price
        </h2>
        <div className="space-y-4">
          <Slider
            min={0}
            max={100}
            step={1}
            value={priceRange}
            onValueChange={handlePriceChange}
            className="mb-4"
          />
          <div className="mb-4 flex items-center justify-between text-sm text-white">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
          <Button className="w-full bg-[#DEB887] text-[#353535] hover:bg-[#DEB887]/90">
            Filter
          </Button>
        </div>
      </div>

      <div className="rounded-xl bg-card p-4">
        <h2 className="mb-4 text-lg font-semibold text-white">
          Trending Items
        </h2>
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex gap-3">
              <div className="h-20 w-20 overflow-hidden rounded-lg bg-white dark:bg-[#454545]">
                <Image
                  src="/placeholder.svg"
                  alt="Trending item"
                  width={80}
                  height={80}
                  className="h-full w-full object-cover"
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
              <div>
                <h4 className="font-medium text-white">Product Name</h4>
                <p className="text-[#DEB887]">$4.99</p>
              </div>
            </div>
          ))}
          <Button variant="link" className="w-full text-[#DEB887]">
            View More
          </Button>
        </div>
      </div>
    </div>
  );
}

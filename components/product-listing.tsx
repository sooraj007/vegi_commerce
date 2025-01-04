"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  LayoutGrid,
  List,
  Star,
  Heart,
  Shuffle,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

export default function ProductListing() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const category = searchParams.get("category");
    if (category) {
      setActiveCategory(category);
    }
  }, [searchParams]);

  const categories = [
    { name: "Fruits", count: 12 },
    { name: "Vegetables", count: 23 },
    { name: "Bakery", count: 15 },
    { name: "Meat", count: 18 },
  ];

  const trendingItems = [
    {
      name: "Organic Bananas",
      price: 4.99,
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      name: "Fresh Strawberries",
      price: 5.99,
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      name: "Avocado",
      price: 3.99,
      image: "/placeholder.svg?height=80&width=80",
    },
  ];

  const products = Array.from({ length: 9 }, (_, i) => ({
    id: i + 1,
    name: "Organic Cabbage",
    price: 24.99,
    oldPrice: 29.99,
    rating: 4.5,
    reviews: 23,
    image: "/placeholder.svg?height=200&width=200",
    isNew: i < 3,
    isSale: i >= 6,
    category: categories[i % categories.length].name.toLowerCase(),
  }));

  const filteredProducts = activeCategory
    ? products.filter((product) => product.category === activeCategory)
    : products;

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      {/* Sidebar */}
      <aside className="space-y-6">
        <div className="rounded-xl bg-card p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search products..." className="pl-9" />
          </div>
        </div>

        <div className="rounded-xl bg-card p-4">
          <h3 className="mb-4 text-lg font-semibold">Categories</h3>
          <ul className="space-y-2">
            {categories.map((category) => (
              <li key={category.name}>
                <button
                  className={cn(
                    "flex w-full items-center justify-between py-1 text-sm hover:text-foreground",
                    activeCategory === category.name.toLowerCase()
                      ? "text-foreground font-semibold"
                      : "text-muted-foreground"
                  )}
                  onClick={() => setActiveCategory(category.name.toLowerCase())}
                >
                  <span className="flex items-center gap-2">
                    <ChevronRight className="h-4 w-4" />
                    {category.name}
                  </span>
                  <span>({category.count})</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl bg-card p-4">
          <h3 className="mb-4 text-lg font-semibold">Filter by Price</h3>
          <Slider
            defaultValue={[0, 100]}
            max={100}
            step={1}
            value={priceRange}
            onValueChange={setPriceRange}
            className="mb-4"
          />
          <div className="mb-4 flex items-center justify-between text-sm">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
          <Button className="w-full bg-[#DEB887] text-[#353535] hover:bg-[#DEB887]/90">
            Filter
          </Button>
        </div>

        <div className="rounded-xl bg-card p-4">
          <h3 className="mb-4 text-lg font-semibold">Trending Items</h3>
          <div className="space-y-4">
            {trendingItems.map((item, index) => (
              <div key={index} className="flex gap-3">
                <div className="h-20 w-20 overflow-hidden rounded-lg bg-white dark:bg-[#454545]">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-[#DEB887]">${item.price}</p>
                </div>
              </div>
            ))}
            <Button variant="link" className="w-full text-[#DEB887]">
              View More
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-card p-4">
          <p className="text-sm text-muted-foreground">
            Showing {filteredProducts.length} of {products.length} results
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Grid view"
                onClick={() => setView("grid")}
                className={cn(
                  "rounded-md p-2 hover:bg-muted",
                  view === "grid" && "bg-muted"
                )}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="List view"
                onClick={() => setView("list")}
                className={cn(
                  "rounded-md p-2 hover:bg-muted",
                  view === "list" && "bg-muted"
                )}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
            <Select defaultValue="popularity">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popularity">Sort by popularity</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="newest">Sort by newest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div
          className={cn(
            "grid gap-4",
            view === "grid" ? "sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
          )}
        >
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className={cn(
                "group relative overflow-hidden rounded-xl bg-card p-4 transition-all hover:bg-muted",
                view === "list" && "flex gap-6"
              )}
            >
              <div
                className={cn(
                  "relative",
                  view === "grid" ? "aspect-square" : "aspect-square w-48"
                )}
              >
                {(product.isNew || product.isSale) && (
                  <span
                    className={cn(
                      "absolute left-2 top-2 rounded-full px-2 py-0.5 text-xs font-medium text-white",
                      product.isNew ? "bg-[#96C93D]" : "bg-[#A94442]"
                    )}
                  >
                    {product.isNew ? "NEW" : "SALE"}
                  </span>
                )}
                <div className="absolute right-2 top-2 z-10 flex gap-2">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/30"
                  >
                    <Heart className="h-4 w-4 text-white" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/30"
                  >
                    <Shuffle className="h-4 w-4 text-white" />
                  </Button>
                </div>
                <div className="h-full overflow-hidden rounded-xl bg-white dark:bg-[#454545]">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={200}
                    height={200}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <Button className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/20 text-white backdrop-blur-sm hover:bg-black/30">
                  Quick View
                </Button>
              </div>
              <div
                className={cn(
                  "mt-4 space-y-2",
                  view === "list" && "mt-0 flex-1"
                )}
              >
                <div className="flex items-center gap-1">
                  <div className="flex text-[#DEB887]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-4 w-4",
                          i < Math.floor(product.rating)
                            ? "fill-current"
                            : "fill-none"
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({product.reviews})
                  </span>
                </div>
                <h3 className="font-semibold">{product.name}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-[#DEB887]">
                    ${product.price}
                  </span>
                  <span className="text-sm text-muted-foreground line-through">
                    ${product.oldPrice}
                  </span>
                </div>
                {view === "list" && (
                  <p className="text-sm text-muted-foreground">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-2">
          {[1, 2, 3].map((page) => (
            <Button
              key={page}
              variant={page === 1 ? "default" : "outline"}
              size="icon"
              className={cn(
                page === 1 &&
                  "bg-[#DEB887] text-[#353535] hover:bg-[#DEB887]/90"
              )}
            >
              {page}
            </Button>
          ))}
          <Button variant="outline" size="icon">
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

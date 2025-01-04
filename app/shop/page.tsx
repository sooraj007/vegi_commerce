"use client";

import { Suspense } from "react";
import { ShopFilters } from "@/components/shop/filters";
import { ShopProducts } from "@/components/shop/products";
import { ShopSkeleton } from "@/components/shop/skeleton";
import { Input } from "@/components/ui/input";
import { LayoutGrid, List, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function ShopPage() {
  const [view, setView] = useState<"grid" | "list">("grid");

  return (
    <main className="container space-y-8 py-8">
      <h1 className="text-3xl font-bold">Shop</h1>
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="rounded-xl bg-card p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search products..." className="pl-9" />
            </div>
          </div>
          <ShopFilters />
        </aside>

        {/* Main Content */}
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-card p-4">
            <p className="text-sm text-muted-foreground">
              Showing 9 of 9 results
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setView("grid")}
                  className={cn(
                    "rounded-md p-2 hover:bg-muted",
                    view === "grid" && "bg-muted"
                  )}
                  title="Grid view"
                  aria-label="Switch to grid view"
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setView("list")}
                  className={cn(
                    "rounded-md p-2 hover:bg-muted",
                    view === "list" && "bg-muted"
                  )}
                  title="List view"
                  aria-label="Switch to list view"
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

          <Suspense fallback={<ShopSkeleton />}>
            <ShopProducts />
          </Suspense>
        </div>
      </div>
    </main>
  );
}

"use client";

import { useSearchParams } from "next/navigation";
import { ShopSearch } from "./search";
import { Button } from "@/components/ui/button";
import { Grid2X2, List } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ShopHeader() {
  const searchParams = useSearchParams();
  const total = searchParams.get("total") || "0";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Shop</h1>
        <div className="flex items-center gap-4">
          <div className="flex gap-1">
            <Button variant="outline" size="icon">
              <Grid2X2 className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon">
              <List className="h-5 w-5" />
            </Button>
          </div>
          <Select defaultValue="popularity">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popularity">Sort by popularity</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <ShopSearch />
        <p className="text-sm text-muted-foreground">Showing {total} results</p>
      </div>
    </div>
  );
}

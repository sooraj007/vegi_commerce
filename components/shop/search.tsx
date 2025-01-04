"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";

export function ShopSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const debouncedSearch = useDebounce(search, 300);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  useEffect(() => {
    if (debouncedSearch) {
      router.push(`/shop?${createQueryString("search", debouncedSearch)}`);
    } else {
      router.push("/shop");
    }
  }, [debouncedSearch, router, createQueryString]);

  return (
    <Input
      type="search"
      placeholder="Search products..."
      className="max-w-sm"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  );
}

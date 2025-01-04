"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import Image from "next/image";

interface IconScoutModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (imageUrl: string) => void;
}

interface IconScoutIcon {
  id: string;
  title: string;
  urls: {
    thumb: string;
    download: string;
  };
}

interface IconScoutResponse {
  response: {
    items: IconScoutIcon[];
  };
}

export default function IconScoutModal({
  open,
  onClose,
  onSelect,
}: IconScoutModalProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<IconScoutIcon[]>([]);

  const searchIcons = async () => {
    if (!query.trim()) return;

    try {
      setLoading(true);
      const response = await fetch(
        `/api/iconscout/search?query=${encodeURIComponent(query)}`
      );
      if (!response.ok) throw new Error("Failed to search icons");
      const data: IconScoutResponse = await response.json();
      setResults(data.response.items || []);
    } catch (error) {
      console.error("Error searching icons:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async (iconUrl: string) => {
    onSelect(iconUrl);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Search IconScout Images</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search for icons..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && searchIcons()}
            />
            <Button onClick={searchIcons} disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>
          <div className="grid grid-cols-4 gap-4 max-h-[400px] overflow-y-auto">
            {results.map((icon) => (
              <div
                key={icon.id}
                className="relative aspect-square cursor-pointer group"
                onClick={() => handleSelect(icon.urls.download)}
              >
                <Image
                  src={icon.urls.thumb}
                  alt={icon.title}
                  fill
                  className="rounded-lg object-contain p-2 bg-[#2C2C2C] transition-colors group-hover:bg-[#3C3C3C]"
                />
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

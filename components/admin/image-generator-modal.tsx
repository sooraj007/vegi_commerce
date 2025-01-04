"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Wand2, Loader2 } from "lucide-react";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";

interface ImageGeneratorModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (imageUrl: string) => void;
}

interface GeneratedImage {
  url: string;
}

export default function ImageGeneratorModal({
  open,
  onClose,
  onSelect,
}: ImageGeneratorModalProps) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<GeneratedImage[]>([]);

  const generateImages = async () => {
    if (!prompt.trim()) return;

    try {
      setLoading(true);
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) throw new Error("Failed to generate images");
      const data = await response.json();
      setResults(data.images || []);
    } catch (error) {
      console.error("Error generating images:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (imageUrl: string) => {
    onSelect(imageUrl);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Generate Product Images</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Textarea
              placeholder="Describe the product image you want to generate..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[100px] bg-[#2C2C2C] border-0"
            />
            <Button
              onClick={generateImages}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Wand2 className="h-4 w-4 mr-2" />
              )}
              {loading ? "Generating..." : "Generate Images"}
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4 max-h-[400px] overflow-y-auto">
            {results.map((image, index) => (
              <div
                key={index}
                className="relative aspect-square cursor-pointer group"
                onClick={() => handleSelect(image.url)}
              >
                <Image
                  src={image.url}
                  alt={`Generated image ${index + 1}`}
                  fill
                  className="rounded-lg object-cover transition-all hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

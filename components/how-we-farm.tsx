"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

export default function HowWeFarm() {
  return (
    <section className="mb-16 grid gap-8 rounded-2xl bg-muted p-8 lg:grid-cols-2">
      <div className="relative aspect-video overflow-hidden rounded-xl">
        <Image
          src="/placeholder.svg?height=300&width=500"
          alt="How We Farm"
          fill
          className="object-cover"
        />
        <Button
          size="icon"
          className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30"
        >
          <Play className="h-8 w-8 text-white" fill="white" />
        </Button>
      </div>
      <div className="flex flex-col justify-center space-y-4">
        <h2 className="text-2xl font-bold">How We Farm Organic Products</h2>
        <p className="text-muted-foreground">
          Our organic farming practices prioritize sustainability and
          environmental stewardship. We use natural pest control methods, rotate
          crops to maintain soil health, and avoid synthetic fertilizers and
          pesticides. This ensures that our products are not only healthy for
          consumers but also for the planet.
        </p>
        <Button className="w-fit bg-[#DEB887] text-[#353535] hover:bg-[#DEB887]/90">
          Learn More
        </Button>
      </div>
    </section>
  );
}

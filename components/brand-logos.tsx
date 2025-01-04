"use client";

import Image from "next/image";

export default function BrandLogos() {
  const brands = [
    { name: "Brand 1", logo: "/placeholder.svg?height=60&width=120" },
    { name: "Brand 2", logo: "/placeholder.svg?height=60&width=120" },
    { name: "Brand 3", logo: "/placeholder.svg?height=60&width=120" },
    { name: "Brand 4", logo: "/placeholder.svg?height=60&width=120" },
    { name: "Brand 5", logo: "/placeholder.svg?height=60&width=120" },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container">
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16">
          {brands.map((brand, index) => (
            <div
              key={index}
              className="relative h-12 w-24 opacity-60 transition-opacity hover:opacity-100"
            >
              <Image
                src={brand.logo}
                alt={brand.name}
                fill
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

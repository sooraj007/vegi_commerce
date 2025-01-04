import Image from "next/image";
import Link from "next/link";
import { Apple, Carrot, Cookie, Beef } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Categories() {
  const categories = [
    {
      title: "Fruits",
      image: "/placeholder.svg?height=200&width=200",
      description: "Fresh fruits every day",
      icon: Apple,
      color: "bg-[#96C93D]",
    },
    {
      title: "Vegetables",
      image: "/placeholder.svg?height=200&width=200",
      description: "Fresh Vegetables",
      icon: Carrot,
      color: "bg-[#4B6F44]",
    },
    {
      title: "Bakery",
      image: "/placeholder.svg?height=200&width=200",
      description: "Bread every morning",
      icon: Cookie,
      color: "bg-[#DEB887]",
    },
    {
      title: "Meat",
      image: "/placeholder.svg?height=200&width=200",
      description: "Fresh all the time",
      icon: Beef,
      color: "bg-[#A94442]",
    },
  ];

  return (
    <section className="container py-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Categories</h2>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category, index) => {
          const Icon = category.icon;
          return (
            <Link
              key={index}
              href={`/shop?category=${category.title.toLowerCase()}`}
              className="group relative overflow-hidden rounded-2xl bg-card p-4 transition-all hover:bg-muted"
            >
              <div className="absolute left-4 top-4">
                <div className={`rounded-full ${category.color} p-3`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="mt-14 aspect-square overflow-hidden rounded-xl bg-white dark:bg-[#454545]">
                <Image
                  src={category.image}
                  alt={category.title}
                  width={200}
                  height={200}
                  priority={true}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div className="mt-3">
                <h3 className="text-lg font-semibold">{category.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {category.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

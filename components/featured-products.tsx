"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export default function FeaturedProducts() {
  const { toast, ToastComponent } = useToast();
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Fresh Apples",
      price: 4.99,
      oldPrice: 6.99,
      image: "/placeholder.svg?height=200&width=200",
      category: "Fruits",
      rating: 4.5,
      color: "bg-[#96C93D]",
    },
    {
      id: 2,
      name: "Organic Tomatoes",
      price: 3.99,
      oldPrice: 5.99,
      image: "/placeholder.svg?height=200&width=200",
      category: "Vegetables",
      rating: 4.8,
      color: "bg-[#4B6F44]",
    },
    {
      id: 3,
      name: "Fresh Oranges",
      price: 2.99,
      oldPrice: 4.99,
      image: "/placeholder.svg?height=200&width=200",
      category: "Fruits",
      rating: 4.3,
      color: "bg-[#DEB887]",
    },
    {
      id: 4,
      name: "Green Lettuce",
      price: 3.49,
      oldPrice: 4.99,
      image: "/placeholder.svg?height=200&width=200",
      category: "Vegetables",
      rating: 4.6,
      color: "bg-[#4B6F44]",
    },
  ]);

  const addToCart = (product) => {
    // In a real application, you would update the cart state here
    // For now, we'll just show a toast notification
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <section className="container py-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">All Products</h2>
        <Button
          variant="link"
          className="text-[#DEB887] hover:text-[#DEB887]/90"
        >
          See All
        </Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="group relative overflow-hidden rounded-2xl bg-card p-4 transition-all hover:bg-muted"
          >
            <div className="absolute right-3 top-3 z-10 flex gap-2">
              <Button
                variant="secondary"
                size="icon"
                className="h-9 w-9 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/30"
              >
                <Heart className="h-5 w-5 text-white" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="h-9 w-9 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/30"
                onClick={() => addToCart(product)}
              >
                <ShoppingCart className="h-5 w-5 text-white" />
              </Button>
            </div>
            <Link href={`/product/${product.id}`}>
              <div className="aspect-square overflow-hidden rounded-xl bg-white dark:bg-[#454545]">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={200}
                  height={200}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2">
                  <div className={`rounded-full ${product.color} p-1.5`}>
                    <Star className="h-3 w-3 fill-white text-white" />
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.rating}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {product.category}
                </p>
                <h3 className="font-semibold">{product.name}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-[#DEB887]">
                    ${product.price}
                  </span>
                  <span className="text-sm text-muted-foreground line-through">
                    ${product.oldPrice}
                  </span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
      {ToastComponent}
    </section>
  );
}

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Star, Leaf, Facebook, Twitter, Instagram } from "lucide-react";
import NutritionalValues from "@/components/nutritional-values";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";

interface Product {
  id: string;
  name: string;
  price: number;
  old_price: number | null;
  description: string;
  category_name: string;
  images: Array<{
    id: number;
    image_url: string;
    is_primary: boolean;
  }>;
  nutritional_info?: {
    carbohydrates?: string;
    proteins?: string;
    vitamins?: string;
    minerals?: string;
  };
}

export default function ProductDetails({ productId }: { productId: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState("1KG");
  const { toast } = useToast();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch(`/api/products/${productId}`);
        if (!response.ok) throw new Error("Failed to fetch product");
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
        toast({
          message: "Failed to load product details. Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [productId, toast]);

  const addToCart = () => {
    toast({
      message: `${product?.name} (${quantity}) has been added to your cart.`,
    });
  };

  if (loading) {
    return (
      <section className="mb-16 grid gap-8 lg:grid-cols-2">
        <div className="animate-pulse rounded-2xl bg-muted aspect-square" />
        <div className="space-y-6">
          <div className="h-8 w-3/4 rounded bg-muted" />
          <div className="h-4 w-1/4 rounded bg-muted" />
          <div className="h-4 w-1/3 rounded bg-muted" />
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-muted" />
            <div className="h-4 w-full rounded bg-muted" />
            <div className="h-4 w-2/3 rounded bg-muted" />
          </div>
        </div>
      </section>
    );
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <section className="mb-16 grid gap-8 lg:grid-cols-2">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="relative isolate"
      >
        <Image
          src={
            product.images?.[0]?.image_url &&
            product.images[0].image_url.startsWith("/") &&
            !product.images[0].image_url.includes("undefined") &&
            !product.images[0].image_url.includes("null") &&
            !product.images[0].image_url.includes("products/")
              ? product.images[0].image_url
              : "/placeholder.svg"
          }
          alt={product.name}
          width={400}
          height={400}
          className="h-full w-full object-cover"
          placeholder="blur"
          blurDataURL="/placeholder.svg"
          priority={false}
          onError={() => {
            const target = event?.target as HTMLImageElement;
            if (
              target &&
              target.src !== `${window.location.origin}/placeholder.svg`
            ) {
              target.src = "/placeholder.svg";
            }
          }}
        />
        <motion.div
          initial={{ rotate: -15, scale: 0.8 }}
          animate={{ rotate: [-15, -10, -15], scale: 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        >
          <Leaf className="absolute -left-2 top-0 h-16 w-16 text-[#96C93D]/20" />
        </motion.div>
        <motion.div
          initial={{ rotate: 165, scale: 0.8 }}
          animate={{ rotate: [165, 170, 165], scale: 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        >
          <Leaf className="absolute -bottom-2 -right-2 h-16 w-16 text-[#96C93D]/20" />
        </motion.div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="space-y-6"
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="text-3xl font-bold lg:text-4xl"
        >
          {product.name}
        </motion.h1>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="flex items-center gap-4"
        >
          <div className="flex text-[#DEB887]">
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: 0.5 + i * 0.1 }}
              >
                <Star className="h-5 w-5 fill-current" />
              </motion.div>
            ))}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          className="inline-block rounded-full bg-[#96C93D]/10 px-3 py-1 text-sm font-medium text-[#96C93D]"
        >
          {product.category_name}
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.7 }}
          className="text-muted-foreground"
        >
          {product.description}
        </motion.p>
        {product.nutritional_info && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.8 }}
          >
            <NutritionalValues values={product.nutritional_info} />
          </motion.div>
        )}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.9 }}
          className="flex items-center gap-4"
        >
          <Select value={quantity} onValueChange={setQuantity}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select quantity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1KG">1KG</SelectItem>
              <SelectItem value="2KG">2KG</SelectItem>
              <SelectItem value="5KG">5KG</SelectItem>
            </SelectContent>
          </Select>
          <Button
            size="lg"
            className="bg-[#DEB887] text-[#353535] hover:bg-[#DEB887]/90"
            onClick={addToCart}
          >
            Add to Cart - ${product.price}
          </Button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 1 }}
          className="space-y-2"
        >
          <p className="text-sm text-muted-foreground">
            Tags:{" "}
            <span className="text-foreground">Organic, Healthy, Natural</span>
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Share:</span>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Facebook className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Twitter className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Instagram className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

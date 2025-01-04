"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Leaf, Facebook, Twitter, Instagram } from 'lucide-react'
import NutritionalValues from "@/components/nutritional-values"
import { useToast } from "@/components/ui/use-toast"

export default function ProductDetails({ productId }) {
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState("1KG")
  const { toast } = useToast()

  useEffect(() => {
    // In a real application, you would fetch the product data from an API
    // For now, we'll use mock data
    const mockProduct = {
      id: productId,
      name: "Organic Cabbage",
      price: 24.99,
      oldPrice: 29.99,
      rating: 4.5,
      reviews: 23,
      image: "/placeholder.svg?height=600&width=600",
      category: "Vegetables",
      description: "Experience the pure goodness of nature with our organic cabbage. Packed with essential nutrients and free from harmful chemicals, our cabbage is perfect for health-conscious individuals and families alike.",
    }
    setProduct(mockProduct)
  }, [productId])

  const addToCart = () => {
    // In a real application, you would update the cart state here
    // For now, we'll just show a toast notification
    toast({
      title: "Added to cart",
      description: `${product.name} (${quantity}) has been added to your cart.`,
    })
  }

  if (!product) {
    return <div>Loading...</div>
  }

  return (
    <section className="mb-16 grid gap-8 lg:grid-cols-2">
      <div className="relative isolate">
        <Image
          src={product.image}
          alt={product.name}
          width={600}
          height={600}
          className="relative z-10 rounded-2xl"
        />
        <Leaf className="absolute -left-2 top-0 h-16 w-16 rotate-[-15deg] text-[#96C93D]/20" />
        <Leaf className="absolute -bottom-2 -right-2 h-16 w-16 rotate-[165deg] text-[#96C93D]/20" />
      </div>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold lg:text-4xl">{product.name}</h1>
        <div className="flex items-center gap-4">
          <div className="flex text-[#DEB887]">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${i < Math.floor(product.rating) ? "fill-current" : "fill-none"}`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">({product.reviews} Reviews)</span>
        </div>
        <div className="inline-block rounded-full bg-[#96C93D]/10 px-3 py-1 text-sm font-medium text-[#96C93D]">
          {product.category}
        </div>
        <p className="text-muted-foreground">
          {product.description}
        </p>
        <NutritionalValues />
        <div className="flex items-center gap-4">
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
          <Button size="lg" className="bg-[#DEB887] text-[#353535] hover:bg-[#DEB887]/90" onClick={addToCart}>
            Add to Cart
          </Button>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Tags: <span className="text-foreground">Organic, Healthy, Natural</span>
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
        </div>
      </div>
    </section>
  )
}


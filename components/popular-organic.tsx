"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'

export default function PopularOrganic() {
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 14,
    minutes: 36,
    seconds: 0,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime.seconds > 0) {
          return { ...prevTime, seconds: prevTime.seconds - 1 }
        } else if (prevTime.minutes > 0) {
          return { ...prevTime, minutes: prevTime.minutes - 1, seconds: 59 }
        } else if (prevTime.hours > 0) {
          return { ...prevTime, hours: prevTime.hours - 1, minutes: 59, seconds: 59 }
        } else if (prevTime.days > 0) {
          return { ...prevTime, days: prevTime.days - 1, hours: 23, minutes: 59, seconds: 59 }
        } else {
          clearInterval(timer)
          return prevTime
        }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const products = [
    { name: "Organic Apples", price: 4.99, oldPrice: 6.99, rating: 4.5, image: "/placeholder.svg?height=200&width=200", isNew: true },
    { name: "Fresh Strawberries", price: 3.99, oldPrice: 5.99, rating: 4.8, image: "/placeholder.svg?height=200&width=200", isSale: true },
    { name: "Organic Bananas", price: 2.99, oldPrice: 3.99, rating: 4.2, image: "/placeholder.svg?height=200&width=200" },
    { name: "Green Lettuce", price: 1.99, oldPrice: 2.99, rating: 4.6, image: "/placeholder.svg?height=200&width=200", isSale: true },
  ]

  return (
    <section className="mb-16">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Popular Organic Discount</h2>
          <p className="text-sm text-muted-foreground">Top products with the best discounts</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product, index) => (
          <div key={index} className="group relative overflow-hidden rounded-2xl bg-card p-4 transition-all hover:bg-muted">
            <div className="relative aspect-square overflow-hidden rounded-xl bg-white dark:bg-[#454545]">
              {(product.isNew || product.isSale) && (
                <span className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-xs font-medium text-white ${
                  product.isNew ? "bg-[#96C93D]" : "bg-[#A94442]"
                }`}>
                  {product.isNew ? "NEW" : "SALE"}
                </span>
              )}
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-1">
                <div className="flex text-[#DEB887]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-current" : "fill-none"}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  ({product.rating})
                </span>
              </div>
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
          </div>
        ))}
      </div>
      <div className="mt-8 flex items-center justify-center gap-4 rounded-xl bg-muted p-4">
        <div className="text-center">
          <span className="text-2xl font-bold">{timeLeft.days}</span>
          <p className="text-xs text-muted-foreground">Days</p>
        </div>
        <div className="text-center">
          <span className="text-2xl font-bold">{timeLeft.hours}</span>
          <p className="text-xs text-muted-foreground">Hours</p>
        </div>
        <div className="text-center">
          <span className="text-2xl font-bold">{timeLeft.minutes}</span>
          <p className="text-xs text-muted-foreground">Minutes</p>
        </div>
        <div className="text-center">
          <span className="text-2xl font-bold">{timeLeft.seconds}</span>
          <p className="text-xs text-muted-foreground">Seconds</p>
        </div>
      </div>
    </section>
  )
}


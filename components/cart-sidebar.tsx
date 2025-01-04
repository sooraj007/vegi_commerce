"use client"

import { useState, useEffect } from "react"
import { X, Minus, Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import Image from "next/image"
import Link from "next/link"

interface CartItem {
  id: number
  name: string
  price: number
  oldPrice: number
  quantity: number
  image: string
}

interface CartSidebarProps {
  open: boolean
  onClose: () => void
}

export default function CartSidebar({ open, onClose }: CartSidebarProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  useEffect(() => {
    // In a real application, you would fetch the cart items from a state management solution or API
    // For now, we'll use mock data
    const mockCartItems = [
      {
        id: 1,
        name: "Organic Cabbage",
        price: 24.99,
        oldPrice: 29.99,
        quantity: 1,
        image: "/placeholder.svg?height=80&width=80",
      },
      {
        id: 2,
        name: "Fresh Strawberries",
        price: 18.99,
        oldPrice: 22.99,
        quantity: 2,
        image: "/placeholder.svg?height=80&width=80",
      },
    ]
    setCartItems(mockCartItems)
  }, [])

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const vat = subtotal * 0.05
  const discount = subtotal * 0.15
  const total = subtotal + vat - discount

  const updateQuantity = (id: number, newQuantity: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: Math.max(0, newQuantity) } : item
      )
    )
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader className="space-y-2.5 pr-6">
          <SheetTitle className="text-2xl">Your Cart</SheetTitle>
          <Button
            className="absolute right-4 top-4 h-auto rounded-sm p-0 text-muted-foreground"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </SheetHeader>
        <div className="mt-8 flex h-full flex-col">
          <div className="flex-1 overflow-y-auto">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center gap-4 py-4">
                <div className="h-20 w-20 overflow-hidden rounded-lg bg-muted">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <div className="mt-0.5 space-x-2">
                    <span className="text-sm font-medium text-[#96C93D]">
                      ${item.price.toFixed(2)}
                    </span>
                    <span className="text-sm text-muted-foreground line-through">
                      ${item.oldPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                      <span className="sr-only">Decrease quantity</span>
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                      <span className="sr-only">Increase quantity</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-4 border-t pt-6">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>VAT (5%)</span>
                <span>${vat.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount (15%)</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-semibold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/cart" onClick={onClose}>View Cart</Link>
              </Button>
              <Button className="w-full bg-[#DEB887] text-[#353535] hover:bg-[#DEB887]/90">
                Checkout
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}


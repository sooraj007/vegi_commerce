"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Minus, Plus, X } from 'lucide-react'

interface CartItem {
  id: number
  name: string
  category: string
  price: number
  quantity: number
  image: string
}

export default function CartView() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: "Organic Cabbage",
      category: "Vegetables",
      price: 24.99,
      quantity: 1,
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 2,
      name: "Fresh Strawberries",
      category: "Fruits",
      price: 18.99,
      quantity: 2,
      image: "/placeholder.svg?height=80&width=80",
    },
  ])

  const updateQuantity = (id: number, newQuantity: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item
      )
    )
  }

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id))
  }

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)

  return (
    <div className="space-y-8">
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Photo</th>
              <th className="px-4 py-3 text-left font-medium">Product Name</th>
              <th className="px-4 py-3 text-left font-medium">Price</th>
              <th className="px-4 py-3 text-left font-medium">Quantity</th>
              <th className="px-4 py-3 text-left font-medium">Total</th>
              <th className="px-4 py-3 text-left font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="px-4 py-3">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="rounded-md"
                  />
                </td>
                <td className="px-4 py-3">
                  <p className="font-semibold">{item.name}</p>
                  <Link href={`/category/${item.category.toLowerCase()}`} className="text-sm text-[#96C93D] hover:underline">
                    Shop {item.category}
                  </Link>
                </td>
                <td className="px-4 py-3">${item.price.toFixed(2)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                      className="h-8 w-16 text-center"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </td>
                <td className="px-4 py-3 font-semibold text-[#96C93D]">
                  ${(item.price * item.quantity).toFixed(2)}
                </td>
                <td className="px-4 py-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(item.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Input placeholder="Coupon code" className="w-auto" />
          <Button className="bg-[#DEB887] text-[#353535] hover:bg-[#DEB887]/90">
            Apply Coupon
          </Button>
        </div>
        <Button variant="outline">Update Cart</Button>
      </div>

      <div className="flex justify-end">
        <div className="w-full max-w-sm space-y-4 rounded-lg border p-6">
          <h2 className="text-xl font-semibold">Cart Total</h2>
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-t pt-4 font-semibold">
            <span>Total</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <Button className="w-full bg-[#DEB887] text-[#353535] hover:bg-[#DEB887]/90" asChild>
            <Link href="/checkout">Proceed to Checkout</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}


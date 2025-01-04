"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";

interface CartItem {
  id: string;
  product_id: string;
  name: string;
  price: number;
  old_price: number | null;
  quantity: number;
  category_name: string;
  images: Array<{
    id: number;
    image_url: string;
    is_primary: boolean;
  }>;
}

export default function CartView() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { data: session } = useSession();

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/cart");
      if (!response.ok) throw new Error("Failed to fetch cart items");
      const data = await response.json();
      setCartItems(data);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      toast({
        message: "Failed to load cart items. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user) {
      fetchCartItems();
    }
  }, [session?.user]);

  const updateQuantity = async (id: string, newQuantity: number) => {
    try {
      const response = await fetch(`/api/cart/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (!response.ok) throw new Error("Failed to update cart item");

      // Optimistically update the UI
      setCartItems((items) =>
        items
          .map((item) =>
            item.id === id ? { ...item, quantity: newQuantity } : item
          )
          .filter((item) => item.quantity > 0)
      );

      // Refetch to ensure data consistency
      fetchCartItems();
    } catch (error) {
      console.error("Error updating cart item:", error);
      toast({
        message: "Failed to update cart item. Please try again later.",
      });
      // Revert optimistic update by refetching
      fetchCartItems();
    }
  };

  const removeItem = async (id: string) => {
    try {
      const response = await fetch(`/api/cart/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to remove cart item");

      // Optimistically update the UI
      setCartItems((items) => items.filter((item) => item.id !== id));

      // Refetch to ensure data consistency
      fetchCartItems();
    } catch (error) {
      console.error("Error removing cart item:", error);
      toast({
        message: "Failed to remove cart item. Please try again later.",
      });
      // Revert optimistic update by refetching
      fetchCartItems();
    }
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  if (!session?.user) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-muted-foreground">
          Please sign in to view your cart
        </p>
        <Button className="mt-4" asChild>
          <Link href="/auth/signin">Sign In</Link>
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!cartItems.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-muted-foreground">Your cart is empty</p>
        <Button className="mt-4" asChild>
          <Link href="/shop">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

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
                    src={
                      item.images?.[0]?.image_url &&
                      item.images[0].image_url.startsWith("/") &&
                      !item.images[0].image_url.includes("undefined") &&
                      !item.images[0].image_url.includes("null")
                        ? item.images[0].image_url
                        : "/placeholder.svg"
                    }
                    alt={item.name}
                    width={80}
                    height={80}
                    className="rounded-md"
                  />
                </td>
                <td className="px-4 py-3">
                  <p className="font-semibold">{item.name}</p>
                  <Link
                    href={`/shop?category=${item.category_name.toLowerCase()}`}
                    className="text-sm text-[#96C93D] hover:underline"
                  >
                    Shop {item.category_name}
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
                      onChange={(e) =>
                        updateQuantity(item.id, parseInt(e.target.value))
                      }
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
        <Button variant="outline" onClick={fetchCartItems}>
          Update Cart
        </Button>
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
          <Button
            className="w-full bg-[#DEB887] text-[#353535] hover:bg-[#DEB887]/90"
            asChild
          >
            <Link href="/checkout">Proceed to Checkout</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

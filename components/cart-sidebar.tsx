"use client";

import { useState, useEffect } from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";

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

interface CartSidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function CartSidebar({ open, onClose }: CartSidebarProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const { toast } = useToast();

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
    if (session?.user && open) {
      fetchCartItems();
    }
  }, [session?.user, open]);

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

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const vat = subtotal * 0.05;
  const discount = subtotal * 0.15;
  const total = subtotal + vat - discount;

  if (!session?.user) {
    return (
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle className="text-2xl">Your Cart</SheetTitle>
          </SheetHeader>
          <div className="mt-8 flex h-full flex-col items-center justify-center">
            <p className="text-muted-foreground">
              Please sign in to view your cart
            </p>
            <Button className="mt-4" asChild>
              <Link href="/auth/signin">Sign In</Link>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="text-2xl">Your Cart</SheetTitle>
        </SheetHeader>
        <div className="mt-8 flex h-full flex-col">
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <p className="text-muted-foreground">Your cart is empty</p>
                <Button className="mt-4" onClick={onClose} asChild>
                  <Link href="/shop">Continue Shopping</Link>
                </Button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4 py-4">
                  <div className="h-20 w-20 overflow-hidden rounded-lg bg-muted">
                    <Image
                      src={
                        item.images?.[0]?.image_url &&
                        item.images[0].image_url.startsWith("/") &&
                        !item.images[0].image_url.includes("undefined") &&
                        !item.images[0].image_url.includes("null") &&
                        !item.images[0].image_url.includes("products/")
                          ? item.images[0].image_url
                          : "/placeholder.svg"
                      }
                      alt={item.name}
                      width={80}
                      height={80}
                      className="h-full w-full object-cover"
                      placeholder="blur"
                      blurDataURL="/placeholder.svg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (
                          target &&
                          target.src !==
                            `${window.location.origin}/placeholder.svg`
                        ) {
                          target.src = "/placeholder.svg";
                        }
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <div className="mt-0.5 space-x-2">
                      <span className="text-sm font-medium text-[#96C93D]">
                        ${item.price.toFixed(2)}
                      </span>
                      {item.old_price && (
                        <span className="text-sm text-muted-foreground line-through">
                          ${item.old_price.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                      >
                        <Minus className="h-3 w-3" />
                        <span className="sr-only">Decrease quantity</span>
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        <Plus className="h-3 w-3" />
                        <span className="sr-only">Increase quantity</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          {cartItems.length > 0 && (
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
                  <Link href="/cart" onClick={onClose}>
                    View Cart
                  </Link>
                </Button>
                <Button
                  className="w-full bg-[#DEB887] text-[#353535] hover:bg-[#DEB887]/90"
                  asChild
                >
                  <Link href="/checkout" onClick={onClose}>
                    Checkout
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

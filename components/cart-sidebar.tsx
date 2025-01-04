"use client";

import { Minus, Plus, X } from "lucide-react";
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
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/cart-context";
import { useState } from "react";

interface CartSidebarProps {
  open: boolean;
  onClose: () => void;
}

function AnimatedCounter({ value }: { value: number }) {
  return (
    <div className="relative w-8 h-8 flex items-center justify-center">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={value}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="absolute"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

export default function CartSidebar({ open, onClose }: CartSidebarProps) {
  const { data: session } = useSession();
  const { items: cartItems, updateQuantity, removeItem } = useCart();
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set());
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (updatingItems.has(itemId)) return;

    try {
      setUpdatingItems((prev) => new Set(prev).add(itemId));
      if (newQuantity <= 0) {
        await handleRemoveItem(itemId);
      } else {
        await updateQuantity(itemId, newQuantity);
      }
    } finally {
      setUpdatingItems((prev) => {
        const next = new Set(prev);
        next.delete(itemId);
        return next;
      });
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    if (removingItems.has(itemId)) return;

    try {
      setRemovingItems((prev) => new Set(prev).add(itemId));
      await removeItem(itemId);
    } finally {
      setRemovingItems((prev) => {
        const next = new Set(prev);
        next.delete(itemId);
        return next;
      });
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
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
          </motion.div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="flex h-full flex-col"
        >
          <SheetHeader>
            <SheetTitle className="text-2xl">Your Cart</SheetTitle>
          </SheetHeader>
          <div className="mt-8 flex flex-1 flex-col">
            <div
              className="flex-1 overflow-y-auto px-6"
              style={{
                height: "calc(100vh - 250px)",
                overflowY: "auto",
                scrollbarGutter: "stable",
              }}
            >
              {cartItems.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="flex h-full flex-col items-center justify-center"
                >
                  <p className="text-muted-foreground">Your cart is empty</p>
                  <Button className="mt-4" onClick={onClose} asChild>
                    <Link href="/shop">Continue Shopping</Link>
                  </Button>
                </motion.div>
              ) : (
                <AnimatePresence initial={false}>
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                      animate={{
                        opacity: 1,
                        height: "auto",
                        marginBottom: "1rem",
                      }}
                      exit={{
                        opacity: 0,
                        height: 0,
                        marginBottom: 0,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                        opacity: { duration: 0.2 },
                      }}
                      className="flex items-center gap-4 border-b border-gray-800 pb-4"
                      style={{
                        opacity: removingItems.has(item.id) ? 0.5 : 1,
                        pointerEvents: removingItems.has(item.id)
                          ? "none"
                          : "auto",
                      }}
                    >
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
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between">
                          <div>
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
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full hover:bg-red-500/10 hover:text-red-500"
                            onClick={() => handleRemoveItem(item.id)}
                            disabled={removingItems.has(item.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity - 1)
                            }
                            disabled={updatingItems.has(item.id)}
                          >
                            <Minus className="h-3 w-3" />
                            <span className="sr-only">Decrease quantity</span>
                          </Button>
                          <AnimatedCounter value={item.quantity} />
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity + 1)
                            }
                            disabled={updatingItems.has(item.id)}
                          >
                            <Plus className="h-3 w-3" />
                            <span className="sr-only">Increase quantity</span>
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
            {cartItems.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="space-y-4 border-t px-6 py-4"
              >
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
                  <div className="flex justify-between border-t pt-2 text-base font-semibold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
                <Button
                  className="w-full bg-[#DEB887] text-[#353535] hover:bg-[#DEB887]/90"
                  asChild
                >
                  <Link href="/checkout" onClick={onClose}>
                    Proceed to Checkout
                  </Link>
                </Button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </SheetContent>
    </Sheet>
  );
}

"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
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

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  addToCart: (productId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const { data: session } = useSession();

  const refreshCart = async () => {
    if (session?.user) {
      try {
        const response = await fetch("/api/cart");
        if (!response.ok) throw new Error("Failed to fetch cart");
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    } else {
      setItems([]);
    }
  };

  useEffect(() => {
    refreshCart();
  }, [session?.user]);

  const addToCart = async (productId: string) => {
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      if (!response.ok) throw new Error("Failed to add item to cart");
      await refreshCart();
    } catch (error) {
      console.error("Error adding item to cart:", error);
      throw error;
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    // Optimistically update the UI
    const oldItems = [...items];
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );

    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });

      if (!response.ok) throw new Error("Failed to update cart item");
      await refreshCart();
    } catch (error) {
      console.error("Error updating cart item:", error);
      // Revert to old state if there's an error
      setItems(oldItems);
      throw error;
    }
  };

  const removeItem = async (itemId: string) => {
    // Optimistically update the UI
    const oldItems = [...items];
    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== itemId)
    );

    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to remove cart item");
      // No need to refresh cart here since we've already removed the item
    } catch (error) {
      console.error("Error removing cart item:", error);
      // Revert to old state if there's an error
      setItems(oldItems);
      throw error;
    }
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        addToCart,
        updateQuantity,
        removeItem,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

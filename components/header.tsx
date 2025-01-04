"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, MapPin, ShoppingCart, User, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeSwitcher } from "@/components/theme-switcher";
import CartSidebar from "@/components/cart-sidebar";
import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [cartOpen, setCartOpen] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();
  const { itemCount } = useCart();

  const isActive = (path: string) => {
    if (path === "/") return pathname === path;
    return pathname.startsWith(path);
  };

  const menuItems = [
    { path: "/", label: "Home" },
    { path: "/shop", label: "Shop" },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container flex h-16 items-center justify-between gap-4">
        <div className="flex items-center ">
          <Sheet>
            <SheetTrigger asChild>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </motion.div>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4">
                {menuItems.map(({ path, label }, index) => (
                  <motion.div
                    key={path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={path}
                      className={cn(
                        "text-lg font-semibold",
                        isActive(path)
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Link href="/" className="flex items-center gap-2 lg:gap-3">
              <span className="text-xl font-bold lg:text-2xl">FreshMart</span>
            </Link>
          </motion.div>
        </div>
        <nav className="hidden lg:flex lg:gap-6">
          {menuItems.map(({ path, label }, index) => (
            <motion.div
              key={path}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={path}
                className={cn(
                  "text-sm font-medium",
                  isActive(path)
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {label}
              </Link>
            </motion.div>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="hidden items-center gap-8 lg:flex"
          >
            <motion.div
              whileHover={{ y: -2 }}
              className="flex items-center gap-2"
            >
              <MapPin className="h-5 w-5 text-[#96C93D]" />
              <span className="text-sm">New York</span>
            </motion.div>
            <motion.div
              whileHover={{ y: -2 }}
              className="flex items-center gap-2"
            >
              <Phone className="h-5 w-5 text-[#96C93D]" />
              <span className="text-sm">+1 234 567 890</span>
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="relative flex items-center"
          >
            <Input
              type="search"
              placeholder="Search products..."
              className="w-[300px] rounded-full pr-12"
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full hover:bg-muted"
            >
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </motion.button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <ThemeSwitcher />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-2"
          >
            {session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                      <span className="sr-only">User menu</span>
                    </Button>
                  </motion.div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem disabled>
                    {session.user.email}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {session.user.role === "admin" && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/admin">Admin Dashboard</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem
                    onClick={() => signOut({ callbackUrl: "/" })}
                  >
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button variant="ghost" size="icon" onClick={() => signIn()}>
                  <User className="h-5 w-5" />
                  <span className="sr-only">Sign in</span>
                </Button>
              </motion.div>
            )}
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="relative"
          >
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                className="s-cart-icon"
                variant="ghost"
                size="icon"
                onClick={() => setCartOpen(true)}
              >
                <ShoppingCart className="cart-icon h-5 w-5" />
                <span className="sr-only">Open cart</span>
                <AnimatePresence mode="wait">
                  {itemCount > 0 && (
                    <motion.span
                      key={itemCount}
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{
                        scale: 1,
                        opacity: 1,
                      }}
                      exit={{
                        scale: 0.6,
                        opacity: 0,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 25,
                        mass: 0.5,
                      }}
                      className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#96C93D] text-xs font-medium text-white"
                    >
                      {itemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          </motion.div>
          <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />
        </div>
      </div>
    </motion.header>
  );
}

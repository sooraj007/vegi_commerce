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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4">
                {menuItems.map(({ path, label }) => (
                  <Link
                    key={path}
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
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center gap-2 lg:gap-3">
            <span className="text-xl font-bold lg:text-2xl">FreshMart</span>
          </Link>
        </div>
        <nav className="hidden lg:flex lg:gap-6">
          {menuItems.map(({ path, label }) => (
            <Link
              key={path}
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
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-8 lg:flex">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-[#96C93D]" />
              <span className="text-sm">New York</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-[#96C93D]" />
              <span className="text-sm">+1 234 567 890</span>
            </div>
          </div>
          <div className="relative flex items-center">
            <Input
              type="search"
              placeholder="Search products..."
              className="w-[300px] rounded-full pr-12"
            />
            <Button
              type="submit"
              size="icon"
              variant="ghost"
              className="absolute right-0 rounded-l-none rounded-r-full"
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          </div>
          <ThemeSwitcher />
          <div className="flex items-center gap-2">
            {session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                    <span className="sr-only">User menu</span>
                  </Button>
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
              <Button variant="ghost" size="icon" onClick={() => signIn()}>
                <User className="h-5 w-5" />
                <span className="sr-only">Sign in</span>
              </Button>
            )}
          </div>
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Open cart</span>
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#96C93D] text-xs font-medium text-white">
                  {itemCount}
                </span>
              )}
            </Button>
          </div>
          <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />
        </div>
      </div>
    </header>
  );
}

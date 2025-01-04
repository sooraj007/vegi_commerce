"use client";

import Link from "next/link";
import { Search, Menu, MapPin, ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeSwitcher } from "@/components/theme-switcher";
import CartSidebar from "@/components/cart-sidebar";
import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
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
                <Link href="/" className="text-lg font-semibold">
                  Home
                </Link>
                <Link href="/shop" className="text-lg font-semibold">
                  Shop
                </Link>
                <Link href="/about" className="text-lg font-semibold">
                  About
                </Link>

                <Link href="/contact" className="text-lg font-semibold">
                  Contact
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center gap-2 lg:gap-3">
            <span className="text-xl font-bold lg:text-2xl">FreshMart</span>
          </Link>
        </div>
        <nav className="hidden gap-6 lg:flex">
          <Link href="/" className="text-sm font-medium text-foreground">
            Home
          </Link>
          <Link
            href="/shop"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Shop
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            About
          </Link>

          <Link
            href="/contact"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Contact
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-4 lg:flex">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>New York</span>
            </div>
            <span className="text-muted-foreground">|</span>
            <a
              href="tel:+1234567890"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              +1 234 567 890
            </a>
          </div>
          <div className="flex items-center gap-4">
            <form className="relative hidden lg:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="w-[200px] pl-8"
              />
            </form>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
            <ThemeSwitcher />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {session ? (
                  <>
                    <DropdownMenuItem className="text-sm">
                      Signed in as {session.user?.email}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {session.user?.role === "admin" && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin">Dashboard</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <Link href="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/orders">Orders</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut()}>
                      Sign Out
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem onClick={() => signIn()}>
                      Sign In
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/register">Register</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setCartOpen(true)}>
            <ShoppingCart className="h-5 w-5" />
            <span className="sr-only">Open cart</span>
          </Button>
          <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />
        </div>
      </div>
    </header>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "@/components/session-provider";
import { CartProvider } from "@/lib/cart-context";
import { Toaster } from "sonner";
import Header from "@/components/header";
import Footer from "@/components/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FreshMart - Fresh Organic Food",
  description: "Your one-stop shop for fresh organic produce",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <CartProvider>
              <Header />
              {children}
              <Footer />
              <Toaster />
            </CartProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

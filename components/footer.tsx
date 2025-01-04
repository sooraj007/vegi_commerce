import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Footer() {
  return (
    <footer className="mt-auto border-t bg-card">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-semibold">About Us</h3>
            <p className="text-sm text-muted-foreground">
              We are committed to providing the freshest organic produce to our
              customers, sourced directly from local farmers.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Menu</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="/" className="hover:text-foreground">
                  Home
                </a>
              </li>
              <li>
                <a href="/shop" className="hover:text-foreground">
                  Shop
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-foreground">
                  About
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-foreground">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Help</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="/faq" className="hover:text-foreground">
                  FAQs
                </a>
              </li>
              <li>
                <a href="/terms" className="hover:text-foreground">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="/privacy" className="hover:text-foreground">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Newsletter</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Subscribe to receive updates and special offers
            </p>
            <div className="space-y-2">
              <Input type="email" placeholder="Enter your email" />
              <Button className="w-full bg-[#DEB887] text-[#353535] hover:bg-[#DEB887]/90">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t">
        <div className="container py-4">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} FreshMart. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}


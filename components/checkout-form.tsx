"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

export default function CheckoutForm() {
  const [shippingDifferent, setShippingDifferent] = useState(false)

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Billing Details Section */}
      <div>
        <h2 className="mb-6 text-2xl font-bold">Billing Details</h2>
        <form className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Select defaultValue="france">
              <SelectTrigger>
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="france">France</SelectItem>
                <SelectItem value="germany">Germany</SelectItem>
                <SelectItem value="italy">Italy</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="streetAddress">Street Address</Label>
            <Input id="streetAddress" placeholder="House number and street name" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="apartment">Apartment, suite, unit, etc. (optional)</Label>
            <Input id="apartment" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="city">Town/City</Label>
              <Input id="city" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postcode">Postcode/ZIP</Label>
              <Input id="postcode" required />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" type="tel" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" required />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="createAccount" />
              <Label htmlFor="createAccount">Create an account?</Label>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="shipDifferent" 
                checked={shippingDifferent}
                onCheckedChange={(checked) => setShippingDifferent(checked as boolean)}
              />
              <Label htmlFor="shipDifferent">Ship to a different address?</Label>
            </div>
          </div>
          {shippingDifferent && (
            <div className="space-y-4 rounded-lg border p-4">
              <h3 className="text-lg font-semibold">Shipping Address</h3>
              {/* Add shipping address fields here, similar to billing fields */}
            </div>
          )}
        </form>
      </div>

      {/* Cart Summary and Payment Section */}
      <div className="space-y-8">
        <div className="rounded-lg border p-6">
          <h2 className="mb-4 text-xl font-bold">Cart Total</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>$43.98</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between">
              <span>Discount</span>
              <span>-$6.60</span>
            </div>
            <div className="flex justify-between border-t pt-2 text-lg font-bold">
              <span>TOTAL</span>
              <span>$37.38</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border p-6">
          <h2 className="mb-4 text-xl font-bold">Payment Method</h2>
          <RadioGroup defaultValue="bank-transfer" className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="bank-transfer" id="bank-transfer" />
              <Label htmlFor="bank-transfer">Direct Bank Transfer</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="check" id="check" />
              <Label htmlFor="check">Check Payment</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="paypal" id="paypal" />
              <Label htmlFor="paypal">PayPal</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" required />
            <Label htmlFor="terms">I have read and accept the terms and conditions</Label>
          </div>
          <Button className="w-full bg-[#DEB887] text-[#353535] hover:bg-[#DEB887]/90">
            Place an order
          </Button>
        </div>
      </div>
    </div>
  )
}


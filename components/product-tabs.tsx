"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ProductTabs() {
  const [activeTab, setActiveTab] = useState("description")

  return (
    <section className="mb-16">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start rounded-none border-b">
          <TabsTrigger value="description" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#DEB887]">
            Description
          </TabsTrigger>
          <TabsTrigger value="additional" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#DEB887]">
            Additional Information
          </TabsTrigger>
          <TabsTrigger value="reviews" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#DEB887]">
            Reviews (3)
          </TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="mt-6">
          <h3 className="mb-4 text-xl font-semibold">Product Description</h3>
          <p className="mb-4 text-muted-foreground">
            Our organic products are the result of careful cultivation and sustainable farming practices. Grown without the use of synthetic pesticides or fertilizers, these products offer a pure and natural taste that's true to their origins.
          </p>
          <p className="text-muted-foreground">
            Rich in nutrients and full of flavor, our organic offerings are perfect for health-conscious consumers who don't want to compromise on taste. Whether you're preparing a family meal or a quick snack, our products provide the foundation for delicious and nutritious eating.
          </p>
        </TabsContent>
        <TabsContent value="additional" className="mt-6">
          <h3 className="mb-4 text-xl font-semibold">Additional Information</h3>
          <ul className="list-inside list-disc space-y-2 text-muted-foreground">
            <li>100% Certified Organic</li>
            <li>Non-GMO</li>
            <li>Pesticide-free</li>
            <li>Sustainably farmed</li>
            <li>Harvested at peak ripeness</li>
          </ul>
        </TabsContent>
        <TabsContent value="reviews" className="mt-6">
          <h3 className="mb-4 text-xl font-semibold">Customer Reviews</h3>
          <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
        </TabsContent>
      </Tabs>
    </section>
  )
}


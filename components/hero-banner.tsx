import { Button } from "@/components/ui/button"

export default function HeroBanner() {
  return (
    <section className="container py-8">
      <div className="relative overflow-hidden rounded-[--radius] bg-secondary px-6 py-16 md:px-12 md:py-24">
        <div className="relative z-10 mx-auto max-w-2xl text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            Fresh & Organic Foods For Your Health
          </h1>
          <p className="mb-8 text-lg text-muted-foreground md:text-xl">
            Discover nature's finest selection of fresh, organic produce delivered right to your doorstep
          </p>
          <Button size="lg" className="bg-[#DEB887] text-[#353535] hover:bg-[#DEB887]/90">
            Shop Now
          </Button>
        </div>
      </div>
    </section>
  )
}


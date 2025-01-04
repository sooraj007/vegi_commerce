"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Clock, Percent } from 'lucide-react'

export default function DealOfDay() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      const endOfDay = new Date()
      endOfDay.setHours(23, 59, 59, 999)
      const diff = endOfDay.getTime() - now.getTime()

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <section className="container py-16">
      <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#DEB887]/20 via-background to-[#DEB887]/20 p-1">
        <div className="rounded-[2.75rem] bg-card backdrop-blur-sm">
          <div className="grid gap-8 p-6 lg:grid-cols-2 lg:p-8">
            <div className="flex flex-col justify-center">
              <div className="mb-6">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#DEB887]/10 px-3 py-1 text-sm text-[#DEB887]">
                  <Clock className="h-4 w-4" />
                  <span>Limited Time Offer</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-[#A94442] p-2">
                    <Percent className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold">30% OFF</h2>
                </div>
                <p className="mt-2 text-lg text-muted-foreground">
                  for all Apples
                </p>
              </div>
              <div className="mb-8 flex gap-3">
                <div className="rounded-xl bg-background p-3 text-center">
                  <span className="block text-2xl font-bold">{timeLeft.days}</span>
                  <span className="text-sm text-muted-foreground">Days</span>
                </div>
                <div className="rounded-xl bg-background p-3 text-center">
                  <span className="block text-2xl font-bold">{timeLeft.hours}</span>
                  <span className="text-sm text-muted-foreground">Hours</span>
                </div>
                <div className="rounded-xl bg-background p-3 text-center">
                  <span className="block text-2xl font-bold">
                    {timeLeft.minutes}
                  </span>
                  <span className="text-sm text-muted-foreground">Minutes</span>
                </div>
                <div className="rounded-xl bg-background p-3 text-center">
                  <span className="block text-2xl font-bold">
                    {timeLeft.seconds}
                  </span>
                  <span className="text-sm text-muted-foreground">Seconds</span>
                </div>
              </div>
              <Button
                size="lg"
                className="w-fit bg-[#DEB887] text-[#353535] hover:bg-[#DEB887]/90 transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                Get Offer Now
              </Button>
            </div>
            <div className="relative aspect-square lg:aspect-auto">
              <Image
                src="/placeholder.svg?height=400&width=400"
                alt="Deal of the day"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


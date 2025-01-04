"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Leaf } from "lucide-react";

export default function HeroBanner() {
  return (
    <section className="container py-8">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative overflow-hidden rounded-[--radius] bg-secondary px-6 py-16 md:px-12 md:py-24"
      >
        {/* Decorative leaves */}
        <motion.div
          initial={{ rotate: -15, scale: 0.8, opacity: 0 }}
          animate={{ rotate: [-15, -10, -15], scale: 1, opacity: 0.2 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 0.5,
          }}
          className="absolute left-4 top-4"
        >
          <Leaf className="h-24 w-24 text-[#96C93D]" />
        </motion.div>
        <motion.div
          initial={{ rotate: 165, scale: 0.8, opacity: 0 }}
          animate={{ rotate: [165, 170, 165], scale: 1, opacity: 0.2 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 0.7,
          }}
          className="absolute bottom-4 right-4"
        >
          <Leaf className="h-24 w-24 text-[#96C93D]" />
        </motion.div>

        <div className="relative z-10 mx-auto max-w-2xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl"
          >
            Fresh & Organic Foods For Your Health
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8 text-lg text-muted-foreground md:text-xl"
          >
            Discover nature&apos;s finest selection of fresh, organic produce
            delivered right to your doorstep
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              size="lg"
              className="bg-[#DEB887] text-[#353535] hover:bg-[#DEB887]/90"
            >
              Shop Now
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

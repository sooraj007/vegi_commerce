"use client";

import { Truck, Leaf, Award, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function Features() {
  const features = [
    {
      icon: Truck,
      title: "Free Shipping",
      description: "On orders over $100",
    },
    {
      icon: Leaf,
      title: "Always Fresh",
      description: "100% organic products",
    },
    {
      icon: Award,
      title: "Superior Quality",
      description: "Best quality products",
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Customer support",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="py-16 bg-gray-50">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container grid gap-8 md:grid-cols-2 lg:grid-cols-4"
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
            }}
            className="flex items-center gap-4 p-6 bg-white rounded-lg shadow-sm"
          >
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <feature.icon className="h-10 w-10 text-orange-500" />
            </motion.div>
            <div>
              <motion.h3
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.2 }}
                className="font-semibold"
              >
                {feature.title}
              </motion.h3>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.2 }}
                className="text-sm text-gray-500"
              >
                {feature.description}
              </motion.p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

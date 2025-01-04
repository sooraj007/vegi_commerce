"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface TransitionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function Transition({
  children,
  className = "",
  delay = 0,
}: TransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

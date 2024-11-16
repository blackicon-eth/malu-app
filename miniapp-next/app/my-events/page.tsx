"use client";
import { motion } from "framer-motion";
import { staggerVariant } from "@/lib/motion-variants";

export default function MyEvents() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <motion.main
        className="container mx-auto px-4 pb-24 space-y-8"
        initial="initial"
        animate="animate"
        variants={staggerVariant}
      >
        test page
      </motion.main>
    </div>
  );
}

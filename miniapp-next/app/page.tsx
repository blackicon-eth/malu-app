"use client";
import { SignIn } from "@/components/SignIn";
import { fadeInVariant, staggerVariant } from "@/lib/motion-variants";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <motion.main
      initial="initial"
      animate="animate"
      variants={staggerVariant}
      className="flex min-h-screen h-full items-start justify-center px-10 pt-16"
    >
      <div className="flex flex-col gap-2 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.2 }}
          className="text-4xl font-bold pb-1"
        >
          Welcome to Malu
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.4 }}
          className="text-md text-gray-400 pb-5"
        >
          If you're tired of losing your spot in events because of multi accounts, now you can use Malu!
          <br />
          Thanks to WorldID, we ensure only one ticket per person.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.6 }}
        >
          <SignIn />
        </motion.div>
      </div>
    </motion.main>
  );
}

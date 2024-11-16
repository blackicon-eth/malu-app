"use client";
import { motion } from "framer-motion";
import { fadeInVariant, staggerVariant } from "@/lib/motion-variants";
import AnchoredButton from "@/components/ui/AnchoredButton";
import { useSession } from "next-auth/react";
import ProfilePicture from "@/components/ui/ProfilePicture";

export default function CreateEventPage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      <motion.main
        className="container mx-auto px-4 space-y-8"
        initial="initial"
        animate="animate"
        variants={staggerVariant}
      >
        {/* Header */}
        <motion.div variants={fadeInVariant} className="flex items-center justify-between">
          <h1 className="text-4xl font-bold">Your Profile</h1>
        </motion.div>

        {/* Profile Image Upload */}
        <motion.div variants={fadeInVariant} className="flex justify-center items-center w-full">
          <ProfilePicture src="/world-logo.png" alt="profilepicture" />
        </motion.div>

        {/* Profile Basic Info */}
        <motion.div variants={fadeInVariant} className="flex flex-col gap-2">
          <h1 className="text-4xl font-semibold text-center">Address</h1>
          <h1 className="text-xl text-center text-gray-400">{session?.user?.name || "Address"}</h1>
        </motion.div>
      </motion.main>

      {/* Create Event Button */}
      <AnchoredButton text="Save Profile" />
    </div>
  );
}

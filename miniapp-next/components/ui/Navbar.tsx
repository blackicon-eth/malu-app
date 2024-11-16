"use client";
import { motion } from "framer-motion";
import { Button } from "./button";
import { Calendar, Layout, MoonStar, Ticket } from "lucide-react";
import { fadeInVariant } from "@/lib/motion-variants";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <motion.div
      variants={fadeInVariant}
      className="z-50 fixed top-0 left-0 right-0 border-t bg-background/80 backdrop-blur-lg md:hidden"
    >
      <nav className="flex items-center justify-between p-3">
        <div className="flex justify-start items-center gap-1">
          <Button variant="ghost" size="icon" className="flex flex-col items-center gap-1">
            <Link href="/my-events">
              <MoonStar size={24} />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className="flex flex-col items-center gap-1">
            <Link href="/my-events">
              <Ticket size={24} />
            </Link>
          </Button>
        </div>

        <div className="flex justify-start items-center gap-1">
          <Button variant="ghost" size="default" className="flex justify-center items-center">
            <Link href="/event/create">Create Event</Link>
          </Button>
          <Button variant="ghost" size="icon" className="flex flex-col items-center gap-1">
            <Link href="/event">
              <Image alt="profile-picture" src="/img_placeholder.jpg" width={24} height={24} className="rounded-full" />
            </Link>
          </Button>
        </div>
      </nav>
    </motion.div>
  );
}

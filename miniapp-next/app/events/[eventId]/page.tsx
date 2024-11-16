"use client";
import { motion } from "framer-motion";
import { Calendar, MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { fadeInVariant, staggerVariant } from "@/lib/motion-variants";
import AnchoredButton from "@/components/ui/AnchoredButton";

export default function EventPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <motion.main
        className="container mx-auto px-4 pb-24 space-y-8"
        initial="initial"
        animate="animate"
        variants={staggerVariant}
      >
        {/* Hero Section */}
        <motion.div variants={fadeInVariant} className="flex flex-col md:flex-row space-y-4 md:space-x-10">
          <Image src="/img_placeholder.jpg" alt="Hacker Hotel" width={400} height={400} className="rounded-lg" />
          <div className="flex flex-col space-y-4">
            <Badge className="bg-pink-600 hover:bg-pink-700 max-w-36">Featured in DevCon</Badge>
            <h1 className="text-4xl md:text-6xl font-bold">Hacker Hotel</h1>
            <p className="text-xl text-muted-foreground">A coliving experiment during DevCon SEA Week</p>

            {/* Event Details */}
            <motion.div variants={fadeInVariant}>
              <Card className="bg-card">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">November 2 - November 30, 2024</p>
                      <p className="text-sm text-muted-foreground">12:00 AM - 12:00 AM</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <p className="font-medium">Bangkok, Thailand</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div variants={fadeInVariant} className="grid md:grid-cols-2 gap-8">
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="text-2xl text-pink-500">Hacker Havens</CardTitle>
              <CardDescription>A decentralized chain of authentic Thai stays</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-pink-500" />
                  <span>Coliving at boutique Thai villas</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-pink-500" />
                  <span>Networking opportunities</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-pink-500" />
                  <span>Value-alignment with cohabitants</span>
                </li>
              </ul>
              <Button className="w-full">Apply for Stay</Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* About Section */}
        <motion.section variants={fadeInVariant} className="space-y-4">
          <h2 className="text-3xl font-bold">About Event</h2>
          <p className="text-muted-foreground">
            Hacker Hotel is a coliving experiment during and after DevCon SEA Week, November 2024 in Bangkok, Thailand.
            Experience the Thai and Buddhist culture through curated activities and workshops while connecting with
            like-minded individuals.
          </p>
        </motion.section>

        {/* Links */}
        <motion.div variants={fadeInVariant} className="flex flex-col sm:flex-row gap-4">
          <Button className="flex items-center gap-2">
            Apply for Waitlist <ExternalLink className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            Learn More <ExternalLink className="h-4 w-4" />
          </Button>
        </motion.div>
      </motion.main>
      {/* Join Event Button */}
      <AnchoredButton
        text="Join this Event"
        onClick={() => {
          return;
        }}
      />
    </div>
  );
}

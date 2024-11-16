"use client";
import { motion } from "framer-motion";
import { MapPin, Clock, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import Link from "next/link";
import { fadeInVariant, staggerVariant } from "@/lib/motion-variants";
import { events } from "@/lib/constants";

// Group events by date
const groupedEvents = events.reduce((acc: { [key: string]: any[] }, event: any) => {
  if (!acc[event.date]) {
    acc[event.date] = [];
  }
  acc[event.date].push(event);
  return acc;
}, {});

export default function EventsList() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <motion.main
        className="container mx-auto px-4 pb-12 space-y-6"
        initial="initial"
        animate="animate"
        variants={staggerVariant}
      >
        {/* Header */}
        <motion.div variants={fadeInVariant} className="flex items-center justify-between">
          <h1 className="text-4xl font-bold">Events</h1>
          <Tabs defaultValue="upcoming" className="flex">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>

        {/* Events Timeline */}
        <motion.div variants={fadeInVariant} className="relative space-y-8">
          {Object.entries(groupedEvents).map(([date, events]) => (
            <div key={date} className="space-y-4">
              <div className="text-lg font-semibold">{date}</div>
              {/* Timeline */}
              <div className="flex flex-row gap-3">
                <div className="flex flex-col items-center justify-center px-3">
                  <div className="flex w-2 h-2 rounded-full bg-primary" />
                  <div className="flex w-px border-l h-full border-dashed border-muted-foreground/50" />
                </div>
                <div className="flex flex-col gap-3">
                  {events.map((event: any) => (
                    <div key={event.id} className="flex">
                      {/* Event Card */}
                      <Link href={`/events/${event.id}`} className="flex flex-col">
                        <Card className="overflow-hidden hover:bg-accent/50 transition-colors">
                          <div className="p-4 flex gap-4">
                            <div className="flex-1 space-y-4">
                              {/* Status and Time */}
                              <div className="flex items-center gap-2">
                                {event.isLive && (
                                  <Badge variant="destructive" className="bg-orange-500 hover:bg-orange-600">
                                    LIVE
                                  </Badge>
                                )}
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  <Clock className="h-4 w-4" />
                                  <span>{event.time}</span>
                                </div>
                              </div>

                              {/* Title */}
                              <h2 className="text-2xl font-semibold">{event.title}</h2>

                              {/* Organizer */}
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <User className="h-4 w-4" />
                                <span>By {event.organizer}</span>
                              </div>

                              {/* Location */}
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                <span>{event.location}</span>
                              </div>

                              {/* Status Badge */}
                              <Badge className="mt-2">{event.status}</Badge>
                            </div>

                            {/* Event Image */}
                            <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                              <Image src="/img_placeholder.jpg" alt={event.title} fill className="object-cover" />
                            </div>
                          </div>
                        </Card>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </motion.main>
    </div>
  );
}

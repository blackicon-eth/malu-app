"use client";

import { motion } from "framer-motion";
import { MapPin, Clock, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import Link from "next/link";
import { fadeInVariant, staggerVariant } from "@/lib/motion-variants";
import { blockOfDeployment, maluAddress } from "@/lib/constants";
import { ethers } from 'ethers';
import { SetStateAction, useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
import { MiniKit } from "@worldcoin/minikit-js";

export default function EventsList() {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUpcoming, setShowUpcoming] = useState(true);
  const [allEvents, setAllEvents] = useState<any[]>([]);
  const { data: session } = useSession();
  // Initial fetch of all events
  useEffect(() => {
    const fetchAllEvents = async () => {
      try {
        setIsLoading(true);
        const provider = new ethers.providers.JsonRpcProvider("https://worldchain-mainnet.g.alchemy.com/public");
        const eventTicketAcquiredSignature = "TicketAcquired(address,uint256,(address,string,string,string,string,string,string,uint256,uint256,uint256,uint256,bool))";
        const eventAcquiredTopic = ethers.utils.id(eventTicketAcquiredSignature);
        
        const startBlock = blockOfDeployment;
        const endBlock = await provider.getBlockNumber();
        const range = 50000;
        let fetchedEvents: SetStateAction<any[]> = [];

        for (let fromBlock = startBlock; fromBlock < endBlock; fromBlock += range) {
          const toBlock = Math.min(fromBlock + range - 1, endBlock);
          console.log(`Fetching logs from block ${fromBlock} to ${toBlock}`);

          const filter = {
            address: maluAddress,
            topics: [eventAcquiredTopic,  ethers.utils.hexZeroPad("0xceC7CcE6A29DD268f49Bb0B91aA181F1e3FaD021", 32)],
            fromBlock: fromBlock,
            toBlock: toBlock
          };
        
          const logs = await provider.getLogs(filter);
          
          const parsedEvents = logs.map((log: any) => {
            const parsedLog = new ethers.utils.Interface([
              "event TicketAcquired(address indexed creator, uint256 eventId, tuple(address creator, string description, string imageURI, string title, string location, string subtitle, string externalLink, uint256 startDate, uint256 endDate, uint256 ticketPrice, uint256 ticketSupply, bool paused) info)"
            ]).parseLog(log);

            const eventInfo = parsedLog.args.info;
            return {
              id: parsedLog.args.eventId.toString(),
              creator: parsedLog.args.creator,
              title: eventInfo.title,
              description: eventInfo.description,
              imageURI: eventInfo.imageURI,
              location: eventInfo.location,
              subtitle: eventInfo.subtitle,
              externalLink: eventInfo.externalLink,
              startDate: new Date(eventInfo.startDate.toNumber() * 1000),
              endDate: new Date(eventInfo.endDate.toNumber() * 1000),
              ticketPrice: eventInfo.ticketPrice.toString(),
              ticketSupply: eventInfo.ticketSupply.toString(),
              isPaused: eventInfo.paused,
            };
          });

          fetchedEvents = [...fetchedEvents, ...parsedEvents];
        }

        setAllEvents(fetchedEvents);
        filterEvents(fetchedEvents, showUpcoming);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllEvents();
  }, []); // Only fetch once on component mount

  // Filter events based on tab selection
  const filterEvents = (events: any[], upcoming: boolean) => {
    const now = new Date();
    const filtered = events.filter((event) => {
      if (upcoming) {
        return event.startDate > now;
      } else {
        return event.endDate < now;
      }
    });

    filtered.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
    setEvents(filtered);
  };

  // Group events by date
  const groupedEvents = events.reduce((acc: { [key: string]: any[] }, event: any) => {
    const dateKey = event.startDate.toLocaleDateString();
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(event);
    return acc;
  }, {});



  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading events...</div>;
  }

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
          <Tabs 
            defaultValue="upcoming" 
            className="flex"
            onValueChange={(value) => {
              const isUpcoming = value === "upcoming";
              setShowUpcoming(isUpcoming);
              setIsLoading(true);
              filterEvents(allEvents, isUpcoming);
              setIsLoading(false);
            }}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>

        {/* Show message if no events */}
        {events.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            No {showUpcoming ? 'upcoming' : 'past'} events found
          </div>
        )}

        {/* Events Timeline */}
        <div className="relative space-y-8">
          {Object.entries(groupedEvents).map(([date, dateEvents], index) => (
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 * index }}
              key={date}
              className="space-y-4"
            >
              <div className="text-lg font-semibold">{date}</div>
              {/* Timeline */}
              <div className="flex flex-row gap-3">
                <div className="flex flex-col items-center justify-center px-3">
                  <div className="flex w-2 h-2 rounded-full bg-primary" />
                  <div className="flex w-px border-l h-full border-dashed border-muted-foreground/50" />
                </div>
                <div className="flex flex-col gap-3">
                  {dateEvents.map((event: any) => (
                    <div key={event.id} className="flex">
                      {/* Event Card */}
                      <Link href={`/events/${event.id}`} className="flex flex-col">
                        <Card className="overflow-hidden hover:bg-accent/50 transition-colors">
                          <div className="p-4 flex gap-4">
                            <div className="flex-1 space-y-4">
                              {/* Status and Time */}
                              <div className="flex items-center gap-2">
                                {new Date() >= event.startDate && new Date() <= event.endDate && (
                                  <Badge variant="destructive" className="bg-orange-500 hover:bg-orange-600">
                                    LIVE
                                  </Badge>
                                )}
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  <Clock className="h-4 w-4" />
                                  <span>{event.startDate.toLocaleTimeString()}</span>
                                </div>
                              </div>

                              {/* Title */}
                              <h2 className="text-2xl font-semibold">{event.title}</h2>

                              {/* Organizer */}
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <User className="h-4 w-4" />
                                <span>By {event.creator.slice(0, 6)}...{event.creator.slice(-4)}</span>
                              </div>

                              {/* Location */}
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                <span>{event.location}</span>
                              </div>

                              {/* Status Badge */}
                              <Badge className="mt-2">
                                {new Date() < event.startDate ? 'Upcoming' : 
                                 new Date() > event.endDate ? 'Past' : 'Live'}
                              </Badge>
                            </div>

                            {/* Event Image */}
                            <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                              <Image 
                                src={event.imageURI.startsWith('https://') ? event.imageURI : '/img_placeholder.jpg'} 
                                alt={event.title} 
                                fill 
                                className="object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = "/img_placeholder.jpg";
                                }}
                              />
                            </div>
                          </div>
                        </Card>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.main>
    </div>
  );
}
"use client";
import { motion } from "framer-motion";
import { MapPin, Clock, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import Link from "next/link";
import { fadeInVariant, staggerVariant } from "@/lib/motion-variants";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { blockOfDeployment, maluAddress } from "@/lib/constants";

interface Ticket {
  eventId: string;
  attendee: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  imageURI: string;
  location: string;
  subtitle: string;
  externalLink: string;
  startDate: Date;
  endDate: Date;
  ticketPrice: string;
  ticketSupply: string;
  isPaused: boolean;
  creator: string;
}

export default function EventsList() {
  const { data: session } = useSession();
  const [userTickets, setUserTickets] = useState<Ticket[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showUpcoming, setShowUpcoming] = useState(true);

  // Fetch user's tickets
  useEffect(() => {
    const fetchUserTickets = async () => {
      if (!session?.user?.name) return;

      try {
        setIsLoading(true);
        const provider = new ethers.providers.JsonRpcProvider("https://worldchain-mainnet.g.alchemy.com/public");
        const ticketAcquiredSignature = "TicketAcquired(address,uint256)";
        const ticketAcquiredTopic = ethers.utils.id(ticketAcquiredSignature);
        
        const startBlock = blockOfDeployment;
        const endBlock = await provider.getBlockNumber();
        const range = 50000;
        let fetchedTickets: Ticket[] = [];

        for (let fromBlock = startBlock; fromBlock < endBlock; fromBlock += range) {
          const toBlock = Math.min(fromBlock + range - 1, endBlock);
          
          const filter = {
            address: maluAddress,
            topics: [
              ticketAcquiredTopic,
              ethers.utils.hexZeroPad(session.user.name, 32)
            ],
            fromBlock: fromBlock,
            toBlock: toBlock
          };

          const logs = await provider.getLogs(filter);
          
          const parsedTickets = logs.map((log) => {
            const parsedLog = new ethers.utils.Interface([
              "event TicketAcquired(address indexed attendee, uint256 eventId)"
            ]).parseLog(log);

            return {
              eventId: parsedLog.args.eventId.toString(),
              attendee: parsedLog.args.attendee,
            };
          });

          fetchedTickets = [...fetchedTickets, ...parsedTickets];
        }

        setUserTickets(fetchedTickets);
        await fetchEventDetails(fetchedTickets);
      } catch (error) {
        console.error("Error fetching user tickets:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserTickets();
  }, [session?.user?.name]);

  // Fetch event details for each ticket
  const fetchEventDetails = async (tickets: Ticket[]) => {
    try {
      const provider = new ethers.providers.JsonRpcProvider("https://worldchain-mainnet.g.alchemy.com/public");
      const eventCreatedSignature = "EventCreated(address,uint256,(address,string,string,string,string,string,string,uint256,uint256,uint256,uint256,bool))";
      const eventCreatedTopic = ethers.utils.id(eventCreatedSignature);
      
      let fetchedEvents: Event[] = [];
      
      for (const ticket of tickets) {
        const filter = {
          address: maluAddress,
          topics: [eventCreatedTopic],
          fromBlock: blockOfDeployment,
          toBlock: "latest"
        };
        
        const logs = await provider.getLogs(filter);
        
        const eventLog = logs.find(log => {
          const parsedLog = new ethers.utils.Interface([
            "event EventCreated(address indexed creator, uint256 eventId, tuple(address creator, string description, string imageURI, string title, string location, string subtitle, string externalLink, uint256 startDate, uint256 endDate, uint256 ticketPrice, uint256 ticketSupply, bool paused) info)"
          ]).parseLog(log);
          return parsedLog.args.eventId.toString() === ticket.eventId;
        });

        if (eventLog) {
          const parsedLog = new ethers.utils.Interface([
            "event EventCreated(address indexed creator, uint256 eventId, tuple(address creator, string description, string imageURI, string title, string location, string subtitle, string externalLink, uint256 startDate, uint256 endDate, uint256 ticketPrice, uint256 ticketSupply, bool paused) info)"
          ]).parseLog(eventLog);
          
          const eventInfo = parsedLog.args.info;
          fetchedEvents.push({
            id: ticket.eventId,
            creator: eventInfo.creator,
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
          });
        }
      }

      setEvents(fetchedEvents);
    } catch (error) {
      console.error("Error fetching event details:", error);
    }
  };

  // Group events by date
  const groupedEvents = events.reduce((acc: { [key: string]: Event[] }, event: Event) => {
    const date = event.startDate.toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(event);
    return acc;
  }, {});

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
          <h1 className="text-4xl font-bold">My Events</h1>
          <Tabs 
            defaultValue="upcoming" 
            className="flex"
            onValueChange={(value) => setShowUpcoming(value === "upcoming")}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>

        {isLoading ? (
          <div className="text-center">Loading your events...</div>
        ) : (
          /* Events Timeline */
          <div className="relative space-y-8">
            {Object.entries(groupedEvents).map(([date, dateEvents], index) => {
              // Filter events based on tab selection
              const now = new Date();
              const filteredEvents = dateEvents.filter((event) => 
                showUpcoming ? event.startDate > now : event.startDate <= now
              );

              if (filteredEvents.length === 0) return null;

              return (
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
                      {filteredEvents.map((event) => (
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
                                    <span>By {event.creator}</span>
                                  </div>

                                  {/* Location */}
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <MapPin className="h-4 w-4" />
                                    <span>{event.location}</span>
                                  </div>

                                  {/* Status Badge */}
                                  <Badge className="mt-2">
                                    {event.isPaused ? "Paused" : "Active"}
                                  </Badge>
                                </div>

                                {/* Event Image */}
                                <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                                  <Image 
                                    src={event.imageURI || "/img_placeholder.jpg"} 
                                    alt={event.title} 
                                    fill 
                                    className="object-cover"
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
              );
            })}
          </div>
        )}
      </motion.main>
    </div>
  );
}
"use client";
import { motion } from "framer-motion";
import { Calendar, MapPin, ExternalLink, Ticket, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { fadeInVariant, staggerVariant } from "@/lib/motion-variants";
import AnchoredButton from "@/components/ui/AnchoredButton";
import { MiniKit, SendTransactionInput } from "@worldcoin/minikit-js";
import { maluAddress } from "@/lib/constants";
import { MaluABI } from "@/lib/abi/maluABI";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import QRCodeScanner from "@/components/ui/QrButton";
import { useSession } from "next-auth/react";
import * as Dialog from "@radix-ui/react-dialog";
import QRCode from "react-qr-code";

interface EventInfo {
  creator: string;
  description: string;
  imageURI: string;
  title: string;
  location: string;
  subtitle: string;
  externalLink: string;
  startDate: Date;
  endDate: Date;
  ticketPrice: string;
  ticketSupply: string;
  paused: boolean;
}

export default function EventPage() {
  const params = useParams();
  const eventId = params.eventId;
  const [eventInfo, setEventInfo] = useState<EventInfo | null>(null);
  const [userAlreadyAttending, setUserAlreadyAttending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [scannedLink, setScannedLink] = useState<string | null>(null);

  useEffect(() => {
    const sendTransaction = async () => {
      if (!MiniKit.isInstalled() || !session?.user?.name) {
        return;
      }
      console.log(eventId);

      const transactionInput: SendTransactionInput = {
        transaction: [
          {
            address: maluAddress,
            abi: MaluABI,
            functionName: "attestPartecipation",
            args: [eventId.toString(), session.user.name],
          },
        ],
      };

      try {
        console.log("Hello Input:", transactionInput);
        const { commandPayload, finalPayload } = await MiniKit.commandsAsync.sendTransaction(transactionInput);
        console.log("Command Payload", commandPayload);
        console.log("Final Payload", finalPayload);
      } catch (error) {
        console.error("Transaction failed:", error);
      }
    };

    if (scannedLink) {
      console.log("scanned link:", scannedLink);
      sendTransaction();
    }
  }, [scannedLink]);

  useEffect(() => {
    const fetchEventInfo = async () => {
      try {
        const provider = new ethers.providers.JsonRpcProvider("https://worldchain-mainnet.g.alchemy.com/public");
        const contract = new ethers.Contract(maluAddress, MaluABI, provider);

        // Fetch event info from the mapping
        const info = await contract.s_events(eventId);

        // Convert the returned array into an object with proper date conversion
        const eventData: EventInfo = {
          creator: info.creator,
          description: info.description,
          imageURI: info.imageURI,
          title: info.title,
          location: info.location,
          subtitle: info.subtitle,
          externalLink: info.externalLink,
          startDate: new Date(info.startDate.toNumber() * 1000),
          endDate: new Date(info.endDate.toNumber() * 1000),
          ticketPrice: ethers.utils.formatEther(info.ticketPrice),
          ticketSupply: info.ticketSupply.toString(),
          paused: info.paused,
        };

        setEventInfo(eventData);
      } catch (error) {
        console.error("Error fetching event info:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (eventId) {
      fetchEventInfo();
    }
  }, [eventId]);

  // Use effect function to check if the user has already bought a ticket
  useEffect(() => {
    const checkUserAttending = async () => {
      if (!session?.user?.name) {
        return;
      }

      const provider = new ethers.providers.JsonRpcProvider("https://worldchain-mainnet.g.alchemy.com/public");
      const contract = new ethers.Contract(maluAddress, MaluABI, provider);

      const userAttending: boolean = await contract.s_userAttended(MiniKit.user?.walletAddress, eventId);
      console.log("User attending:", userAttending);

      setUserAlreadyAttending(userAttending);
    };

    if (eventInfo) checkUserAttending();
  }, [eventInfo]);

  const sendTransaction = async () => {
    if (!MiniKit.isInstalled()) {
      return;
    }
    console.log(eventId);

    const transactionInput: SendTransactionInput = {
      transaction: [
        {
          address: maluAddress,
          abi: MaluABI,
          functionName: "buyTicket",
          args: [eventId.toString()],
        },
      ],
    };

    try {
      console.log("Hello Input:", transactionInput);
      const { commandPayload, finalPayload } = await MiniKit.commandsAsync.sendTransaction(transactionInput);
      console.log("Command Payload", commandPayload);
      console.log("Final Payload", finalPayload);
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  };

  const handleShowQRCode = () => {
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading event details...</div>;
  }

  if (!eventInfo) {
    return <div className="min-h-screen flex items-center justify-center">Event not found</div>;
  }

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
          <Image
            src={eventInfo.imageURI.startsWith("https://") ? eventInfo.imageURI : "/img_placeholder.jpg"}
            alt={eventInfo.title}
            width={400}
            height={400}
            className="rounded-lg"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/img_placeholder.jpg";
            }}
          />
          <div className="flex flex-col space-y-4">
            {eventInfo.paused && <Badge variant="destructive">Event Paused</Badge>}
            <h1 className="text-4xl md:text-6xl font-bold">{eventInfo.title}</h1>
            <p className="text-xl text-muted-foreground">{eventInfo.subtitle}</p>

            {/* Event Details */}
            <motion.div variants={fadeInVariant}>
              <Card className="bg-card">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">
                        {eventInfo.startDate.toLocaleDateString()} - {eventInfo.endDate.toLocaleDateString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {eventInfo.startDate.toLocaleTimeString()} - {eventInfo.endDate.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <p className="font-medium">{eventInfo.location}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Ticket className="h-5 w-5 text-muted-foreground" />
                    <p className="font-medium">{eventInfo.ticketPrice} ETH</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>

        <motion.div variants={fadeInVariant} className="grid md:grid-cols-2 gap-8">
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="text-2xl text-pink-500">Hacker's Den</CardTitle>
              <CardDescription>Hacking the future</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-pink-500" />
                  <span>For Builders by Builders</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-pink-500" />
                  <span>Enjoy a full week of amazing code experience</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-pink-500" />
                  <span>And that's pretty much it! 🍋</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* About Section */}
        <motion.section variants={fadeInVariant} className="space-y-4">
          <h2 className="text-3xl font-bold">About Event</h2>
          <p className="text-muted-foreground">{eventInfo.description}</p>
        </motion.section>

        {/* Links */}
        {eventInfo.externalLink && (
          <motion.div variants={fadeInVariant} className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => window.open("https://claude.ai/new", "_blank")}
            >
              Learn More <ExternalLink className="h-4 w-4" />
            </Button>
          </motion.div>
        )}

        {/* QR Code */}
        {eventInfo.externalLink && (
          <motion.div variants={fadeInVariant} className="flex flex-col sm:flex-row gap-4">
            {eventInfo.creator === session?.user?.name && !scannedLink ? (
              <QRCodeScanner scannedLink={scannedLink} setScannedLink={setScannedLink} />
            ) : !userAlreadyAttending ? (
              <>
                <Button className="flex w-full" onClick={handleShowQRCode}>
                  <span>Show QR Code</span>
                  <QrCode />
                </Button>
                <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
                  <Dialog.Content className="fixed inset-0 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                      <Dialog.Title className="text-lg font-bold">Your QR Code</Dialog.Title>
                      <Dialog.Description className="mt-2 mb-4 text-sm text-gray-500">
                        Scan this QR code to check in.
                      </Dialog.Description>
                      <QRCode value={session?.user?.name || ""} />
                      <div className="mt-4 flex justify-end">
                        <Dialog.Close asChild>
                          <Button variant="outline">Close</Button>
                        </Dialog.Close>
                      </div>
                    </div>
                  </Dialog.Content>
                </Dialog.Root>
              </>
            ) : null}
          </motion.div>
        )}
      </motion.main>

      {/* Join Event Button */}
      {!eventInfo.paused && (
        <AnchoredButton
          disabled={userAlreadyAttending}
          text={`Join for ${eventInfo.ticketPrice} ETH`}
          onClick={sendTransaction}
        />
      )}
    </div>
  );
}

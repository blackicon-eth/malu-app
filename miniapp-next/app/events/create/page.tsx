"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Ticket, Users, Armchair, PenLine, ImageIcon, Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { fadeInVariant, staggerVariant } from "@/lib/motion-variants";
import AnchoredButton from "@/components/ui/AnchoredButton";
import { MiniKit, SendTransactionInput } from "@worldcoin/minikit-js";
import { maluAddress } from "@/lib/constants";
import { MaluABI } from "@/lib/abi/maluABI";

export default function CreateEventPage() {
  // Form state
  const [formState, setFormState] = useState({
    ticketPrice: "",
    ticketSupply: "",
    description: "",
    title: "",
    imageURI: "",
    location: "",
    subtitle: "",
    externalLink: "",
    startDate: "",
    endDate: "",
    requireApproval: false,
  });

  // Image state
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageURI, setImageURI] = useState<string>("");

  // Transaction parameters state
  const [transactionParams, setTransactionParams] = useState({
    ticketPrice: "",
    ticketSupply: "",
    description: "",
    title: "",
    imageURI: "",
    location: "",
    subtitle: "",
    externalLink: "",
    startDate: "",
    endDate: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormState((prev: any) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        // TODO
        setImageURI("ipfs://QmXxxx...");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormState((prev: any) => ({
      ...prev,
      requireApproval: checked,
    }));
  };

  useEffect(() => {
    const convertToWei = (ethValue: string) => {
      try {
        return (parseFloat(ethValue) * 1e18).toString();
      } catch {
        return "0";
      }
    };

    const convertToUnixTimestamp = (dateString: string) => {
      try {
        return Math.floor(new Date(dateString).getTime() / 1000).toString();
      } catch {
        return "0";
      }
    };

    setTransactionParams({
      ticketPrice: convertToWei(formState.ticketPrice),
      ticketSupply: formState.ticketSupply || "0",
      description: formState.description,
      title: formState.title,
      imageURI: imageURI,
      location: formState.location,
      subtitle: formState.subtitle,
      externalLink: formState.externalLink,
      startDate: convertToUnixTimestamp(formState.startDate),
      endDate: convertToUnixTimestamp(formState.endDate),
    });
    console.log(transactionParams);
  }, [formState, imageURI]);

  const sendTransaction = async () => {
    if (!MiniKit.isInstalled()) {
      return;
    }

    const transactionInput: SendTransactionInput = {
      transaction: [
        {
          address: maluAddress,
          abi: MaluABI,
          functionName: "createEvent",
          args: [
            transactionParams.ticketPrice,
            transactionParams.ticketSupply,
            transactionParams.description,
            transactionParams.title,
            transactionParams.imageURI,
            transactionParams.location,
            transactionParams.subtitle,
            transactionParams.externalLink,
            transactionParams.startDate,
            transactionParams.endDate,
          ],
        },
      ],
    };

    try {
      const { commandPayload, finalPayload } = await MiniKit.commandsAsync.sendTransaction(transactionInput);
      console.log("Command Payload", commandPayload);
      console.log("Final Payload", finalPayload);
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      <motion.main
        className="container mx-auto px-4 space-y-6"
        initial="initial"
        animate="animate"
        variants={staggerVariant}
      >
        {/* Header Image Upload */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="space-y-4"
        >
          <div className="h-48 rounded-lg bg-gradient-to-b from-pink-500/20 to-purple-700/20 flex items-center justify-center relative">
            {selectedImage ? (
              <img src={selectedImage} alt="Cover" className="h-full w-full object-cover rounded-lg" />
            ) : (
              <Button variant="outline" className="gap-2">
                <ImageIcon className="h-4 w-4" />
                Upload Cover Image
              </Button>
            )}
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleImageUpload}
            />
          </div>
        </motion.div>

        {/* Event Basic Info */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card className="bg-card/50 backdrop-blur">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-semibold">Event Information</h2>

              <div className="space-y-2">
                <Label htmlFor="title">Event Name</Label>
                <Input
                  id="title"
                  value={formState.title}
                  onChange={handleInputChange}
                  placeholder="Enter event name"
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Subtitle</Label>
                <div className="flex items-center gap-2">
                  <PenLine className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="subtitle"
                    value={formState.subtitle}
                    onChange={handleInputChange}
                    placeholder="A short description"
                    className="bg-background/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <div className="flex items-center gap-2">
                  <PenLine className="h-4 w-4 text-muted-foreground" />
                  <Textarea
                    id="description"
                    value={formState.description}
                    onChange={handleInputChange}
                    placeholder="Add a full description for the event..."
                    className="bg-background/50"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Event external link */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <Card className="bg-card/50 backdrop-blur">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-semibold">External Link</h2>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Link className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="externalLink"
                    value={formState.externalLink}
                    onChange={handleInputChange}
                    placeholder="Add external link"
                    className="bg-background/50"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Event Time and place */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.16 }}
        >
          <Card className="bg-card/50 backdrop-blur">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-semibold">Time and Place</h2>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="startDate"
                      type="datetime-local"
                      value={formState.startDate}
                      onChange={handleInputChange}
                      className="bg-background/50"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startDate">End date</Label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="endDate"
                      type="datetime-local"
                      value={formState.endDate}
                      onChange={handleInputChange}
                      className="bg-background/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="location"
                      value={formState.location}
                      onChange={handleInputChange}
                      placeholder="Add location or virtual link"
                      className="bg-background/50"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Event Options */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.32 }}
        >
          <Card className="bg-card/50 backdrop-blur">
            <CardContent className="p-6 space-y-6">
              <h2 className="text-lg font-semibold">Event Options</h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Ticket className="h-4 w-4 text-muted-foreground" />
                      <Label>Ticket Price</Label>
                    </div>
                    <p className="text-sm text-muted-foreground">Set ticket price</p>
                  </div>
                  <Input
                    id="ticketPrice"
                    value={formState.ticketPrice}
                    onChange={handleInputChange}
                    placeholder="15 $"
                    type="number"
                    className="w-[120px] bg-background/50"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Armchair className="h-4 w-4 text-muted-foreground" />
                      <Label>Available spots</Label>
                    </div>
                    <p className="text-sm text-muted-foreground">Set the maximum #</p>
                  </div>
                  <Input
                    id="ticketSupply"
                    value={formState.ticketSupply}
                    onChange={handleInputChange}
                    placeholder="100"
                    type="number"
                    className="w-[120px] bg-background/50"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <Label>Require Approval</Label>
                    </div>
                    <p className="text-sm text-muted-foreground">Manually approve attendees</p>
                  </div>
                  <Switch checked={formState.requireApproval} onCheckedChange={handleSwitchChange} />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.main>

      {/* Create Event Button */}
      <AnchoredButton text="Create Event" onClick={sendTransaction} />
    </div>
  );
}

"use client";
import { motion } from "framer-motion";
import { Calendar, MapPin, Ticket, Users, Armchair, PenLine, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { fadeInVariant, staggerVariant } from "@/lib/motion-variants";
import AnchoredButton from "@/components/ui/AnchoredButton";

export default function CreateEventPage() {
  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      <motion.main
        className="container mx-auto px-4 space-y-8"
        initial="initial"
        animate="animate"
        variants={staggerVariant}
      >
        {/* Header Image Upload */}
        <motion.div variants={fadeInVariant} className="space-y-4">
          <div className="h-48 rounded-lg bg-gradient-to-b from-pink-500/20 to-purple-700/20 flex items-center justify-center">
            <Button variant="outline" className="gap-2">
              <ImageIcon className="h-4 w-4" />
              Upload Cover Image
            </Button>
          </div>
        </motion.div>

        {/* Event Basic Info */}
        <motion.div variants={fadeInVariant}>
          <Card className="bg-card/50 backdrop-blur">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-semibold">Event Information</h2>

              <div className="space-y-2">
                <Label htmlFor="event-name">Event Name</Label>
                <Input id="event-name" placeholder="Enter event name" className="bg-background/50" />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="event-date">Date & Time</Label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <Input id="event-date" type="datetime-local" className="bg-background/50" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="event-location">Location</Label>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <Input id="event-location" placeholder="Add location or virtual link" className="bg-background/50" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="event-description">Description</Label>
                <div className="flex items-center gap-2">
                  <PenLine className="h-4 w-4 text-muted-foreground" />
                  <Textarea id="event-description" placeholder="Add event description" className="bg-background/50" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Event Options */}
        <motion.div variants={fadeInVariant}>
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
                  <Input placeholder="15 $" type="number" className="w-[120px] bg-background/50" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Armchair className="h-4 w-4 text-muted-foreground" />
                      <Label>Available spots</Label>
                    </div>
                    <p className="text-sm text-muted-foreground">Set the maximum #</p>
                  </div>
                  <Input placeholder="100" type="number" className="w-[120px] bg-background/50" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <Label>Require Approval</Label>
                    </div>
                    <p className="text-sm text-muted-foreground">Manually approve attendees</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.main>

      {/* Create Event Button */}
      <AnchoredButton text="Create Event" />
    </div>
  );
}

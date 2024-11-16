"use client";
import { useState } from "react";
import { QrReader } from "react-qr-reader";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { QrCode } from "lucide-react";

interface QRCodeScannerProps {
  scannedLink: string | null;
  setScannedLink: (link: string | null) => void;
}

export default function QRCodeScanner({ scannedLink, setScannedLink }: QRCodeScannerProps) {
  const [open, setOpen] = useState(false);

  const handleScan = (result: string | null) => {
    if (result) {
      setScannedLink(result);
      setOpen(false);
      // You can add your link validation logic here
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="flex w-full">
            <span>Scan QR Code</span>
            <QrCode />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Scan QR Code</DialogTitle>
          </DialogHeader>
          <QrReader
            onResult={(result) => result && handleScan(result.getText())}
            constraints={{ facingMode: "environment" }}
            videoStyle={{ width: "100%", height: "auto" }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

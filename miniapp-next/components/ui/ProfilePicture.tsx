"use client";
import { useRef } from "react";
import { Edit2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface ProfilePictureProps {
  src: string;
  alt: string;
  size?: number;
  onFileSelect?: (file: File) => void;
}

export default function ProfilePicture({ src, alt, size = 128, onFileSelect }: ProfilePictureProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onFileSelect) {
      onFileSelect(file);
    }
  };

  return (
    <div className="relative inline-block" style={{ width: size, height: size }} onClick={handleEditClick}>
      <div className="w-full h-full rounded-full overflow-hidden">
        <Image src={src} alt={alt} width={size} height={size} className="object-cover" />
      </div>
      <div className="absolute bottom-0 right-0">
        <Button
          size="icon"
          variant="secondary"
          className="rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90"
        >
          <Edit2 className="h-4 w-4" />
          <span className="sr-only">Edit profile picture</span>
        </Button>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        aria-label="Upload profile picture"
      />
    </div>
  );
}

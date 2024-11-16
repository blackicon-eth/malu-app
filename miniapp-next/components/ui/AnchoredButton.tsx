import { fadeInVariant } from "@/lib/motion-variants";
import { motion } from "framer-motion";
import { Button } from "./button";

interface AnchoredButtonProps {
  text: string;
}

export default function AnchoredButton({ text }: AnchoredButtonProps) {
  return (
    <motion.div
      variants={fadeInVariant}
      className="z-50 fixed bottom-0 left-0 w-full p-4 bg-background/80 backdrop-blur-lg border-t"
    >
      <Button className="w-full bg-pink-600 hover:bg-pink-700">{text}</Button>
    </motion.div>
  );
}

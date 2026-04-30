"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function GalleryZoomDialog({
  selectedImage,
  onClose,
}: {
  selectedImage: string;
  onClose: () => void;
}) {
  return (
    <Dialog open={!!selectedImage} onOpenChange={onClose}>
      <DialogContent
        className="max-h-[90vh] max-w-[90vw] border-none bg-transparent p-0"
        onClick={onClose}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Screenshot</DialogTitle>
          <DialogDescription>Zoomed screenshot</DialogDescription>
        </DialogHeader>
        <motion.div>
          <Image
            src={selectedImage}
            alt="screenshot"
            width={1080}
            height={1080}
            className="h-[85vh] w-full rounded-lg object-contain"
          />
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

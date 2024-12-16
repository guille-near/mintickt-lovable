import { QRCodeSVG } from "qrcode.react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QrCode } from "lucide-react";

interface QRCodeDialogProps {
  profileUrl: string;
}

export function QRCodeDialog({ profileUrl }: QRCodeDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="border border-input">
          <QrCode className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Profile QR Code</DialogTitle>
        </DialogHeader>
        <div className="flex items-center justify-center p-6">
          <QRCodeSVG
            value={profileUrl}
            size={256}
            level="H"
            includeMargin
            className="w-full max-w-[256px]"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
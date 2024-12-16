import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { X } from "lucide-react";
import { TicketControls } from "./TicketControls";

interface DesktopTicketDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  ticketPrice: number;
  eventId: string;
  eventTitle: string;
  ticketQuantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
}

export const DesktopTicketDialog = ({
  isOpen,
  onOpenChange,
  ticketPrice,
  eventId,
  eventTitle,
  ticketQuantity,
  onDecrease,
  onIncrease,
}: DesktopTicketDialogProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>
        <Button size="lg" className="w-full">
          Count me in!
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-md">
        <Card className="w-full border-none shadow-none">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-4 top-4"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
          <CardHeader className="pb-4">
            <AlertDialogTitle className="text-lg">Purchase Tickets</AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              Get your tickets for {eventTitle}
            </AlertDialogDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <TicketControls
              ticketPrice={ticketPrice}
              eventId={eventId}
              ticketQuantity={ticketQuantity}
              onDecrease={onDecrease}
              onIncrease={onIncrease}
              onClose={() => onOpenChange(false)}
            />
          </CardContent>
        </Card>
      </AlertDialogContent>
    </AlertDialog>
  );
};
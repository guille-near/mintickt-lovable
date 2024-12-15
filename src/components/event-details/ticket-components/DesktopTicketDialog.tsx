import { AlertDialog, AlertDialogContent, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Minus, Plus } from "lucide-react";

interface DesktopTicketDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  ticketPrice: number;
  eventTitle: string;
  ticketQuantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
}

export const DesktopTicketDialog = ({
  isOpen,
  onOpenChange,
  ticketPrice,
  eventTitle,
  ticketQuantity,
  onDecrease,
  onIncrease,
}: DesktopTicketDialogProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>
        <Button className="w-full">
          Count me in!
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <Card className="w-full border-none shadow-none">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Purchase Tickets</CardTitle>
            <CardDescription className="text-sm">
              Get your tickets for {eventTitle}
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <Label className="text-sm">Price per ticket</Label>
                <div className="text-lg font-semibold">{ticketPrice} SOL</div>
              </div>
              <div>
                <Label className="text-sm">Quantity</Label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={onDecrease}
                    disabled={ticketQuantity <= 1}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="text-lg font-semibold min-w-[2ch] text-center">
                    {ticketQuantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={onIncrease}
                    disabled={ticketQuantity >= 10}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div>
                <Label className="text-sm">Total</Label>
                <div className="text-lg font-semibold">
                  {(ticketPrice * ticketQuantity).toFixed(2)} SOL
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full h-9 text-sm">
              Buy Tickets
            </Button>
          </CardFooter>
        </Card>
      </AlertDialogContent>
    </AlertDialog>
  );
};
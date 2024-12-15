import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useIsMobile } from "@/hooks/use-mobile";
import { Minus, Plus } from "lucide-react";
import { AlertDialog, AlertDialogContent, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";

interface TicketPurchaseProps {
  ticketPrice: number;
  eventTitle: string;
}

export const TicketPurchase = ({ ticketPrice, eventTitle }: TicketPurchaseProps) => {
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  const decreaseQuantity = () => {
    if (ticketQuantity > 1) {
      setTicketQuantity(prev => prev - 1);
    }
  };

  const increaseQuantity = () => {
    if (ticketQuantity < 10) {
      setTicketQuantity(prev => prev + 1);
    }
  };

  const MobileTicketControls = () => (
    <div className="space-y-6 px-4">
      <div>
        <Label>Price per ticket</Label>
        <div className="text-2xl font-bold">{ticketPrice} SOL</div>
      </div>
      <div>
        <Label>Quantity</Label>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={decreaseQuantity}
            disabled={ticketQuantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="text-xl font-bold min-w-[3ch] text-center">
            {ticketQuantity}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={increaseQuantity}
            disabled={ticketQuantity >= 10}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div>
        <Label>Total</Label>
        <div className="text-2xl font-bold">
          {(ticketPrice * ticketQuantity).toFixed(2)} SOL
        </div>
      </div>
      <Button className="w-full">
        Buy
      </Button>
    </div>
  );

  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white/30 dark:bg-black/30 backdrop-blur-sm border-t border-border p-4 z-50">
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerTrigger asChild>
            <Button className="w-full h-11">
              Buy
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Purchase Tickets</DrawerTitle>
            </DrawerHeader>
            <MobileTicketControls />
          </DrawerContent>
        </Drawer>
      </div>
    );
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button className="w-full">
          Buy
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
                    onClick={decreaseQuantity}
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
                    onClick={increaseQuantity}
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
              Buy
            </Button>
          </CardFooter>
        </Card>
      </AlertDialogContent>
    </AlertDialog>
  );
};
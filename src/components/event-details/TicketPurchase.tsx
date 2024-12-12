import { useState } from 'react';
import { Ticket, Minus, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useIsMobile } from "@/hooks/use-mobile";

interface TicketPurchaseProps {
  ticketPrice: number;
  eventTitle: string;
}

export const TicketPurchase = ({ ticketPrice, eventTitle }: TicketPurchaseProps) => {
  const [ticketQuantity, setTicketQuantity] = useState(1);
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

  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 z-50">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Precio</span>
            <span className="text-lg font-bold">{ticketPrice} SOL</span>
          </div>
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
            <span className="text-lg font-bold min-w-[2ch] text-center">
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
          <Button className="flex-1 max-w-[150px]">
            <Ticket className="mr-2 h-4 w-4" /> Comprar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Get Your Tickets</CardTitle>
        <CardDescription>Secure your spot at {eventTitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <Label className="text-base">Price per Ticket</Label>
            <div className="mt-2 text-2xl font-bold">{ticketPrice} SOL</div>
          </div>
          
          <div>
            <Label className="text-base">Number of Tickets</Label>
            <div className="flex items-center justify-center mt-2 space-x-4">
              <Button
                variant="outline"
                size="icon"
                onClick={decreaseQuantity}
                disabled={ticketQuantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-2xl font-bold min-w-[3ch] text-center">
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
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="w-full pt-4 border-t">
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium">Total</span>
            <span className="text-2xl font-bold">
              {(ticketQuantity * ticketPrice).toFixed(2)} SOL
            </span>
          </div>
        </div>
        <Button className="w-full" size="lg">
          <Ticket className="mr-2 h-5 w-5" /> Buy Tickets
        </Button>
      </CardFooter>
    </Card>
  );
};
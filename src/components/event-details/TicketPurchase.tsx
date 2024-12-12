import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useIsMobile } from "@/hooks/use-mobile";
import { Minus, Plus, Ticket } from "lucide-react";

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
            <span className="text-sm text-muted-foreground">Price</span>
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
            <Ticket className="mr-2 h-4 w-4" /> Buy
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Purchase Tickets</CardTitle>
        <CardDescription>
          Get your tickets for {eventTitle}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
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
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">
          <Ticket className="mr-2 h-4 w-4" /> Purchase Tickets
        </Button>
      </CardFooter>
    </Card>
  );
};
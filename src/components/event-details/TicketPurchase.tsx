import { useState } from 'react';
import { Ticket } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TicketPurchaseProps {
  ticketPrice: number;
  eventTitle: string;
}

export const TicketPurchase = ({ ticketPrice, eventTitle }: TicketPurchaseProps) => {
  const [ticketQuantity, setTicketQuantity] = useState(1);

  return (
    <Card className="bg-card backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white">Get Your Tickets</CardTitle>
        <CardDescription className="text-gray-300">Secure your spot at {eventTitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-white">Number of Tickets</Label>
            <Input 
              type="number" 
              min="1" 
              max="10" 
              value={ticketQuantity} 
              onChange={(e) => setTicketQuantity(parseInt(e.target.value) || 1)} 
              className="bg-background/50 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-white">Price per Ticket</Label>
            <Input value={`${ticketPrice} SOL`} disabled className="bg-background/50 text-white" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-2xl font-bold text-white">
          Total: {ticketQuantity * ticketPrice} SOL
        </div>
        <Button className="bg-primary text-white hover:bg-primary/80">
          <Ticket className="mr-2 h-4 w-4" /> Buy Tickets
        </Button>
      </CardFooter>
    </Card>
  );
};
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
    <Card>
      <CardHeader>
        <CardTitle>Get Your Tickets</CardTitle>
        <CardDescription>Secure your spot at {eventTitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Number of Tickets</Label>
            <Input 
              type="number" 
              min="1" 
              max="10" 
              value={ticketQuantity} 
              onChange={(e) => setTicketQuantity(parseInt(e.target.value) || 1)} 
            />
          </div>
          <div className="space-y-2">
            <Label>Price per Ticket</Label>
            <Input value={`${ticketPrice} SOL`} disabled />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-2xl font-bold">
          Total: {ticketQuantity * ticketPrice} SOL
        </div>
        <Button>
          <Ticket className="mr-2 h-4 w-4" /> Buy Tickets
        </Button>
      </CardFooter>
    </Card>
  );
};
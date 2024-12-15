import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Minus, Plus } from "lucide-react";

interface TicketControlsProps {
  ticketPrice: number;
  ticketQuantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
  onClose?: () => void;
}

export const TicketControls = ({
  ticketPrice,
  ticketQuantity,
  onDecrease,
  onIncrease,
  onClose,
}: TicketControlsProps) => {
  return (
    <div className="space-y-6">
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
            onClick={(e) => {
              e.stopPropagation();
              onDecrease();
            }}
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
            onClick={(e) => {
              e.stopPropagation();
              onIncrease();
            }}
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
      <Button 
        className="w-full"
        onClick={onClose}
      >
        Buy Tickets
      </Button>
    </div>
  );
};
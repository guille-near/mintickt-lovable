import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Minus, Plus } from "lucide-react";
import { useNFTTickets } from "@/hooks/use-nft-tickets";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletButton } from "@/components/WalletButton";

interface TicketControlsProps {
  ticketPrice: number;
  ticketQuantity: number;
  eventId: string;
  onDecrease: () => void;
  onIncrease: () => void;
  onClose?: () => void;
}

export const TicketControls = ({
  ticketPrice,
  ticketQuantity,
  eventId,
  onDecrease,
  onIncrease,
  onClose,
}: TicketControlsProps) => {
  const { connected } = useWallet();
  const { purchaseTicket, isLoading } = useNFTTickets(eventId);

  const handlePurchase = async () => {
    await purchaseTicket(ticketPrice * ticketQuantity);
    onClose?.();
  };

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
      {!connected ? (
        <WalletButton />
      ) : (
        <Button 
          className="w-full"
          onClick={handlePurchase}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Buy"}
        </Button>
      )}
    </div>
  );
};
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileTicketDrawer } from "./ticket-components/MobileTicketDrawer";
import { DesktopTicketDialog } from "./ticket-components/DesktopTicketDialog";

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

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  if (isMobile) {
    return (
      <MobileTicketDrawer
        isOpen={isOpen}
        onOpenChange={handleOpenChange}
        ticketPrice={ticketPrice}
        ticketQuantity={ticketQuantity}
        onDecrease={decreaseQuantity}
        onIncrease={increaseQuantity}
      />
    );
  }

  return (
    <DesktopTicketDialog
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
      ticketPrice={ticketPrice}
      eventTitle={eventTitle}
      ticketQuantity={ticketQuantity}
      onDecrease={decreaseQuantity}
      onIncrease={increaseQuantity}
    />
  );
};
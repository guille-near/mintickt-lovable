import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { TicketControls } from "./TicketControls";

interface MobileTicketDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  ticketPrice: number;
  ticketQuantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
}

export const MobileTicketDrawer = ({
  isOpen,
  onOpenChange,
  ticketPrice,
  ticketQuantity,
  onDecrease,
  onIncrease,
}: MobileTicketDrawerProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/30 dark:bg-black/30 backdrop-blur-sm border-t border-border p-4 z-50">
      <Drawer open={isOpen} onOpenChange={onOpenChange} onPointerDownOutside={() => onOpenChange(false)}>
        <DrawerTrigger asChild>
          <Button size="lg" className="w-full">
            Count me in!
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Purchase Tickets</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-8">
            <TicketControls
              ticketPrice={ticketPrice}
              ticketQuantity={ticketQuantity}
              onDecrease={onDecrease}
              onIncrease={onIncrease}
            />
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};
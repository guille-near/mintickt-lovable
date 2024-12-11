import { Button } from "@/components/ui/button";
import { WalletButton } from "@/components/WalletButton";
import { PlusIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="border-b">
      <div className="container mx-auto flex items-center justify-between p-6">
        <h1 className="text-2xl font-bold text-foreground">NFT Tickets</h1>
        <div className="flex items-center gap-4">
          <Button 
            variant="outline"
            onClick={() => navigate('/create')}
            className="flex items-center gap-2"
          >
            <PlusIcon className="w-4 h-4" />
            Create Event
          </Button>
          <WalletButton />
        </div>
      </div>
    </header>
  );
};
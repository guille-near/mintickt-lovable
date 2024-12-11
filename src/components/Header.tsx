import { Button } from "@/components/ui/button";
import { WalletButton } from "@/components/WalletButton";
import { PlusIcon, UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthProvider";

export const Header = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  return (
    <header className="border-b">
      <div className="container mx-auto flex items-center justify-between p-6">
        <h1 
          onClick={() => navigate('/discover')} 
          className="text-2xl font-bold text-foreground cursor-pointer"
        >
          NFT Tickets
        </h1>
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
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/account')}
          >
            <UserCircle className="h-5 w-5" />
          </Button>
          <Button variant="outline" onClick={() => signOut()}>
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
};
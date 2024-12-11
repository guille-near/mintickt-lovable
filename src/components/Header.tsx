import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const Header = () => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();

  return (
    <header className="border-b">
      <div className="container mx-auto flex items-center justify-between p-6">
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar>
                  <AvatarFallback>
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => navigate('/account')}>
                Account
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => signOut()}>
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="outline"
            onClick={() => navigate('/create')}
            className="flex items-center gap-2"
          >
            <PlusIcon className="w-4 h-4" />
            Create Event
          </Button>
        </div>
        <h1 
          onClick={() => navigate('/discover')} 
          className="text-2xl font-bold text-foreground cursor-pointer"
        >
          NFT Tickets
        </h1>
      </div>
    </header>
  );
};
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const SimpleHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex items-center justify-between p-6">
        <img 
          src="/Logo.svg" 
          alt="NFT Tickets Logo" 
          className="h-12 cursor-pointer dark:invert" 
          onClick={() => navigate('/')} 
        />
        <Button
          variant="outline"
          onClick={() => navigate('/auth')}
          className="flex items-center gap-2"
        >
          <LogIn className="w-4 h-4" />
          Sign In
        </Button>
      </div>
    </header>
  );
};
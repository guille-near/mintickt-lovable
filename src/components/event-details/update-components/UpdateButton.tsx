import { MessageCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Update } from "../types";
import { formatDate } from "../utils";

interface UpdateButtonProps {
  update: Update;
  onClick?: () => void;
}

export const UpdateButton = ({ update, onClick }: UpdateButtonProps) => (
  <Button 
    variant="ghost" 
    className="w-full justify-start h-auto p-4 hover:bg-accent"
    onClick={onClick}
  >
    <div className="flex items-start space-x-3 w-full max-w-full">
      <MessageCircle className="h-5 w-5 mt-1 flex-shrink-0 text-custom-pink" />
      <div className="flex-1 min-w-0 text-left">
        <p className="text-sm text-muted-foreground">{formatDate(update.date)}</p>
        <p className="text-base font-semibold truncate">{update.title}</p>
        <p className="text-sm text-muted-foreground line-clamp-2">{update.message}</p>
      </div>
    </div>
  </Button>
);
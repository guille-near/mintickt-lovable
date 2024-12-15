import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Update } from "../types";

interface UpdateButtonProps {
  update: Update;
}

export const UpdateButton = ({ update }: UpdateButtonProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  };

  return (
    <Button
      variant="outline"
      className="w-full justify-start text-left min-w-0 py-4"
    >
      <div className="flex items-center gap-2 w-full min-w-0">
        <MessageCircle className="h-4 w-4 flex-shrink-0 text-custom-pink" />
        <div className="truncate min-w-0 flex-1">
          <p className="font-medium truncate">{update.title}</p>
          <p className="text-sm text-muted-foreground truncate">
            {formatDate(update.date)}
          </p>
        </div>
        <MessageCircle className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
      </div>
    </Button>
  );
};
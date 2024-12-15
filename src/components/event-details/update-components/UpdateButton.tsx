import { cn } from "@/lib/utils";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "../utils";
import type { Update } from "../types";

interface UpdateButtonProps {
  update: Update;
  className?: string;
}

export const UpdateButton = ({ update, className }: UpdateButtonProps) => {
  return (
    <Button
      variant="outline"
      className={cn("w-full flex flex-col items-start p-4 h-auto space-y-1 hover:bg-accent max-w-full", className)}
    >
      <div className="w-full flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0 max-w-full">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <MessageCircle className="h-4 w-4 text-custom-pink shrink-0" />
            <time className="truncate">{formatDate(update.date)}</time>
          </div>
          <h3 className="font-semibold text-left truncate">{update.title}</h3>
          <p className="text-sm text-muted-foreground text-left overflow-hidden text-ellipsis line-clamp-2 break-words">
            {update.message}
          </p>
        </div>
      </div>
    </Button>
  );
};
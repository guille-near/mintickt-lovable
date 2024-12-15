import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { Update } from "../types";

interface UpdateButtonProps {
  update: Update;
  className?: string;
}

export const UpdateButton = ({ update, className }: UpdateButtonProps) => {
  return (
    <Button
      variant="outline"
      className={cn("w-full flex flex-col items-start p-4 h-auto space-y-1 hover:bg-accent", className)}
    >
      <div className="w-full flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-left truncate">{update.title}</h3>
          <p className="text-sm text-muted-foreground text-left line-clamp-2 break-words">
            {update.message}
          </p>
        </div>
        <time className="text-sm text-muted-foreground whitespace-nowrap">
          {new Date(update.date).toLocaleDateString()}
        </time>
      </div>
    </Button>
  );
};
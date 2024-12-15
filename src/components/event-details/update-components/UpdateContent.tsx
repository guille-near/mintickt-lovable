import { Update } from "../types";
import { formatDate } from "../utils";

interface UpdateContentProps {
  update: Update;
}

export const UpdateContent = ({ update }: UpdateContentProps) => (
  <div className="space-y-4">
    <p className="text-sm text-muted-foreground">{formatDate(update.date)}</p>
    <h2 className="text-2xl font-semibold">{update.title}</h2>
    <p className="text-base text-muted-foreground whitespace-pre-wrap">{update.message}</p>
  </div>
);
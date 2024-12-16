import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { Event } from "@/components/account/types";

interface EventsListProps {
  title: string;
  events: Event[];
}

export function EventsList({ title, events }: EventsListProps) {
  if (!events?.length) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="grid grid-cols-3 gap-3">
        {events.map((event) => (
          <Card key={event.id} className="aspect-square w-full">
            <CardContent className="p-4 h-full flex flex-col justify-center">
              <h3 className="font-semibold text-sm">{event.title}</h3>
              <p className="text-xs text-muted-foreground">
                {format(new Date(event.date), 'PPP')}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
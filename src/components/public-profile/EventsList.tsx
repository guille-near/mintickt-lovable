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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.map((event) => (
          <Card key={event.id}>
            <CardContent className="p-4">
              <h3 className="font-semibold">{event.title}</h3>
              <p className="text-sm text-muted-foreground">
                {format(new Date(event.date), 'PPP')}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
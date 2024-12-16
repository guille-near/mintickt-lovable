import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { Event } from "@/components/account/types";

const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
  "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
  "https://images.unsplash.com/photo-1518770660439-4636190af475",
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
  "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
];

interface EventsListProps {
  title: string;
  events: Event[];
}

export function EventsList({ title, events }: EventsListProps) {
  if (!events?.length) return null;

  const getPlaceholderImage = (index: number) => {
    return PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length];
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="grid grid-cols-3 gap-3">
        {events.map((event, index) => (
          <Card key={event.id} className="aspect-square w-full relative overflow-hidden group">
            {/* Background Image with Blur and Overlay */}
            <div 
              className="absolute inset-0 w-full h-full"
              style={{
                backgroundImage: `url(${event.image_url || getPlaceholderImage(index)})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {/* Blur and Dark Overlay */}
              <div className="absolute inset-0 backdrop-blur-sm bg-black/40 group-hover:bg-black/50 transition-colors" />
            </div>

            <CardContent className="p-4 h-full flex flex-col justify-center relative z-10">
              <h3 className="font-semibold text-sm text-white text-center">{event.title}</h3>
              <p className="text-xs text-white/80 text-center">
                {format(new Date(event.date), 'PPP')}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
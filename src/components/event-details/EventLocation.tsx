import { MapPin } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EventLocationProps {
  location: string;
  mapUrl: string;
}

export const EventLocation = ({ location, mapUrl }: EventLocationProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Location</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="aspect-video w-full overflow-hidden rounded-md">
            <iframe
              src={mapUrl}
              width="600"
              height="450"
              style={{border:0}}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            {location}
          </p>
          <Button variant="outline">
            <MapPin className="mr-2 h-4 w-4" /> Get Directions
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
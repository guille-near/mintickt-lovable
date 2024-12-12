import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface EventCardProps {
  title: string;
  date: string;
  price: number;
  image: string;
  id: string;
  location?: string;
}

export const EventCard = ({ title, date, image, id, location }: EventCardProps) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/event/${id}`);
  };

  return (
    <Card className="group relative overflow-hidden rounded-lg bg-card transition-all hover:shadow-lg">
      <div className="aspect-square overflow-hidden">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{date}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="flex items-center text-muted-foreground text-sm">
            <MapPin className="mr-2 h-4 w-4" />
            {location || 'Location TBA'}
          </span>
          <Button 
            onClick={handleViewDetails}
            variant="outline"
            className="hover:bg-accent"
          >
            View Details
          </Button>
        </div>
      </div>
    </Card>
  );
};
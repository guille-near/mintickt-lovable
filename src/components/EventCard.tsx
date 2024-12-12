import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface EventCardProps {
  title: string;
  date: string;
  image: string;
  id: string;
  location?: string;
  price?: number;
}

export const EventCard = ({ title, date, image, id, location, price }: EventCardProps) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/event/${id}`);
  };

  return (
    <Card className="group relative overflow-hidden rounded-lg bg-card transition-all hover:shadow-lg">
      <div className="flex flex-col md:block">
        <div className="flex md:block">
          <div className="flex-1 p-4 md:p-0">
            <h3 className="text-lg font-semibold text-foreground line-clamp-2 md:hidden">{title}</h3>
            <p className="mt-1 text-sm text-muted-foreground md:hidden">{date}</p>
            <div className="mt-2 flex items-center min-w-0 md:hidden">
              <MapPin className="mr-2 h-4 w-4 flex-shrink-0 text-muted-foreground" />
              <span className="text-sm text-muted-foreground truncate">
                {location || 'Location TBA'}
              </span>
            </div>
          </div>
          <div className="w-24 h-24 md:w-full md:h-auto md:aspect-square overflow-hidden">
            <img
              src={image}
              alt={title}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          </div>
        </div>
        
        {/* Desktop content */}
        <div className="hidden md:block p-4">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{date}</p>
          <div className="mt-4 flex items-center justify-between gap-2">
            <div className="flex items-center min-w-0 flex-1">
              <MapPin className="mr-2 h-4 w-4 flex-shrink-0 text-muted-foreground" />
              <span className="text-sm text-muted-foreground truncate">
                {location || 'Location TBA'}
              </span>
            </div>
            <Button 
              onClick={handleViewDetails}
              variant="outline"
              className="flex-shrink-0 hover:bg-accent"
            >
              View Details
            </Button>
          </div>
        </div>

        {/* Mobile button */}
        <div className="p-4 pt-0 md:hidden">
          <Button 
            onClick={handleViewDetails}
            variant="outline"
            className="w-full hover:bg-accent"
          >
            View Details
          </Button>
        </div>
      </div>
    </Card>
  );
};
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();

  const handleViewDetails = () => {
    navigate(`/event/${id}`);
  };

  if (isMobile) {
    return (
      <Card className="group relative overflow-hidden rounded-lg bg-card transition-all hover:shadow-lg">
        <div className="flex h-[120px]">
          <div className="w-[120px] min-w-[120px]">
            <img
              src={image}
              alt={title}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          </div>

          <div className="flex flex-col flex-1 p-4 justify-between">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground line-clamp-2">{title}</h3>
              <p className="text-sm text-muted-foreground">{date}</p>
              <div className="flex items-center min-w-0">
                <MapPin className="mr-2 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                <span className="text-sm text-muted-foreground truncate">
                  {location || 'Location TBA'}
                </span>
              </div>
            </div>

            <Button 
              onClick={handleViewDetails}
              variant="outline"
              className="mt-2 w-full hover:bg-accent"
            >
              View Details
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="group relative overflow-hidden rounded-lg bg-card transition-all hover:shadow-lg">
      <div className="flex flex-col">
        <div className="h-[200px] w-full">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </div>

        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground line-clamp-2">{title}</h3>
            <p className="text-sm text-muted-foreground">{date}</p>
            <div className="flex items-center min-w-0">
              <MapPin className="mr-2 h-4 w-4 flex-shrink-0 text-muted-foreground" />
              <span className="text-sm text-muted-foreground truncate">
                {location || 'Location TBA'}
              </span>
            </div>
          </div>

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
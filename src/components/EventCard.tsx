import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Heart } from "lucide-react";
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
      <Card 
        className="group relative overflow-hidden rounded-lg bg-card transition-all hover:shadow-lg cursor-pointer"
        onClick={handleViewDetails}
      >
        <div className="flex h-[100px]">
          <div className="w-[100px] min-w-[100px]">
            <img
              src={image}
              alt={title}
              className="h-full w-full object-cover transition-transform group-hover:scale-105 rounded-lg"
            />
          </div>

          <div className="flex flex-col flex-1 p-3 justify-between">
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-foreground line-clamp-1">{title}</h3>
              <p className="text-sm text-muted-foreground">{date}</p>
              <div className="flex items-center min-w-0">
                <MapPin className="mr-1 h-3 w-3 flex-shrink-0 text-muted-foreground" />
                <span className="text-sm text-muted-foreground truncate">
                  {location || 'Location TBA'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  const formattedPrice = price ? `€${price.toFixed(2)}` : 'Free';
  const formattedDate = new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div 
      className="group relative overflow-hidden cursor-pointer bg-white w-[70%]"
      onClick={handleViewDetails}
    >
      <div className="relative aspect-square">
        <div className="absolute top-4 right-4 flex gap-2 z-20">
          <Button 
            size="icon" 
            variant="ghost" 
            className="rounded-full bg-black/20 hover:bg-black/40 text-white"
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
        
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover rounded-lg"
        />
      </div>

      <div className="pl-2 pt-3 space-y-1">
        <h3 className="text-lg font-semibold line-clamp-1">{title}</h3>
        <div className="space-y-1 text-sm text-muted-foreground">
          <p>{formattedDate}</p>
          <div className="flex items-center">
            <MapPin className="mr-1 h-4 w-4" />
            <span className="truncate">
              {location || 'Location TBA'}
            </span>
          </div>
          <p className="font-medium text-foreground">{formattedPrice}</p>
        </div>
      </div>
    </div>
  );
};
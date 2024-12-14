import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Play, Heart } from "lucide-react";
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
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
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
    <Card 
      className="group relative overflow-hidden rounded-lg bg-festival text-white transition-all hover:bg-festival-hover cursor-pointer"
      onClick={handleViewDetails}
    >
      <div className="relative h-[400px] w-full">
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent z-10" />
        <div className="absolute top-4 right-4 flex gap-2 z-20">
          <Button 
            size="icon" 
            variant="ghost" 
            className="rounded-full bg-black/20 hover:bg-black/40 text-white"
          >
            <Play className="h-4 w-4" />
          </Button>
          <Button 
            size="icon" 
            variant="ghost" 
            className="rounded-full bg-black/20 hover:bg-black/40 text-white"
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
          <h3 className="text-2xl font-bold mb-2 line-clamp-2">{title}</h3>
          <div className="space-y-2">
            <p className="text-lg opacity-90">{formattedDate}</p>
            <div className="flex items-center text-lg opacity-90">
              <MapPin className="mr-2 h-5 w-5" />
              <span className="truncate">
                {location || 'Location TBA'}
              </span>
            </div>
            <p className="text-xl font-semibold">{formattedPrice}</p>
          </div>
        </div>

        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover"
        />
      </div>
    </Card>
  );
};
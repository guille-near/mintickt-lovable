import { Calendar, MapPin, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DesktopEventCardProps {
  title: string;
  date: string;
  image: string;
  location?: string;
  price?: number;
  onClick: () => void;
}

export const DesktopEventCard = ({ 
  title, 
  date, 
  image, 
  location, 
  price,
  onClick 
}: DesktopEventCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  };

  const formattedPrice = price ? `€${price.toFixed(2)}` : 'Free';

  return (
    <div 
      className="group relative overflow-hidden cursor-pointer w-[95%]"
      onClick={onClick}
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
        <div className="space-y-1 text-sm">
          <div className="flex items-center text-custom-pink relative after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:via-white/50 after:to-transparent after:animate-shine after:mask-gradient">
            <Calendar className="mr-1 h-4 w-4" />
            <p>{formatDate(date)}</p>
          </div>
          <div className="flex items-center text-muted-foreground">
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
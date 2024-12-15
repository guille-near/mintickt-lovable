import { Calendar, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";

interface MobileEventCardProps {
  title: string;
  date: string;
  image: string;
  location?: string;
  onClick: () => void;
}

export const MobileEventCard = ({ 
  title, 
  date, 
  image, 
  location, 
  onClick 
}: MobileEventCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  };

  return (
    <Card 
      className="group relative overflow-hidden rounded-lg bg-card transition-all hover:shadow-lg cursor-pointer"
      onClick={onClick}
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
            <div className="flex items-center text-custom-pink">
              <Calendar className="mr-1 h-3 w-3" />
              <p className="text-sm">{formatDate(date)}</p>
            </div>
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
};
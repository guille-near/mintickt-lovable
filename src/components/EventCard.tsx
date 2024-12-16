import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileEventCard } from "./event-card/MobileEventCard";
import { DesktopEventCard } from "./event-card/DesktopEventCard";

interface EventCardProps {
  title: string;
  date: string;
  image: string;
  id: string;
  location?: string;
  price?: number;
}

export const EventCard = ({ 
  title, 
  date, 
  image, 
  id, 
  location, 
  price 
}: EventCardProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleViewDetails = () => {
    navigate(`/event/${id}`);
  };

  if (isMobile) {
    return (
      <MobileEventCard
        title={title}
        date={date}
        image={image}
        location={location}
        onClick={handleViewDetails}
      />
    );
  }

  return (
    <DesktopEventCard
      title={title}
      date={date}
      image={image}
      location={location}
      price={price}
      onClick={handleViewDetails}
    />
  );
};
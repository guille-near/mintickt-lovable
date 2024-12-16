import { useNavigate, useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileEventCard } from "./event-card/MobileEventCard";
import { DesktopEventCard } from "./event-card/DesktopEventCard";

interface EventCardProps {
  title: string;
  date: string;
  image: string;
  id: string;
  eventLocation?: string;
  price?: number;
}

export const EventCard = ({ 
  title, 
  date, 
  image, 
  id, 
  eventLocation, 
  price 
}: EventCardProps) => {
  const navigate = useNavigate();
  const currentLocation = useLocation();
  const isMobile = useIsMobile();

  const handleViewDetails = () => {
    // If we're on the discover page, navigate internally
    if (currentLocation.pathname === '/discover') {
      navigate(`/event/${id}`);
    } else {
      // For other pages, open in new tab
      window.open(`/event/${id}`, '_blank');
    }
  };

  if (isMobile) {
    return (
      <MobileEventCard
        title={title}
        date={date}
        image={image}
        location={eventLocation}
        onClick={handleViewDetails}
      />
    );
  }

  return (
    <DesktopEventCard
      title={title}
      date={date}
      image={image}
      location={eventLocation}
      price={price}
      onClick={handleViewDetails}
    />
  );
};
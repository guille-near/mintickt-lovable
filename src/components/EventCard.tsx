import { useNavigate, useLocation } from "react-router-dom";
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
  const location = useLocation();
  const isMobile = useIsMobile();

  const handleViewDetails = () => {
    // If we're on the discover page, navigate internally
    if (location.pathname === '/discover') {
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
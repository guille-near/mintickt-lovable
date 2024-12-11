import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Ticket } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface EventCardProps {
  title: string;
  date: string;
  price: number;
  image: string;
  id: string;  // This is already correctly typed as string for UUID
}

export const EventCard = ({ title, date, price, image, id }: EventCardProps) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/event/${id}`);  // Using the UUID directly from props
  };

  return (
    <Card className="group relative overflow-hidden rounded-lg bg-card backdrop-blur-sm transition-all hover:scale-105">
      <div className="aspect-square overflow-hidden">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform group-hover:scale-110"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="mt-1 text-sm text-gray-300">{date}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="flex items-center text-accent">
            <Ticket className="mr-2 h-4 w-4" />
            {price} SOL
          </span>
          <Button 
            onClick={handleViewDetails}
            className="w-full bg-[#1d1d1d] text-white hover:bg-[#2d2d2d]"
          >
            View Details
          </Button>
        </div>
      </div>
    </Card>
  );
};
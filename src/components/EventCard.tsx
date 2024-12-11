import { Card } from "@/components/ui/card";
import { Ticket } from "lucide-react";

interface EventCardProps {
  title: string;
  date: string;
  price: number;
  image: string;
}

export const EventCard = ({ title, date, price, image }: EventCardProps) => {
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
          <button className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/80">
            View Details
          </button>
        </div>
      </div>
    </Card>
  );
};
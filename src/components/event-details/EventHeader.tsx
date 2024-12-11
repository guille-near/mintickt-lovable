import { Calendar, Clock, MapPin } from 'lucide-react';

interface EventHeaderProps {
  title: string;
  date: string;
  time: string;
  location: string;
}

export const EventHeader = ({ title, date, time, location }: EventHeaderProps) => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary">{title}</h1>
      <div className="space-y-4 text-muted-foreground">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          <span>{date}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          <span>{time}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          <span>{location}</span>
        </div>
      </div>
    </div>
  );
};
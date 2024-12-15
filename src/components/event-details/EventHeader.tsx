import { Calendar, Clock, MapPin, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface EventHeaderProps {
  title: string;
  date: string;
  time: string;
  location: string;
  organizerName: string;
  organizerAvatar?: string;
}

export const EventHeader = ({ 
  title, 
  date, 
  time, 
  location, 
  organizerName,
  organizerAvatar 
}: EventHeaderProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={organizerAvatar || ''} alt={organizerName} />
          <AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm text-muted-foreground">Hosted by</p>
          <p className="font-medium">{organizerName}</p>
        </div>
      </div>
      <div className="space-y-4 text-muted-foreground font-yrsa text-lg">
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
import { User2 } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { CalendarDays } from "lucide-react";

interface ProfileHeaderProps {
  username: string | null;
  bio: string | null;
  avatarUrl: string | null;
}

export function ProfileHeader({ username, bio, avatarUrl }: ProfileHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
      <Avatar className="h-24 w-24">
        <AvatarImage src={avatarUrl || undefined} alt={username || 'User'} />
        <AvatarFallback>
          <User2 className="h-12 w-12" />
        </AvatarFallback>
      </Avatar>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">@{username}</h1>
        </div>
        {bio && (
          <p className="text-muted-foreground max-w-2xl">{bio}</p>
        )}
      </div>
    </div>
  );
}
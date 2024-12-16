import { User2 } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { CalendarDays } from "lucide-react";
import { ProfileData } from "@/components/account/types";

interface ProfileHeaderProps {
  profile: ProfileData;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
      <Avatar className="h-24 w-24">
        <AvatarImage src={profile.avatar_url || undefined} alt={profile.username || 'User'} />
        <AvatarFallback>
          <User2 className="h-12 w-12" />
        </AvatarFallback>
      </Avatar>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">@{profile.username}</h1>
          {profile.wallet_address && (
            <img
              src="/solana-badge.svg"
              alt="Solana Verified"
              className="h-6 w-6"
            />
          )}
        </div>
        {profile.bio && (
          <p className="text-muted-foreground max-w-2xl">{profile.bio}</p>
        )}
        <div className="flex items-center text-sm text-muted-foreground">
          <CalendarDays className="mr-2 h-4 w-4" />
          Joined {format(new Date(profile.created_at), 'MMMM yyyy')}
        </div>
      </div>
    </div>
  );
}
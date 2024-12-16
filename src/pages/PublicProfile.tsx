import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays, Link2, User2 } from "lucide-react";
import { format } from "date-fns";
import { ProfileData } from "@/components/account/types";

export default function PublicProfile() {
  const { username } = useParams();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['public-profile', username],
    queryFn: async () => {
      console.log('Fetching profile for username:', username);
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();

      if (error) throw error;
      return profile as ProfileData;
    },
    enabled: !!username
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <User2 className="mx-auto h-12 w-12 text-gray-400" />
          <h1 className="text-2xl font-bold">Profile not found</h1>
          <p className="text-muted-foreground">
            The user @{username} doesn't exist or hasn't set up their profile yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Header */}
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

        {/* Interests */}
        {profile.interests && profile.interests.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Interests</h2>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest) => (
                <Badge key={interest} variant="secondary">
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Social Links */}
        {profile.social_media && Object.values(profile.social_media).some(link => link) && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Connect</h2>
            <div className="flex flex-wrap gap-4">
              {Object.entries(profile.social_media).map(([platform, url]) => {
                if (!url) return null;
                return (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Link2 className="h-4 w-4" />
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {/* Events */}
        {((profile.show_upcoming_events && profile.upcoming_events?.length > 0) ||
          (profile.show_past_events && profile.past_events?.length > 0)) && (
          <div className="space-y-6">
            {profile.show_upcoming_events && profile.upcoming_events?.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Upcoming Events</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.upcoming_events.map((event) => (
                    <Card key={event.id}>
                      <CardContent className="p-4">
                        <h3 className="font-semibold">{event.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(event.date), 'PPP')}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {profile.show_past_events && profile.past_events?.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Past Events</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.past_events.map((event) => (
                    <Card key={event.id}>
                      <CardContent className="p-4">
                        <h3 className="font-semibold">{event.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(event.date), 'PPP')}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
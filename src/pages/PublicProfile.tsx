import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { ProfileData } from "@/components/account/types";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { SocialLinks } from "@/components/profile/SocialLinks";
import { ProfileInterests } from "@/components/profile/ProfileInterests";
import { ProfileEvents } from "@/components/profile/ProfileEvents";
import { Json } from "@/integrations/supabase/types";

interface EventData {
  id: string;
  title: string;
  date: string;
}

export default function PublicProfile() {
  const params = useParams();
  const username = params.username?.replace('@', '');

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['public-profile', username],
    queryFn: async () => {
      console.log("Fetching profile for username:", username);
      
      if (!username) {
        throw new Error("No username provided");
      }

      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          username,
          email,
          avatar_url,
          bio,
          wallet_address,
          created_at,
          social_media,
          interests,
          show_upcoming_events,
          show_past_events,
          past_events,
          upcoming_events
        `)
        .eq('username', username)
        .single();

      console.log("Supabase response:", { data, error });

      if (error) {
        console.error("Error fetching profile:", error);
        throw error;
      }

      if (!data) {
        throw new Error("Profile not found");
      }

      // Parse social_media JSON if it exists
      const socialMedia = data.social_media ? 
        (typeof data.social_media === 'string' ? JSON.parse(data.social_media) : data.social_media) : 
        {
          x: null,
          linkedin: null,
          instagram: null,
          threads: null,
        };

      // Ensure past_events and upcoming_events are in the correct format
      const formatEvents = (events: Json[] | null): EventData[] => {
        if (!events) return [];
        return events.map(event => {
          if (typeof event === 'object' && event !== null) {
            return {
              id: String(event.id || ''),
              title: String(event.title || ''),
              date: String(event.date || ''),
            };
          }
          return {
            id: '',
            title: '',
            date: '',
          };
        });
      };

      const profileData: ProfileData = {
        id: data.id,
        username: data.username,
        email: data.email,
        avatar_url: data.avatar_url,
        bio: data.bio,
        wallet_address: data.wallet_address,
        created_at: data.created_at,
        social_media: socialMedia,
        interests: data.interests || [],
        show_upcoming_events: data.show_upcoming_events ?? true,
        show_past_events: data.show_past_events ?? true,
        past_events: formatEvents(data.past_events),
        upcoming_events: formatEvents(data.upcoming_events),
      };

      console.log("Processed profile data:", profileData);
      return profileData;
    },
    retry: 1,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    gcTime: 1000 * 60 * 10, // Keep unused data for 10 minutes
  });

  if (error) {
    console.error("Query error:", error);
    toast.error(error instanceof Error ? error.message : "Error loading profile");
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">
          {error instanceof Error ? error.message : "Error loading profile"}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    toast.error("Profile not found");
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">
          Profile not found
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <ProfileHeader profile={profile} />
        <SocialLinks socialMedia={profile.social_media} />
        <ProfileInterests interests={profile.interests} />
        
        {profile.show_upcoming_events && profile.upcoming_events?.length > 0 && (
          <ProfileEvents 
            title="Upcoming Events" 
            events={profile.upcoming_events} 
          />
        )}
        
        {profile.show_past_events && profile.past_events?.length > 0 && (
          <ProfileEvents 
            title="Past Events" 
            events={profile.past_events}
          />
        )}
      </div>
    </div>
  );
}
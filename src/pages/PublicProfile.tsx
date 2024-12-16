import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { ProfileData, SocialMedia } from "@/components/account/types";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { SocialLinks } from "@/components/profile/SocialLinks";
import { ProfileInterests } from "@/components/profile/ProfileInterests";
import { ProfileEvents } from "@/components/profile/ProfileEvents";

interface EventData {
  id: string;
  title: string;
  date: string;
}

interface RawEvent {
  id?: string | null;
  title?: string | null;
  date?: string | null;
}

export default function PublicProfile() {
  const params = useParams();
  const username = params.username?.replace('@', '');

  console.log("PublicProfile - Rendering with username:", username);

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['public-profile', username],
    queryFn: async () => {
      if (!username) {
        console.error("No username provided");
        throw new Error("No username provided");
      }

      console.log("Fetching profile for username:", username);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      if (!data) {
        console.error("No profile found for username:", username);
        throw new Error("Profile not found");
      }

      console.log("Raw profile data:", data);

      // Parse social_media JSON and ensure it matches SocialMedia type
      const defaultSocialMedia: SocialMedia = {
        x: null,
        linkedin: null,
        instagram: null,
        threads: null,
      };

      let socialMedia: SocialMedia;
      try {
        const parsedSocialMedia = typeof data.social_media === 'object' ? data.social_media : {};
        socialMedia = {
          ...defaultSocialMedia,
          ...parsedSocialMedia,
        };
      } catch (e) {
        console.error("Error parsing social media:", e);
        socialMedia = defaultSocialMedia;
      }

      // Helper function to safely parse events
      const parseEvents = (events: any[]): EventData[] => {
        if (!Array.isArray(events)) return [];
        
        return events.map((event: RawEvent) => ({
          id: String(event?.id || ''),
          title: String(event?.title || ''),
          date: String(event?.date || '')
        }));
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
        interests: Array.isArray(data.interests) ? data.interests : [],
        show_upcoming_events: data.show_upcoming_events ?? true,
        show_past_events: data.show_past_events ?? true,
        past_events: parseEvents(data.past_events || []),
        upcoming_events: parseEvents(data.upcoming_events || [])
      };

      console.log("Processed profile data:", profileData);
      return profileData;
    },
    retry: 1,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  console.log("Component state:", { isLoading, error, profile });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    console.error("Error in component:", error);
    toast.error(error instanceof Error ? error.message : "Error loading profile");
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">
          {error instanceof Error ? error.message : "Error loading profile"}
        </div>
      </div>
    );
  }

  if (!profile) {
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
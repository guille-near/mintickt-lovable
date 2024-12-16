import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileEvents } from "@/components/profile/ProfileEvents";
import { ProfileInterests } from "@/components/profile/ProfileInterests";
import { SocialLinks } from "@/components/profile/SocialLinks";
import { Skeleton } from "@/components/ui/skeleton";

interface ProfileData {
  id: string;
  username: string | null;
  email: string;
  avatar_url: string | null;
  bio: string | null;
  wallet_address: string | null;
  created_at: string;
  social_media: {
    x: string | null;
    linkedin: string | null;
    instagram: string | null;
    threads: string | null;
  };
  interests: string[];
  show_upcoming_events: boolean;
  show_past_events: boolean;
  past_events: Array<{
    id: string;
    title: string;
    date: string;
  }>;
  upcoming_events: Array<{
    id: string;
    title: string;
    date: string;
  }>;
}

export default function PublicProfile() {
  const { username } = useParams();
  console.log("PublicProfile - Rendering for username:", username);

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ["public-profile", username],
    queryFn: async () => {
      console.log("Fetching profile data for username:", username);
      if (!username) throw new Error("Username is required");

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", username)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        throw error;
      }

      console.log("Raw profile data:", data);
      return data as ProfileData;
    },
    enabled: !!username,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 space-y-8">
        <div className="space-y-4">
          <Skeleton className="h-32 w-32 rounded-full" />
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center text-red-500">
          <p>Error loading profile: {error.message}</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <p>Profile not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <ProfileHeader
        username={profile.username || ""}
        bio={profile.bio}
        avatarUrl={profile.avatar_url}
        walletAddress={profile.wallet_address}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-8">
          <SocialLinks socialMedia={profile.social_media} />
          <ProfileInterests interests={profile.interests} />
        </div>
        
        <div className="md:col-span-2 space-y-8">
          {profile.show_upcoming_events && profile.upcoming_events.length > 0 && (
            <ProfileEvents
              title="Upcoming Events"
              events={profile.upcoming_events}
            />
          )}
          
          {profile.show_past_events && profile.past_events.length > 0 && (
            <ProfileEvents
              title="Past Events"
              events={profile.past_events}
            />
          )}
        </div>
      </div>
    </div>
  );
}
import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProfileData } from "@/components/account/types";
import { toast } from "sonner";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { SocialLinks } from "@/components/profile/SocialLinks";
import { ProfileInterests } from "@/components/profile/ProfileInterests";
import { ProfileEvents } from "@/components/profile/ProfileEvents";

export default function PublicProfile() {
  const params = useParams();
  const username = params.username?.replace('@', ''); // Remove @ if present

  console.log("PublicProfile - Looking for username:", username);

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['public-profile', username],
    queryFn: async () => {
      if (!username) {
        console.error("PublicProfile - No username provided");
        toast.error("No username provided");
        throw new Error("No username provided");
      }

      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();

      console.log("PublicProfile - Query result:", { profiles, error });

      if (error) {
        console.error("PublicProfile - Supabase error:", error);
        toast.error("Error loading profile");
        throw error;
      }

      if (!profiles) {
        console.log("PublicProfile - No profile found");
        toast.error("Profile not found");
        return null;
      }

      // Parse social_media JSON if it exists
      const socialMedia = profiles.social_media ? 
        (typeof profiles.social_media === 'string' ? JSON.parse(profiles.social_media) : profiles.social_media) : 
        {
          x: null,
          linkedin: null,
          instagram: null,
          threads: null,
        };

      return {
        id: profiles.id,
        username: profiles.username,
        email: profiles.email,
        avatar_url: profiles.avatar_url,
        bio: profiles.bio,
        wallet_address: profiles.wallet_address,
        created_at: profiles.created_at,
        social_media: socialMedia,
        interests: profiles.interests || [],
        show_upcoming_events: profiles.show_upcoming_events ?? true,
        show_past_events: profiles.show_past_events ?? true,
        past_events: profiles.past_events || [],
        upcoming_events: profiles.upcoming_events || [],
      } as ProfileData;
    },
    enabled: !!username,
  });

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
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">
          Error loading profile. Please try again later.
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Profile not found</h2>
          <p className="text-muted-foreground mt-2">
            The user @{username} doesn't exist or hasn't set up their profile yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="space-y-8">
        <ProfileHeader profile={profile} />
        <SocialLinks socialMedia={profile.social_media} />
        <ProfileInterests interests={profile.interests} />
        
        {profile.show_upcoming_events && (
          <ProfileEvents 
            title="Upcoming Events" 
            events={profile.upcoming_events} 
          />
        )}
        
        {profile.show_past_events && (
          <ProfileEvents 
            title="Past Events" 
            events={profile.past_events} 
          />
        )}
      </div>
    </div>
  );
}
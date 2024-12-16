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

  const { data: profile, isLoading } = useQuery({
    queryKey: ['public-profile', username],
    queryFn: async () => {
      if (!username) {
        toast.error("No username provided");
        throw new Error("No username provided");
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        toast.error("Error loading profile");
        throw error;
      }

      if (!data) {
        toast.error("Profile not found");
        return null;
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

      return {
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
        past_events: data.past_events || [],
        upcoming_events: data.upcoming_events || [],
      } as ProfileData;
    },
    retry: false,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    gcTime: 1000 * 60 * 10, // Keep unused data for 10 minutes
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
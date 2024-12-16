import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProfileData } from "@/components/account/types";
import { ProfileHeader } from "@/components/public-profile/ProfileHeader";
import { ProfileInterests } from "@/components/public-profile/ProfileInterests";
import { ProfileSocialLinks } from "@/components/public-profile/ProfileSocialLinks";
import { EventsList } from "@/components/public-profile/EventsList";
import { LoadingState } from "@/components/public-profile/LoadingState";
import { ErrorState } from "@/components/public-profile/ErrorState";

export default function PublicProfile() {
  const params = useParams();
  // Extract username from either /@:username or /profile/:username format
  const username = params["*"] || params.username;

  console.log('Attempting to load profile for username:', username);

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['public-profile', username],
    queryFn: async () => {
      console.log('Starting profile query for username:', username);
      
      if (!username) {
        console.error('No username provided');
        throw new Error('No username provided');
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();

      console.log('Supabase response:', { profile, error });

      if (error) {
        console.error('Supabase query error:', error);
        throw error;
      }

      if (!profile) {
        console.error('No profile found for username:', username);
        throw new Error('Profile not found');
      }

      return {
        ...profile,
        social_media: profile.social_media || {
          x: null,
          linkedin: null,
          instagram: null,
          threads: null
        },
        interests: profile.interests || [],
        past_events: profile.past_events || [],
        upcoming_events: profile.upcoming_events || [],
        show_upcoming_events: profile.show_upcoming_events ?? true,
        show_past_events: profile.show_past_events ?? true,
      } as ProfileData;
    },
    enabled: !!username,
    retry: 1
  });

  console.log('Query state:', { isLoading, error, profile });

  if (isLoading) {
    console.log('Loading state displayed');
    return <LoadingState />;
  }

  if (error || !profile) {
    console.error('Error state displayed:', error);
    return <ErrorState username={username || ''} />;
  }

  console.log('Rendering profile:', profile);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <ProfileHeader profile={profile} />
        <ProfileInterests interests={profile.interests} />
        <ProfileSocialLinks socialMedia={profile.social_media} />
        
        {profile.show_upcoming_events && profile.upcoming_events?.length > 0 && (
          <EventsList title="Upcoming Events" events={profile.upcoming_events} />
        )}
        {profile.show_past_events && profile.past_events?.length > 0 && (
          <EventsList title="Past Events" events={profile.past_events} />
        )}
      </div>
    </div>
  );
}
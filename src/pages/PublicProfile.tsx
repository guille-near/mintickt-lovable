import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProfileData, SocialMediaLinks } from "@/components/account/types";
import { ProfileHeader } from "@/components/public-profile/ProfileHeader";
import { ProfileInterests } from "@/components/public-profile/ProfileInterests";
import { ProfileSocialLinks } from "@/components/public-profile/ProfileSocialLinks";
import { EventsList } from "@/components/public-profile/EventsList";
import { LoadingState } from "@/components/public-profile/LoadingState";
import { ErrorState } from "@/components/public-profile/ErrorState";

export default function PublicProfile() {
  // Get username from URL parameters and clean it
  const params = useParams();
  const rawUsername = params.username || '';
  const username = rawUsername.replace('@', '');
  
  console.log('[PublicProfile] Route params:', params);
  console.log('[PublicProfile] Processing username:', { rawUsername, username });

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['public-profile', username],
    queryFn: async () => {
      try {
        console.log('[PublicProfile] Starting profile query for username:', username);
        
        if (!username) {
          console.error('[PublicProfile] No username provided in URL');
          throw new Error('No username provided');
        }

        console.log('[PublicProfile] Executing Supabase query for username:', username);
        const { data: profile, error: supabaseError } = await supabase
          .from('profiles')
          .select('*')
          .eq('username', username)
          .single();

        console.log('[PublicProfile] Raw Supabase response:', { profile, error: supabaseError });

        if (supabaseError) {
          console.error('[PublicProfile] Supabase query error:', supabaseError);
          throw supabaseError;
        }

        if (!profile) {
          console.error('[PublicProfile] No profile found for username:', username);
          throw new Error('Profile not found');
        }

        // Parse social_media to ensure correct structure
        let socialMedia: SocialMediaLinks;
        try {
          const rawSocialMedia = typeof profile.social_media === 'string' 
            ? JSON.parse(profile.social_media)
            : profile.social_media || {};

          socialMedia = {
            x: rawSocialMedia.x ?? null,
            linkedin: rawSocialMedia.linkedin ?? null,
            instagram: rawSocialMedia.instagram ?? null,
            threads: rawSocialMedia.threads ?? null
          };
          console.log('[PublicProfile] Parsed social media:', socialMedia);
        } catch (e) {
          console.error('[PublicProfile] Error parsing social_media:', e);
          socialMedia = {
            x: null,
            linkedin: null,
            instagram: null,
            threads: null
          };
        }

        // Transform the profile data to match ProfileData type
        const transformedProfile: ProfileData = {
          id: profile.id,
          username: profile.username,
          bio: profile.bio,
          email: profile.email,
          wallet_address: profile.wallet_address,
          avatar_url: profile.avatar_url,
          created_at: profile.created_at,
          social_media: socialMedia,
          interests: profile.interests || [],
          show_upcoming_events: profile.show_upcoming_events ?? true,
          show_past_events: profile.show_past_events ?? true,
          past_events: Array.isArray(profile.past_events) ? profile.past_events.map((event: any) => ({
            id: event.id || '',
            title: event.title || '',
            date: event.date || new Date().toISOString()
          })) : [],
          upcoming_events: Array.isArray(profile.upcoming_events) ? profile.upcoming_events.map((event: any) => ({
            id: event.id || '',
            title: event.title || '',
            date: event.date || new Date().toISOString()
          })) : []
        };

        console.log('[PublicProfile] Transformed profile data:', transformedProfile);
        return transformedProfile;
      } catch (error) {
        console.error('[PublicProfile] Error in queryFn:', error);
        throw error;
      }
    },
    enabled: !!username,
    retry: 1
  });

  console.log('[PublicProfile] Component render state:', { 
    isLoading, 
    hasError: !!error, 
    errorDetails: error,
    hasProfile: !!profile 
  });

  if (isLoading) {
    console.log('[PublicProfile] Rendering loading state');
    return <LoadingState />;
  }

  if (error || !profile) {
    console.error('[PublicProfile] Rendering error state:', error);
    return <ErrorState username={rawUsername} />;
  }

  console.log('[PublicProfile] Rendering profile component with data:', profile);

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
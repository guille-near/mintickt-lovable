import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SimpleHeader } from "@/components/SimpleHeader";
import { ProfileHeader } from "@/components/public-profile/ProfileHeader";
import { ProfileInterests } from "@/components/public-profile/ProfileInterests";
import { ProfileSocialLinks } from "@/components/public-profile/ProfileSocialLinks";
import { EventsList } from "@/components/public-profile/EventsList";
import { LoadingState } from "@/components/public-profile/LoadingState";
import { ErrorState } from "@/components/public-profile/ErrorState";
import { convertFromDbProfile } from "@/components/account/profileUtils";

export default function PublicProfile() {
  const { username } = useParams<{ username: string }>();
  
  console.log('🔍 [PublicProfile] Component mounted with username:', username);

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['public-profile', username],
    queryFn: async () => {
      console.log('📡 [PublicProfile] Starting profile fetch for username:', username);

      if (!username) {
        console.error('❌ [PublicProfile] No username provided');
        throw new Error('Username is required');
      }

      // Log the SQL query we're about to make
      console.log('🔍 [PublicProfile] Querying profiles table for username:', username);

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();

      console.log('📦 [PublicProfile] Raw Supabase response:', { 
        profileData, 
        error: profileError,
        hasData: !!profileData,
        errorMessage: profileError?.message 
      });

      if (profileError) {
        console.error('❌ [PublicProfile] Error loading profile:', profileError);
        throw new Error(profileError.message);
      }

      if (!profileData) {
        console.error('❌ [PublicProfile] No profile found for username:', username);
        throw new Error('Profile not found');
      }

      console.log('✨ [PublicProfile] Profile data found:', {
        id: profileData.id,
        username: profileData.username,
        hasSocialMedia: !!profileData.social_media,
        hasInterests: Array.isArray(profileData.interests) && profileData.interests.length > 0,
        hasUpcomingEvents: Array.isArray(profileData.upcoming_events) && profileData.upcoming_events.length > 0,
        hasPastEvents: Array.isArray(profileData.past_events) && profileData.past_events.length > 0
      });

      const parsedProfile = convertFromDbProfile(profileData);
      console.log('✅ [PublicProfile] Profile parsed successfully:', {
        id: parsedProfile.id,
        username: parsedProfile.username,
        socialMedia: parsedProfile.social_media,
        interestsCount: parsedProfile.interests.length,
        upcomingEventsCount: parsedProfile.upcoming_events.length,
        pastEventsCount: parsedProfile.past_events.length
      });

      return parsedProfile;
    },
    retry: false,
  });

  console.log('🔄 [PublicProfile] Current state:', { 
    hasProfile: !!profile,
    isLoading, 
    hasError: !!error,
    errorMessage: error?.message
  });

  if (isLoading) {
    console.log('⏳ [PublicProfile] Rendering loading state');
    return <LoadingState />;
  }

  if (error || !profile) {
    console.error('❌ [PublicProfile] Rendering error state:', error);
    return <ErrorState username={username || ''} />;
  }

  console.log('✨ [PublicProfile] Rendering profile:', {
    username: profile.username,
    hasSocialMedia: Object.values(profile.social_media).some(link => link),
    hasInterests: profile.interests.length > 0,
    showUpcomingEvents: profile.show_upcoming_events,
    showPastEvents: profile.show_past_events,
    upcomingEventsCount: profile.upcoming_events.length,
    pastEventsCount: profile.past_events.length
  });

  return (
    <div className="min-h-screen flex flex-col dark:bg-[linear-gradient(135deg,#FF00E5_1%,transparent_8%),_linear-gradient(315deg,rgba(94,255,69,0.25)_0.5%,transparent_8%)] dark:bg-black">
      <SimpleHeader />
      <div className="flex-1 container mx-auto px-4 py-8 space-y-8">
        <ProfileHeader profile={profile} />
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-8">
            <ProfileSocialLinks socialMedia={profile.social_media} />
            <ProfileInterests interests={profile.interests} />
          </div>
          <div className="space-y-8">
            {profile.show_upcoming_events && (
              <EventsList
                title="Upcoming Events"
                events={profile.upcoming_events}
              />
            )}
            {profile.show_past_events && (
              <EventsList
                title="Past Events"
                events={profile.past_events}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
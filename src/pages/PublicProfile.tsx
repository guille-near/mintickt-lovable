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
import { Event, ProfileData, SocialMediaLinks } from "@/components/account/types";

export default function PublicProfile() {
  const { username } = useParams<{ username: string }>();
  
  console.log('🔍 [PublicProfile] Component mounted with username:', username);

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['public-profile', username],
    queryFn: async () => {
      console.log('📡 [PublicProfile] Starting profile fetch for username:', username);

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();

      console.log('📦 [PublicProfile] Supabase response:', { profileData, profileError });

      if (profileError) {
        console.error('❌ [PublicProfile] Error loading profile:', profileError);
        throw new Error(profileError.message);
      }

      if (!profileData) {
        console.error('❌ [PublicProfile] No profile found');
        throw new Error('Profile not found');
      }

      // Parse social media data
      const socialMedia: SocialMediaLinks = typeof profileData.social_media === 'string'
        ? JSON.parse(profileData.social_media)
        : profileData.social_media || {
            x: null,
            linkedin: null,
            instagram: null,
            threads: null
          };

      // Parse events arrays
      const parseEvents = (events: any[] | null): Event[] => {
        if (!events) return [];
        return events.map(event => ({
          id: event.id,
          title: event.title,
          date: event.date,
        }));
      };

      const parsedProfile: ProfileData = {
        id: profileData.id,
        email: profileData.email,
        username: profileData.username,
        avatar_url: profileData.avatar_url,
        bio: profileData.bio,
        created_at: profileData.created_at,
        wallet_address: profileData.wallet_address,
        social_media: socialMedia,
        interests: profileData.interests || [],
        show_upcoming_events: profileData.show_upcoming_events ?? true,
        show_past_events: profileData.show_past_events ?? true,
        upcoming_events: parseEvents(profileData.upcoming_events),
        past_events: parseEvents(profileData.past_events),
      };

      console.log('✅ [PublicProfile] Profile parsed successfully:', parsedProfile);
      return parsedProfile;
    },
  });

  console.log('🔄 [PublicProfile] Current state:', { profile, isLoading, error });

  if (isLoading) {
    console.log('⏳ [PublicProfile] Loading state');
    return <LoadingState />;
  }

  if (error || !profile) {
    console.error('❌ [PublicProfile] Error state:', error);
    return <ErrorState username={username || ''} />;
  }

  console.log('✨ [PublicProfile] Rendering profile:', profile);

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
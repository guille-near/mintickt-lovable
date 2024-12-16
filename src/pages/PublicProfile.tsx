import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LoadingState } from "@/components/public-profile/LoadingState";
import { ErrorState } from "@/components/public-profile/ErrorState";
import { ProfileHeader } from "@/components/public-profile/ProfileHeader";
import { ProfileSocialLinks } from "@/components/public-profile/ProfileSocialLinks";
import { ProfileInterests } from "@/components/public-profile/ProfileInterests";
import { EventsList } from "@/components/public-profile/EventsList";
import { Event, SocialMediaLinks } from "@/components/account/types";
import { convertFromDbProfile } from "@/components/account/profileConverters";
import { SimpleHeader } from "@/components/SimpleHeader";
import { Json } from "@/integrations/supabase/types";

interface Profile {
  id: string;
  username: string | null;
  bio: string | null;
  avatar_url: string | null;
  social_media: SocialMediaLinks;
  interests: string[];
  upcoming_events: Event[];
  past_events: Event[];
  show_upcoming_events: boolean;
  show_past_events: boolean;
}

const PublicProfile = () => {
  console.log('🎯 [PublicProfile] Component mounted');
  const { username: rawUsername } = useParams();
  const username = rawUsername?.replace('@', '');
  
  console.log('🎯 [PublicProfile] Username param:', username);

  const fetchProfile = async () => {
    console.log('🎯 [PublicProfile] Fetching profile for username:', username);
    
    if (!username) {
      throw new Error('Username is required');
    }

    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id,
        username,
        bio,
        avatar_url,
        social_media,
        interests,
        upcoming_events,
        past_events,
        show_upcoming_events,
        show_past_events,
        email,
        created_at,
        wallet_address
      `)
      .eq('username', username)
      .single();

    console.log('🎯 [PublicProfile] Supabase response:', { data, error });

    if (error) {
      console.error('🎯 [PublicProfile] Error fetching profile:', error);
      throw error;
    }

    if (!data) {
      console.error('🎯 [PublicProfile] No profile found');
      throw new Error('Profile not found');
    }

    const convertedProfile = convertFromDbProfile(data);
    const profile: Profile = {
      id: convertedProfile.id,
      username: convertedProfile.username,
      bio: convertedProfile.bio,
      avatar_url: convertedProfile.avatar_url,
      social_media: convertedProfile.social_media,
      interests: convertedProfile.interests,
      upcoming_events: convertedProfile.upcoming_events,
      past_events: convertedProfile.past_events,
      show_upcoming_events: convertedProfile.show_upcoming_events,
      show_past_events: convertedProfile.show_past_events
    };

    console.log('🎯 [PublicProfile] Processed profile:', profile);
    return profile;
  };

  const {
    data: profile,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['profile', username],
    queryFn: fetchProfile,
    retry: false,
    enabled: !!username,
  });

  console.log('🎯 [PublicProfile] Query state:', {
    isLoading,
    error,
    hasProfile: !!profile
  });

  if (!username) {
    console.log('🎯 [PublicProfile] No username provided');
    return (
      <div className="min-h-screen flex flex-col dark:bg-[linear-gradient(135deg,#FF00E5_1%,transparent_8%),_linear-gradient(315deg,rgba(94,255,69,0.25)_0.5%,transparent_8%)] dark:bg-black">
        <SimpleHeader />
        <ErrorState username="" />
      </div>
    );
  }

  if (isLoading) {
    console.log('🎯 [PublicProfile] Rendering loading state');
    return (
      <div className="min-h-screen flex flex-col dark:bg-[linear-gradient(135deg,#FF00E5_1%,transparent_8%),_linear-gradient(315deg,rgba(94,255,69,0.25)_0.5%,transparent_8%)] dark:bg-black">
        <SimpleHeader />
        <LoadingState />
      </div>
    );
  }

  if (error || !profile) {
    console.log('🎯 [PublicProfile] Rendering error state');
    return (
      <div className="min-h-screen flex flex-col dark:bg-[linear-gradient(135deg,#FF00E5_1%,transparent_8%),_linear-gradient(315deg,rgba(94,255,69,0.25)_0.5%,transparent_8%)] dark:bg-black">
        <SimpleHeader />
        <ErrorState username={username} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col dark:bg-[linear-gradient(135deg,#FF00E5_1%,transparent_8%),_linear-gradient(315deg,rgba(94,255,69,0.25)_0.5%,transparent_8%)] dark:bg-black">
      <SimpleHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <ProfileHeader
            username={profile.username || ''}
            bio={profile.bio || ''}
            avatarUrl={profile.avatar_url || ''}
          />

          <ProfileSocialLinks socialMedia={profile.social_media} />

          <ProfileInterests interests={profile.interests} />

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
  );
};

export default PublicProfile;
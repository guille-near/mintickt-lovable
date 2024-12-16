import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LoadingState } from "@/components/public-profile/LoadingState";
import { ErrorState } from "@/components/public-profile/ErrorState";
import { ProfileHeader } from "@/components/public-profile/ProfileHeader";
import { ProfileSocialLinks } from "@/components/public-profile/ProfileSocialLinks";
import { ProfileInterests } from "@/components/public-profile/ProfileInterests";
import { EventsList } from "@/components/public-profile/EventsList";
import { Event } from "@/components/account/types";
import AuthenticatedLayout from "@/components/AuthenticatedLayout";

interface Profile {
  id: string;
  username: string | null;
  bio: string | null;
  avatar_url: string | null;
  social_media: {
    x: string | null;
    threads: string | null;
    linkedin: string | null;
    instagram: string | null;
  };
  interests: string[];
  upcoming_events: Event[];
  past_events: Event[];
  show_upcoming_events: boolean;
  show_past_events: boolean;
}

const PublicProfile = () => {
  console.log('🎯 [PublicProfile] Component mounted');
  const { username } = useParams<{ username: string }>();
  console.log('🎯 [PublicProfile] Username param:', username);

  const fetchProfile = async () => {
    console.log('🎯 [PublicProfile] Fetching profile for username:', username);
    
    if (!username) {
      console.error('🎯 [PublicProfile] No username provided');
      throw new Error('Username is required');
    }

    const cleanUsername = username.startsWith('@') ? username.slice(1) : username;
    console.log('🎯 [PublicProfile] Clean username:', cleanUsername);

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
        show_past_events
      `)
      .eq('username', cleanUsername)
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

    return data as Profile;
  };

  const {
    data: profile,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['profile', username],
    queryFn: fetchProfile,
    retry: false,
  });

  console.log('🎯 [PublicProfile] Query state:', {
    isLoading,
    error,
    hasProfile: !!profile
  });

  if (isLoading) {
    console.log('🎯 [PublicProfile] Rendering loading state');
    return (
      <AuthenticatedLayout>
        <LoadingState />
      </AuthenticatedLayout>
    );
  }

  if (error || !profile) {
    console.log('🎯 [PublicProfile] Rendering error state');
    return (
      <AuthenticatedLayout>
        <ErrorState username={username?.startsWith('@') ? username.slice(1) : username || ''} />
      </AuthenticatedLayout>
    );
  }

  console.log('🎯 [PublicProfile] Rendering profile:', profile);

  return (
    <AuthenticatedLayout>
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <ProfileHeader
            username={profile.username}
            bio={profile.bio}
            avatarUrl={profile.avatar_url}
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
    </AuthenticatedLayout>
  );
};

export default PublicProfile;
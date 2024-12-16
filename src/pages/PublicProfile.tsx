import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProfileData, SocialMediaLinks, Event } from "@/components/account/types";
import { ProfileHeader } from "@/components/public-profile/ProfileHeader";
import { ProfileInterests } from "@/components/public-profile/ProfileInterests";
import { ProfileSocialLinks } from "@/components/public-profile/ProfileSocialLinks";
import { EventsList } from "@/components/public-profile/EventsList";
import { LoadingState } from "@/components/public-profile/LoadingState";
import { ErrorState } from "@/components/public-profile/ErrorState";
import { Json } from "@/integrations/supabase/types";

export default function PublicProfile() {
  const params = useParams<{ username: string }>();
  const rawUsername = params.username || '';
  const username = rawUsername.replace('@', '');
  
  console.log('🔍 [PublicProfile] Attempting to fetch profile for username:', username);

  const fetchProfile = async () => {
    console.log('📡 [PublicProfile] Executing Supabase query for username:', username);
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .single();
    
    console.log('📦 [PublicProfile] Supabase response:', { data, error });

    if (error) {
      console.error('❌ [PublicProfile] Supabase error:', error);
      throw error;
    }

    if (!data) {
      console.error('❌ [PublicProfile] No profile found for username:', username);
      throw new Error('Profile not found');
    }

    return data;
  };

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['public-profile', username],
    queryFn: fetchProfile,
    enabled: Boolean(username),
    retry: 1
  });

  console.log('🎯 [PublicProfile] Component state:', { 
    username,
    isLoading, 
    hasError: Boolean(error), 
    hasProfile: Boolean(profile) 
  });

  if (isLoading) {
    console.log('⏳ [PublicProfile] Loading state');
    return <LoadingState />;
  }

  if (error || !profile) {
    console.error('❌ [PublicProfile] Error state:', error);
    return <ErrorState username={rawUsername} />;
  }

  // Parse social media data
  let socialMedia: SocialMediaLinks;
  try {
    const rawSocialMedia = typeof profile.social_media === 'string' 
      ? JSON.parse(profile.social_media)
      : profile.social_media || {};

    socialMedia = {
      x: rawSocialMedia?.x ?? null,
      linkedin: rawSocialMedia?.linkedin ?? null,
      instagram: rawSocialMedia?.instagram ?? null,
      threads: rawSocialMedia?.threads ?? null
    };
  } catch (e) {
    console.error('Error parsing social_media:', e);
    socialMedia = {
      x: null,
      linkedin: null,
      instagram: null,
      threads: null
    };
  }

  // Parse events arrays
  const parseEvents = (events: Json[] | null): Event[] => {
    if (!Array.isArray(events)) return [];
    return events.map((event: any) => ({
      id: event.id || '',
      title: event.title || '',
      date: event.date || ''
    }));
  };

  // Transform profile data
  const transformedProfile: ProfileData = {
    id: profile.id,
    username: profile.username,
    bio: profile.bio,
    email: profile.email,
    wallet_address: profile.wallet_address,
    avatar_url: profile.avatar_url,
    created_at: profile.created_at,
    social_media: socialMedia,
    interests: Array.isArray(profile.interests) ? profile.interests : [],
    show_upcoming_events: profile.show_upcoming_events ?? true,
    show_past_events: profile.show_past_events ?? true,
    past_events: parseEvents(profile.past_events),
    upcoming_events: parseEvents(profile.upcoming_events)
  };

  console.log('✅ [PublicProfile] Rendering profile:', transformedProfile);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <ProfileHeader profile={transformedProfile} />
        <ProfileInterests interests={transformedProfile.interests} />
        <ProfileSocialLinks socialMedia={transformedProfile.social_media} />
        
        {transformedProfile.show_upcoming_events && transformedProfile.upcoming_events?.length > 0 && (
          <EventsList title="Upcoming Events" events={transformedProfile.upcoming_events} />
        )}
        {transformedProfile.show_past_events && transformedProfile.past_events?.length > 0 && (
          <EventsList title="Past Events" events={transformedProfile.past_events} />
        )}
      </div>
    </div>
  );
}
import { Json } from "@/integrations/supabase/types";
import { ProfileData, ProfileDbData, SocialMediaLinks } from "./types";

export const convertToDbProfile = (profile: Partial<ProfileData>): Partial<ProfileDbData> => {
  const socialMedia = profile.social_media ? {
    x: profile.social_media.x,
    linkedin: profile.social_media.linkedin,
    instagram: profile.social_media.instagram,
    threads: profile.social_media.threads
  } as Json : undefined;

  const pastEvents = profile.past_events ? profile.past_events.map(event => ({
    id: event.id,
    title: event.title,
    date: event.date
  })) as Json[] : undefined;

  const upcomingEvents = profile.upcoming_events ? profile.upcoming_events.map(event => ({
    id: event.id,
    title: event.title,
    date: event.date
  })) as Json[] : undefined;

  return {
    id: profile.id,
    email: profile.email,
    username: profile.username,
    bio: profile.bio,
    wallet_address: profile.wallet_address,
    avatar_url: profile.avatar_url,
    created_at: profile.created_at,
    social_media: socialMedia,
    interests: Array.isArray(profile.interests) ? [...profile.interests] : [],
    show_upcoming_events: profile.show_upcoming_events ?? true,
    show_past_events: profile.show_past_events ?? true,
    past_events: pastEvents,
    upcoming_events: upcomingEvents,
  };
};

export const convertFromDbProfile = (profile: ProfileDbData): ProfileData => {
  const socialMedia = profile.social_media as SocialMediaLinks;
  
  return {
    id: profile.id,
    email: profile.email,
    username: profile.username,
    bio: profile.bio,
    wallet_address: profile.wallet_address,
    avatar_url: profile.avatar_url,
    created_at: profile.created_at,
    social_media: socialMedia,
    interests: [...(profile.interests || [])],
    show_upcoming_events: profile.show_upcoming_events,
    show_past_events: profile.show_past_events,
    past_events: profile.past_events?.map(event => ({
      id: (event as any).id,
      title: (event as any).title,
      date: (event as any).date
    })) || [],
    upcoming_events: profile.upcoming_events?.map(event => ({
      id: (event as any).id,
      title: (event as any).title,
      date: (event as any).date
    })) || []
  };
};
import { ProfileData, SocialMediaLinks, Event } from "./types";

export const convertFromDbProfile = (profile: any): ProfileData => {
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
  } catch (e) {
    console.error('❌ Error parsing social_media:', e);
    socialMedia = {
      x: null,
      linkedin: null,
      instagram: null,
      threads: null
    };
  }

  // Parse events arrays and ensure they match Event type
  const pastEvents = (profile.past_events || []).map((event: any): Event => ({
    id: event.id || '',
    title: event.title || '',
    date: event.date || ''
  }));

  const upcomingEvents = (profile.upcoming_events || []).map((event: any): Event => ({
    id: event.id || '',
    title: event.title || '',
    date: event.date || ''
  }));

  return {
    id: profile.id,
    email: profile.email,
    username: profile.username,
    bio: profile.bio,
    wallet_address: profile.wallet_address,
    avatar_url: profile.avatar_url,
    created_at: profile.created_at,
    social_media: socialMedia,
    interests: profile.interests || [],
    show_upcoming_events: profile.show_upcoming_events ?? true,
    show_past_events: profile.show_past_events ?? true,
    past_events: pastEvents,
    upcoming_events: upcomingEvents
  };
};
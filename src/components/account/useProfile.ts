import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ProfileData, Event, SocialMediaLinks, ProfileDbData } from "./types";
import { Json } from "@/integrations/supabase/types";

const convertToDbProfile = (profile: Partial<ProfileData>): Partial<ProfileDbData> => {
  return {
    ...profile,
    social_media: profile.social_media as unknown as Json,
    past_events: profile.past_events?.map(event => ({
      id: event.id,
      title: event.title,
      date: event.date
    })) as unknown as Json[],
    upcoming_events: profile.upcoming_events?.map(event => ({
      id: event.id,
      title: event.title,
      date: event.date
    })) as unknown as Json[]
  };
};

const convertFromDbProfile = (profile: any): ProfileData => {
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
    id: event.id,
    title: event.title,
    date: event.date
  }));

  const upcomingEvents = (profile.upcoming_events || []).map((event: any): Event => ({
    id: event.id,
    title: event.title,
    date: event.date
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

export function useProfile(userId: string | undefined) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      console.log('🔍 Fetching profile for userId:', userId);
      
      if (!userId) {
        console.log('❌ No user ID provided');
        throw new Error('No user ID provided');
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      console.log('📦 Profile fetch result:', { profile, error });

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('🆕 Profile not found, creating new profile');
          const { data: userData } = await supabase.auth.getUser();
          if (!userData.user) {
            console.log('❌ No authenticated user found');
            throw new Error('No authenticated user found');
          }

          const defaultSocialMedia: SocialMediaLinks = {
            x: null,
            linkedin: null,
            instagram: null,
            threads: null
          };

          const newProfile: ProfileData = {
            id: userId,
            email: userData.user.email || '',
            username: null,
            bio: null,
            wallet_address: null,
            avatar_url: null,
            social_media: defaultSocialMedia,
            interests: [],
            show_upcoming_events: true,
            show_past_events: true,
            past_events: [],
            upcoming_events: [],
            created_at: new Date().toISOString()
          };

          const { data: createdProfile, error: createError } = await supabase
            .from('profiles')
            .insert([convertToDbProfile(newProfile)])
            .select()
            .single();

          console.log('📦 Profile creation result:', { createdProfile, createError });

          if (createError) {
            console.error('❌ Error creating profile:', createError);
            toast.error('Error creating profile');
            throw createError;
          }

          return newProfile;
        }

        console.error('❌ Error fetching profile:', error);
        throw error;
      }

      const typedProfile = convertFromDbProfile(profile);
      console.log('✅ Returning formatted profile:', typedProfile);
      return typedProfile;
    },
    enabled: !!userId,
    retry: 1,
  });
}
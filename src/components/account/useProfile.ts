import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ProfileData, Event } from "./types";

export function useProfile(userId: string | undefined) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      console.log('Fetching profile for userId:', userId);
      
      if (!userId) {
        console.log('No user ID provided');
        throw new Error('No user ID provided');
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      console.log('Profile fetch result:', { profile, error });

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('Profile not found, creating new profile');
          const { data: userData } = await supabase.auth.getUser();
          if (!userData.user) {
            console.log('No authenticated user found');
            throw new Error('No authenticated user found');
          }

          const newProfile = {
            id: userId,
            email: userData.user.email || '',
            username: null,
            bio: null,
            wallet_address: null,
            avatar_url: null,
            social_media: {
              x: null,
              linkedin: null,
              instagram: null,
              threads: null
            },
            interests: [],
            show_upcoming_events: true,
            show_past_events: true,
            past_events: [],
            upcoming_events: [],
            created_at: new Date().toISOString()
          };

          const { data: createdProfile, error: createError } = await supabase
            .from('profiles')
            .insert([newProfile])
            .select()
            .single();

          console.log('Profile creation result:', { createdProfile, createError });

          if (createError) {
            console.error('Error creating profile:', createError);
            toast.error('Error creating profile');
            throw createError;
          }

          return createdProfile as ProfileData;
        }

        console.error('Error fetching profile:', error);
        throw error;
      }

      // Parse social_media to ensure correct structure
      let parsedSocialMedia;
      try {
        parsedSocialMedia = typeof profile.social_media === 'string' 
          ? JSON.parse(profile.social_media)
          : profile.social_media || {};
      } catch (e) {
        console.error('Error parsing social_media:', e);
        parsedSocialMedia = {};
      }

      const social_media = {
        x: parsedSocialMedia?.x ?? null,
        linkedin: parsedSocialMedia?.linkedin ?? null,
        instagram: parsedSocialMedia?.instagram ?? null,
        threads: parsedSocialMedia?.threads ?? null
      };

      // Parse events arrays and ensure they match Event type
      const past_events = (profile.past_events || []).map((event: any): Event => ({
        id: event.id,
        title: event.title,
        date: event.date
      }));

      const upcoming_events = (profile.upcoming_events || []).map((event: any): Event => ({
        id: event.id,
        title: event.title,
        date: event.date
      }));

      const typedProfile: ProfileData = {
        ...profile,
        social_media,
        past_events,
        upcoming_events,
        interests: profile.interests || [],
        show_upcoming_events: profile.show_upcoming_events ?? true,
        show_past_events: profile.show_past_events ?? true
      };

      console.log('Returning formatted profile:', typedProfile);
      return typedProfile;
    },
    enabled: !!userId,
    retry: 1,
  });
}
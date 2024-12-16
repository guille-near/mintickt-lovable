import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ProfileData, Event } from "./types";
import { Json } from "@/integrations/supabase/types";

export function useProfile(userId: string | undefined) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      if (!userId) {
        throw new Error('No user ID provided');
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          const { data: userData } = await supabase.auth.getUser();
          if (!userData.user) {
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
      const social_media = profile.social_media as {
        x: string | null;
        linkedin: string | null;
        instagram: string | null;
        threads: string | null;
      } || {
        x: null,
        linkedin: null,
        instagram: null,
        threads: null
      };

      // Parse events arrays and ensure they match Event type
      const past_events = (profile.past_events || []).map((event: Json): Event => {
        if (typeof event === 'object' && event !== null) {
          return {
            id: String(event.id || ''),
            title: String(event.title || ''),
            date: String(event.date || '')
          };
        }
        return { id: '', title: '', date: '' };
      });

      const upcoming_events = (profile.upcoming_events || []).map((event: Json): Event => {
        if (typeof event === 'object' && event !== null) {
          return {
            id: String(event.id || ''),
            title: String(event.title || ''),
            date: String(event.date || '')
          };
        }
        return { id: '', title: '', date: '' };
      });

      const typedProfile: ProfileData = {
        ...profile,
        social_media,
        past_events,
        upcoming_events,
        interests: profile.interests || [],
        show_upcoming_events: profile.show_upcoming_events ?? true,
        show_past_events: profile.show_past_events ?? true
      };

      return typedProfile;
    },
    enabled: !!userId,
    retry: 1,
  });
}
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { ProfileData, UpdateProfileData, SocialMedia } from "./types";

export const useProfile = (userId: string) => {
  const queryClient = useQueryClient();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID is required");
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;

      // Convert the raw data to match ProfileData type
      const profileData: ProfileData = {
        id: data.id,
        username: data.username,
        email: data.email,
        avatar_url: data.avatar_url,
        bio: data.bio,
        wallet_address: data.wallet_address,
        created_at: data.created_at,
        social_media: data.social_media as SocialMedia || {
          x: null,
          linkedin: null,
          instagram: null,
          threads: null,
        },
        interests: data.interests || [],
        show_upcoming_events: data.show_upcoming_events ?? true,
        show_past_events: data.show_past_events ?? true,
        past_events: (data.past_events || []).map((event: any) => ({
          id: event.id,
          title: event.title,
          date: event.date,
        })),
        upcoming_events: (data.upcoming_events || []).map((event: any) => ({
          id: event.id,
          title: event.title,
          date: event.date,
        })),
      };

      return profileData;
    },
    enabled: !!userId,
  });

  const updateProfile = useMutation({
    mutationFn: async (updates: UpdateProfileData) => {
      const { data, error } = await supabase
        .from("profiles")
        .update({
          ...updates,
          social_media: updates.social_media ? JSON.stringify(updates.social_media) : undefined,
        })
        .eq("id", userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", userId] });
    },
  });

  return {
    profile,
    isLoading,
    error,
    updateProfile,
  };
};
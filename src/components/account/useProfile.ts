import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { ProfileData, UpdateProfileData } from "./types";

export const useProfile = (userId: string) => {
  const queryClient = useQueryClient();

  const { data: profile, isLoading, error, refetch } = useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;

      // Convert the raw data to match ProfileData type
      const profileData: ProfileData = {
        ...data,
        social_media: data.social_media as ProfileData["social_media"],
        interests: data.interests || [],
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
  });

  const updateProfile = useMutation({
    mutationFn: async (updates: UpdateProfileData) => {
      const { data, error } = await supabase
        .from("profiles")
        .update(updates as any)
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
    refetch,
  };
};
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { ProfileData, UpdateProfileData, SocialMedia } from "./types";

export const useProfile = (userId: string) => {
  console.log("useProfile hook called with userId:", userId);
  const queryClient = useQueryClient();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      console.log("Fetching profile data for userId:", userId);
      if (!userId) throw new Error("User ID is required");
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      console.log("Supabase response:", { data, error });

      if (error) {
        console.error("Error fetching profile:", error);
        throw error;
      }

      // Parse social_media JSON if it exists, otherwise use default empty object
      const socialMedia = data.social_media ? 
        (typeof data.social_media === 'string' ? JSON.parse(data.social_media) : data.social_media) : 
        {
          x: null,
          linkedin: null,
          instagram: null,
          threads: null,
        };

      // Convert the raw data to match ProfileData type
      const profileData: ProfileData = {
        id: data.id,
        username: data.username,
        email: data.email,
        avatar_url: data.avatar_url,
        bio: data.bio,
        wallet_address: data.wallet_address,
        created_at: data.created_at,
        social_media: socialMedia as SocialMedia,
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

      console.log("Processed profile data:", profileData);
      return profileData;
    },
    enabled: !!userId,
  });

  const updateProfile = useMutation({
    mutationFn: async (updates: UpdateProfileData) => {
      console.log("Updating profile with data:", updates);
      const { data, error } = await supabase
        .from("profiles")
        .update({
          ...updates,
          social_media: updates.social_media ? JSON.stringify(updates.social_media) : undefined,
        })
        .eq("id", userId)
        .select()
        .single();

      if (error) {
        console.error("Error updating profile:", error);
        throw error;
      }
      console.log("Profile update response:", data);
      return data;
    },
    onSuccess: () => {
      console.log("Profile updated successfully, invalidating queries");
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
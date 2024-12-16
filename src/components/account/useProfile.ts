import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ProfileData } from "./types";
import { convertToDbProfile, convertFromDbProfile } from "./profileConverters";
import { fetchProfile, createProfile, updateProfile } from "./profileApi";

export const useProfile = (userId: string | undefined) => {
  const queryClient = useQueryClient();

  const { data: profile, isLoading, error, refetch } = useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      if (!userId) {
        throw new Error('No user ID provided');
      }

      try {
        const profile = await fetchProfile(userId);
        return profile ? convertFromDbProfile(profile) : null;
      } catch (error) {
        if (error instanceof Error && error.message.includes('No rows returned')) {
          const userData = await supabase.auth.getUser();
          if (!userData.data.user) {
            throw new Error('No authenticated user found');
          }

          const newProfile = await createProfile(userId, userData.data.user.email || '');
          return convertFromDbProfile(newProfile);
        }

        console.error('❌ Error fetching profile:', error);
        throw error;
      }
    },
    enabled: !!userId,
  });

  const { mutate: updateProfileData, isPending: isUpdating } = useMutation({
    mutationFn: async (newProfile: Partial<ProfileData>) => {
      if (!userId) throw new Error('No user ID provided');
      const dbProfile = convertToDbProfile(newProfile);
      const updatedProfile = await updateProfile(userId, dbProfile);
      return convertFromDbProfile(updatedProfile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', userId] });
      toast.success('Profile updated successfully');
    },
    onError: (error) => {
      console.error('❌ Error updating profile:', error);
      toast.error('Failed to update profile');
    },
  });

  return {
    data: profile,
    isLoading,
    error,
    updateProfile: updateProfileData,
    isUpdating,
    refetch
  };
};
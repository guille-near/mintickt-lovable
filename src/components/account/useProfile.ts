import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
        console.error('Error fetching profile:', error);
        toast.error("Error loading profile");
        throw error;
      }

      if (!profile) {
        throw new Error('Profile not found');
      }

      return profile;
    },
    enabled: !!userId,
    retry: 1,
  });
}
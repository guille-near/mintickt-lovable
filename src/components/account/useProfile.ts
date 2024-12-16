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
        // Si el error es que no se encontró el perfil, creamos uno nuevo
        if (error.code === 'PGRST116') {
          const { data: userData } = await supabase.auth.getUser();
          if (!userData.user) {
            throw new Error('No authenticated user found');
          }

          const newProfile = {
            id: userId,
            email: userData.user.email,
            username: null,
            bio: null,
            wallet_address: null,
            avatar_url: null,
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

          return createdProfile;
        }

        console.error('Error fetching profile:', error);
        throw error;
      }

      return profile;
    },
    enabled: !!userId,
    retry: 1,
  });
}
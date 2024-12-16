import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { convertFromDbProfile } from "@/components/account/profileConverters";

export function useProfileQuery(username: string | undefined) {
  return useQuery({
    queryKey: ['public-profile', username],
    queryFn: async () => {
      console.log('🎯 [useProfileQuery] Starting query function');
      console.log('🎯 [useProfileQuery] Fetching profile for username:', username);
      
      if (!username) {
        console.log('🎯 [useProfileQuery] No username provided');
        throw new Error('Username is required');
      }

      const { data, error: supabaseError } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .maybeSingle();

      console.log('🎯 [useProfileQuery] Supabase response:', { data, error: supabaseError });

      if (supabaseError) {
        console.error('🎯 [useProfileQuery] Supabase error:', supabaseError);
        throw supabaseError;
      }

      if (!data) {
        console.error('🎯 [useProfileQuery] No profile found');
        throw new Error('Profile not found');
      }

      const convertedProfile = convertFromDbProfile(data);
      console.log('🎯 [useProfileQuery] Converted profile:', convertedProfile);
      return convertedProfile;
    },
    enabled: !!username,
    retry: false
  });
}
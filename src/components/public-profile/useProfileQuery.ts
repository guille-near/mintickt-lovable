import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { convertFromDbProfile } from "@/components/account/profileConverters";

export function useProfileQuery(username: string | undefined) {
  return useQuery({
    queryKey: ['public-profile', username],
    queryFn: async () => {
      console.log('🔍 [useProfileQuery] Starting query for username:', username);
      
      if (!username) {
        console.log('❌ [useProfileQuery] No username provided');
        throw new Error('Username is required');
      }

      console.log('🔍 [useProfileQuery] Making Supabase query for username:', username);
      const { data, error: supabaseError } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .maybeSingle();

      console.log('🔍 [useProfileQuery] Supabase response:', { data, error: supabaseError });

      if (supabaseError) {
        console.error('❌ [useProfileQuery] Supabase error:', supabaseError);
        throw supabaseError;
      }

      if (!data) {
        console.log('❌ [useProfileQuery] No profile found for username:', username);
        throw new Error('Profile not found');
      }

      const convertedProfile = convertFromDbProfile(data);
      console.log('✅ [useProfileQuery] Successfully converted profile:', convertedProfile);
      return convertedProfile;
    },
    enabled: !!username,
    retry: false
  });
}
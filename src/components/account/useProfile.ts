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
        .select(`
          *,
          tickets(
            event_id,
            events(
              id,
              title,
              date
            )
          )
        `)
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
            email: userData.user.email,
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
            show_past_events: true
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

      // Procesar los eventos del usuario
      const now = new Date();
      const events = profile.tickets
        .filter(ticket => ticket.events)
        .map(ticket => ({
          id: ticket.events.id,
          title: ticket.events.title,
          date: ticket.events.date
        }));

      const pastEvents = events.filter(event => new Date(event.date) < now);
      const upcomingEvents = events.filter(event => new Date(event.date) >= now);

      return {
        ...profile,
        pastEvents,
        upcomingEvents
      };
    },
    enabled: !!userId,
    retry: 1,
  });
}
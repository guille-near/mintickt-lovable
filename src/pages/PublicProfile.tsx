import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProfileData, Event, SocialMediaLinks } from "@/components/account/types";
import { ProfileHeader } from "@/components/public-profile/ProfileHeader";
import { ProfileInterests } from "@/components/public-profile/ProfileInterests";
import { ProfileSocialLinks } from "@/components/public-profile/ProfileSocialLinks";
import { EventsList } from "@/components/public-profile/EventsList";
import { LoadingState } from "@/components/public-profile/LoadingState";
import { ErrorState } from "@/components/public-profile/ErrorState";

export default function PublicProfile() {
  const params = useParams();
  const username = params["*"] || params.username;

  console.log('Buscando perfil para username:', username);

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['public-profile', username],
    queryFn: async () => {
      console.log('Iniciando búsqueda de perfil para username:', username);
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();

      console.log('Respuesta de Supabase:', { profile, error });

      if (error) throw error;

      // Parse social_media to ensure correct structure
      let socialMedia: SocialMediaLinks;
      try {
        const rawSocialMedia = typeof profile.social_media === 'string' 
          ? JSON.parse(profile.social_media)
          : profile.social_media || {};

        socialMedia = {
          x: rawSocialMedia.x ?? null,
          linkedin: rawSocialMedia.linkedin ?? null,
          instagram: rawSocialMedia.instagram ?? null,
          threads: rawSocialMedia.threads ?? null
        };
      } catch (e) {
        console.error('Error parsing social_media:', e);
        socialMedia = {
          x: null,
          linkedin: null,
          instagram: null,
          threads: null
        };
      }

      // Parse events arrays and ensure they match Event type
      const pastEvents = (profile.past_events || []).map((event: any): Event => ({
        id: event.id,
        title: event.title,
        date: event.date
      }));

      const upcomingEvents = (profile.upcoming_events || []).map((event: any): Event => ({
        id: event.id,
        title: event.title,
        date: event.date
      }));

      return {
        id: profile.id,
        username: profile.username,
        bio: profile.bio,
        email: profile.email,
        wallet_address: profile.wallet_address,
        avatar_url: profile.avatar_url,
        created_at: profile.created_at,
        social_media: socialMedia,
        interests: profile.interests || [],
        show_upcoming_events: profile.show_upcoming_events ?? true,
        show_past_events: profile.show_past_events ?? true,
        past_events: pastEvents,
        upcoming_events: upcomingEvents
      } as ProfileData;
    },
    enabled: !!username,
    retry: 1,
    meta: {
      errorMessage: "No se pudo cargar el perfil. Por favor, intenta de nuevo."
    }
  });

  if (isLoading) {
    return <LoadingState />;
  }

  if (error || !profile) {
    return <ErrorState username={username || ''} />;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <ProfileHeader profile={profile} />
        <ProfileInterests interests={profile.interests} />
        <ProfileSocialLinks socialMedia={profile.social_media} />
        
        {/* Events Section */}
        {((profile.show_upcoming_events && profile.upcoming_events?.length > 0) ||
          (profile.show_past_events && profile.past_events?.length > 0)) && (
          <div className="space-y-6">
            {profile.show_upcoming_events && profile.upcoming_events?.length > 0 && (
              <EventsList title="Upcoming Events" events={profile.upcoming_events} />
            )}
            {profile.show_past_events && profile.past_events?.length > 0 && (
              <EventsList title="Past Events" events={profile.past_events} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
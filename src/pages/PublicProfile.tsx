import { useParams } from "react-router-dom";
import { LoadingState } from "@/components/public-profile/LoadingState";
import { ErrorState } from "@/components/public-profile/ErrorState";
import { ProfileHeader } from "@/components/public-profile/ProfileHeader";
import { ProfileSocialLinks } from "@/components/public-profile/ProfileSocialLinks";
import { ProfileInterests } from "@/components/public-profile/ProfileInterests";
import { EventsList } from "@/components/public-profile/EventsList";
import { SimpleHeader } from "@/components/SimpleHeader";
import { useProfileQuery } from "@/components/public-profile/useProfileQuery";

const PublicProfile = () => {
  console.log('🎯 [PublicProfile] Component mounted');
  
  // Extraer el username sin el @ de la URL
  const params = useParams();
  const username = params.username?.replace('@', '');
  
  console.log('🎯 [PublicProfile] Raw params:', params);
  console.log('🎯 [PublicProfile] Extracted username:', username);

  const { data: profile, isLoading, error } = useProfileQuery(username);

  if (!username) {
    console.log('🎯 [PublicProfile] Rendering: No username provided');
    return (
      <div className="min-h-screen flex flex-col dark:bg-[linear-gradient(135deg,#FF00E5_1%,transparent_8%),_linear-gradient(315deg,rgba(94,255,69,0.25)_0.5%,transparent_8%)] dark:bg-black">
        <SimpleHeader />
        <ErrorState username="" />
      </div>
    );
  }

  if (isLoading) {
    console.log('🎯 [PublicProfile] Rendering: Loading state');
    return (
      <div className="min-h-screen flex flex-col dark:bg-[linear-gradient(135deg,#FF00E5_1%,transparent_8%),_linear-gradient(315deg,rgba(94,255,69,0.25)_0.5%,transparent_8%)] dark:bg-black">
        <SimpleHeader />
        <LoadingState />
      </div>
    );
  }

  if (error || !profile) {
    console.log('🎯 [PublicProfile] Rendering: Error state', { error });
    return (
      <div className="min-h-screen flex flex-col dark:bg-[linear-gradient(135deg,#FF00E5_1%,transparent_8%),_linear-gradient(315deg,rgba(94,255,69,0.25)_0.5%,transparent_8%)] dark:bg-black">
        <SimpleHeader />
        <ErrorState username={username} />
      </div>
    );
  }

  console.log('🎯 [PublicProfile] Rendering: Success state with profile:', profile);
  return (
    <div className="min-h-screen flex flex-col dark:bg-[linear-gradient(135deg,#FF00E5_1%,transparent_8%),_linear-gradient(315deg,rgba(94,255,69,0.25)_0.5%,transparent_8%)] dark:bg-black">
      <SimpleHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <ProfileHeader
            username={profile.username}
            bio={profile.bio}
            avatarUrl={profile.avatar_url}
          />

          <ProfileSocialLinks socialMedia={profile.social_media} />

          <ProfileInterests interests={profile.interests} />

          {profile.show_upcoming_events && (
            <EventsList
              title="Upcoming Events"
              events={profile.upcoming_events}
            />
          )}

          {profile.show_past_events && (
            <EventsList
              title="Past Events"
              events={profile.past_events}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
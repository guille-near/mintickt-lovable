import { useParams } from "react-router-dom";
import { LoadingState } from "@/components/public-profile/LoadingState";
import { ErrorState } from "@/components/public-profile/ErrorState";
import { ProfileHeader } from "@/components/public-profile/ProfileHeader";
import { ProfileSocialLinks } from "@/components/public-profile/ProfileSocialLinks";
import { ProfileInterests } from "@/components/public-profile/ProfileInterests";
import { EventsList } from "@/components/public-profile/EventsList";
import { ProfileContainer } from "@/components/public-profile/ProfileContainer";
import { useProfileQuery } from "@/components/public-profile/useProfileQuery";

const PublicProfile = () => {
  console.log('🎯 [PublicProfile] Component mounted');
  const { username: rawUsername } = useParams<{ username: string }>();
  // Remove @ if present and handle undefined
  const username = rawUsername?.startsWith('@') ? rawUsername.slice(1) : rawUsername;
  
  console.log('🎯 [PublicProfile] Username from params:', username);
  console.log('🎯 [PublicProfile] Raw params:', { rawUsername });

  const { data: profile, isLoading, error } = useProfileQuery(username);

  console.log('🎯 [PublicProfile] Query state:', {
    isLoading,
    error,
    hasProfile: !!profile,
    profile
  });

  if (!username) {
    console.log('🎯 [PublicProfile] Rendering: No username provided');
    return (
      <ProfileContainer>
        <ErrorState username="" />
      </ProfileContainer>
    );
  }

  if (isLoading) {
    console.log('🎯 [PublicProfile] Rendering: Loading state');
    return (
      <ProfileContainer>
        <LoadingState />
      </ProfileContainer>
    );
  }

  if (error || !profile) {
    console.log('🎯 [PublicProfile] Rendering: Error state', { error });
    return (
      <ProfileContainer>
        <ErrorState username={username} />
      </ProfileContainer>
    );
  }

  console.log('🎯 [PublicProfile] Rendering: Success state with profile:', profile);
  return (
    <ProfileContainer>
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
    </ProfileContainer>
  );
};

export default PublicProfile;
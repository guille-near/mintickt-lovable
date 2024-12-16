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
  
  const { username } = useParams();
  console.log('🎯 [PublicProfile] Raw username from params:', username);
  
  // Clean username whether it comes with @ or not
  const cleanUsername = username?.replace('@', '');
  
  console.log('🎯 [PublicProfile] Cleaned username:', cleanUsername);

  const { data: profile, isLoading, error } = useProfileQuery(cleanUsername);

  console.log('🎯 [PublicProfile] Query state:', {
    isLoading,
    error,
    hasProfile: !!profile,
    profile
  });

  if (!cleanUsername) {
    console.log('🎯 [PublicProfile] No username provided');
    return (
      <ProfileContainer>
        <ErrorState username="" />
      </ProfileContainer>
    );
  }

  if (isLoading) {
    console.log('🎯 [PublicProfile] Loading state');
    return (
      <ProfileContainer>
        <LoadingState />
      </ProfileContainer>
    );
  }

  if (error || !profile) {
    console.log('🎯 [PublicProfile] Error state:', error);
    return (
      <ProfileContainer>
        <ErrorState username={cleanUsername} />
      </ProfileContainer>
    );
  }

  console.log('🎯 [PublicProfile] Rendering profile:', profile);
  return (
    <ProfileContainer>
      <ProfileHeader
        username={profile.username}
        bio={profile.bio}
        avatarUrl={profile.avatar_url}
        userId={profile.id}
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
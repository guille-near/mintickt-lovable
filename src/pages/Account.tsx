import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { ProfileForm } from "@/components/account/ProfileForm";
import AuthenticatedLayout from "@/components/AuthenticatedLayout";
import { AccountHeader } from "@/components/account/AccountHeader";
import { useProfile } from "@/components/account/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import type { ProfileFormData, SocialMediaLinks } from "@/components/account/types";
import type { Json } from "@/integrations/supabase/types";

export default function Account() {
  const { user, isLoading: authLoading } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const { data: profile, isLoading: profileLoading, error, refetch } = useProfile(user?.id);
  const [formData, setFormData] = useState<ProfileFormData>({
    username: null,
    first_name: null,
    last_name: null,
    bio: null,
    email: '',
    wallet_address: null,
    social_media: {
      x: null,
      linkedin: null,
      instagram: null,
      threads: null
    },
    interests: [],
    show_upcoming_events: true,
    show_past_events: true
  });

  useEffect(() => {
    if (profile) {
      const socialMedia: SocialMediaLinks = profile.social_media || {
        x: null,
        linkedin: null,
        instagram: null,
        threads: null
      };

      setFormData({
        username: profile.username || null,
        first_name: profile.first_name || null,
        last_name: profile.last_name || null,
        bio: profile.bio || null,
        email: profile.email,
        wallet_address: profile.wallet_address,
        social_media: socialMedia,
        interests: [...(profile.interests || [])],
        show_upcoming_events: profile.show_upcoming_events ?? true,
        show_past_events: profile.show_past_events ?? true
      });
    }
  }, [profile]);

  if (authLoading || profileLoading) {
    return (
      <AuthenticatedLayout>
        <div className="container mx-auto py-6">
          <div className="flex items-center justify-center h-[50vh]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  if (!user) {
    return (
      <AuthenticatedLayout>
        <div className="container mx-auto py-6">
          <div className="text-center">
            <p className="text-red-500">Please log in to view your profile</p>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  if (error) {
    return (
      <AuthenticatedLayout>
        <div className="container mx-auto py-6">
          <div className="text-center space-y-4">
            <p className="text-red-500">Error loading profile</p>
            <button 
              onClick={() => refetch()} 
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Retry
            </button>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  const handleProfileChange = (field: keyof ProfileFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAvatarUpdate = async (url: string) => {
    await refetch();
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      toast.error("You must be logged in to update your profile");
      return;
    }

    try {
      setIsUpdating(true);

      const { error } = await supabase
        .from('profiles')
        .update({
          username: formData.username,
          first_name: formData.first_name,
          last_name: formData.last_name,
          bio: formData.bio,
          email: formData.email,
          social_media: formData.social_media as unknown as Json,
          interests: formData.interests,
          show_upcoming_events: formData.show_upcoming_events,
          show_past_events: formData.show_past_events
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating profile:', error);
        throw error;
      }

      toast.success("Profile updated successfully");
      await refetch();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error("Error updating profile");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <AuthenticatedLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Account Settings</h1>
          {profile?.username && (
            <Button variant="outline" size="sm" asChild className="text-muted-foreground">
              <Link to={`/@${profile.username}`}>
                <ExternalLink className="mr-2 h-4 w-4" />
                See my profile
              </Link>
            </Button>
          )}
        </div>
        <div className="max-w-2xl space-y-8">
          <AccountHeader
            profileId={user?.id}
            avatarUrl={profile?.avatar_url}
            onAvatarUpdate={handleAvatarUpdate}
          />
          <ProfileForm
            profile={formData}
            onProfileChange={handleProfileChange}
            onSubmit={onSubmit}
            isLoading={isUpdating}
            pastEvents={[...(profile?.past_events || [])]}
            upcomingEvents={[...(profile?.upcoming_events || [])]}
          />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

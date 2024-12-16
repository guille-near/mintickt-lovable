import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { ProfileForm } from "@/components/account/ProfileForm";
import AuthenticatedLayout from "@/components/AuthenticatedLayout";
import { AccountHeader } from "@/components/account/AccountHeader";
import { useProfile } from "@/components/account/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { ProfileData } from "@/components/account/types";

export default function Account() {
  const { user, isLoading: authLoading } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const { profile, isLoading: profileLoading, error, updateProfile } = useProfile(user?.id || '');
  const [formData, setFormData] = useState<ProfileData>({
    id: user?.id || '',
    username: null,
    bio: null,
    email: user?.email || '',
    avatar_url: null,
    wallet_address: null,
    created_at: new Date().toISOString(),
    social_media: {
      x: null,
      linkedin: null,
      instagram: null,
      threads: null
    },
    interests: [],
    show_upcoming_events: true,
    show_past_events: true,
    past_events: [],
    upcoming_events: []
  });

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  if (authLoading || profileLoading) {
    return (
      <AuthenticatedLayout>
        <div className="flex items-center justify-center h-[50vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AuthenticatedLayout>
    );
  }

  if (!user) {
    return (
      <AuthenticatedLayout>
        <div className="text-center">
          <p className="text-red-500">Please log in to view your profile</p>
        </div>
      </AuthenticatedLayout>
    );
  }

  if (error) {
    return (
      <AuthenticatedLayout>
        <div className="text-center space-y-4">
          <p className="text-red-500">Error loading profile</p>
        </div>
      </AuthenticatedLayout>
    );
  }

  const handleProfileChange = (field: keyof ProfileData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAvatarUpdate = async (url: string) => {
    if (!profile) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: url })
        .eq('id', profile.id);

      if (error) throw error;
      
      setFormData(prev => ({
        ...prev,
        avatar_url: url
      }));
      
      toast.success("Avatar updated successfully");
    } catch (error) {
      console.error('Error updating avatar:', error);
      toast.error("Error updating avatar");
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      toast.error("You must be logged in to update your profile");
      return;
    }

    try {
      setIsUpdating(true);
      await updateProfile.mutateAsync({
        username: formData.username,
        bio: formData.bio,
        social_media: formData.social_media,
        interests: formData.interests,
        show_upcoming_events: formData.show_upcoming_events,
        show_past_events: formData.show_past_events
      });

      toast.success("Profile updated successfully");
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error("Error updating profile");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <AuthenticatedLayout>
      <div>
        <h1 className="text-4xl font-bold mb-8">Account Settings</h1>
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
            pastEvents={profile?.past_events}
            upcomingEvents={profile?.upcoming_events}
          />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
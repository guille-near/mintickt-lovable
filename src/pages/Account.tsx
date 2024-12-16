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
  console.log("Account component rendering");
  const { user, isLoading: authLoading } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  
  console.log("Current user:", user);
  
  const { 
    profile, 
    isLoading: profileLoading, 
    error: profileError, 
    updateProfile 
  } = useProfile(user?.id || '');

  console.log("Profile data:", profile);
  console.log("Profile loading:", profileLoading);
  console.log("Profile error:", profileError);

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
      console.log("Setting form data with profile:", profile);
      setFormData(profile);
    }
  }, [profile]);

  if (authLoading || profileLoading) {
    console.log("Loading state active");
    return (
      <AuthenticatedLayout>
        <div className="flex items-center justify-center h-[50vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AuthenticatedLayout>
    );
  }

  if (!user) {
    console.log("No user found");
    return (
      <AuthenticatedLayout>
        <div className="text-center">
          <p className="text-red-500">Please log in to view your profile</p>
        </div>
      </AuthenticatedLayout>
    );
  }

  if (profileError) {
    console.error("Profile error:", profileError);
    return (
      <AuthenticatedLayout>
        <div className="text-center space-y-4">
          <p className="text-red-500">Error loading profile: {profileError.message}</p>
        </div>
      </AuthenticatedLayout>
    );
  }

  const handleProfileChange = (field: keyof ProfileData, value: any) => {
    console.log("Profile change:", field, value);
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAvatarUpdate = async (url: string) => {
    if (!profile) return;
    
    try {
      console.log("Updating avatar with URL:", url);
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
    } catch (error: any) {
      console.error('Error updating avatar:', error);
      toast.error("Error updating avatar");
    }
  };

  const handleSubmit = async (data: Partial<ProfileData>) => {
    if (!user?.id) {
      toast.error("You must be logged in to update your profile");
      return;
    }

    try {
      console.log("Submitting profile update:", data);
      setIsUpdating(true);
      await updateProfile.mutateAsync(data);
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
            onSubmit={handleSubmit}
            isLoading={isUpdating}
          />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
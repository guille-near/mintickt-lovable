import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ProfileForm } from "@/components/account/ProfileForm";
import { ProfileAvatar } from "@/components/account/ProfileAvatar";
import { WalletButton } from "@/components/WalletButton";
import { supabase } from "@/integrations/supabase/client";
import AuthenticatedLayout from "@/components/AuthenticatedLayout";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthProvider";

export default function Account() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    email: '',
  });

  const { data: profile, isLoading, error, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      if (!user) throw new Error('No user found');

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }

      setFormData({
        username: profile.username || '',
        bio: profile.bio || '',
        email: profile.email,
      });

      return profile;
    },
    enabled: !!user,
    retry: false,
  });

  const handleProfileChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAvatarUpdate = (url: string) => {
    if (profile) {
      refetch();
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setIsUpdating(true);

      const { error } = await supabase
        .from('profiles')
        .update({
          username: formData.username,
          bio: formData.bio,
          email: formData.email,
        })
        .eq('id', user.id);

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast({
            title: "Error",
            description: "This email is already in use. Please use a different email.",
            variant: "destructive",
          });
          return;
        }
        throw error;
      }

      toast({
        title: "Success",
        description: "Your profile has been updated successfully.",
      });

      refetch();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <AuthenticatedLayout>
        <div className="container mx-auto py-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  if (error) {
    return (
      <AuthenticatedLayout>
        <div className="container mx-auto py-6">
          <div className="text-center">
            <p className="text-red-500">Error loading profile. Please try again later.</p>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-4xl font-bold mb-8">Account Settings</h1>
        <div className="max-w-2xl space-y-8">
          <div className="flex flex-col sm:flex-row items-start gap-8">
            <div className="w-full sm:w-auto">
              <ProfileAvatar
                currentAvatarUrl={profile?.avatar_url || null}
                userId={profile?.id || ''}
                onAvatarUpdate={handleAvatarUpdate}
              />
            </div>
            <div className="w-full">
              <h2 className="text-xl font-semibold mb-4">Wallet Connection</h2>
              <WalletButton />
            </div>
          </div>
          <ProfileForm
            profile={formData}
            onProfileChange={handleProfileChange}
            onSubmit={onSubmit}
            isLoading={isUpdating}
          />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
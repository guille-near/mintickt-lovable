import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { useWallet } from "@solana/wallet-adapter-react";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { WalletButton } from "@/components/WalletButton";
import AuthenticatedLayout from "@/components/AuthenticatedLayout";
import { useNavigate } from "react-router-dom";
import { ProfileAvatar } from "@/components/account/ProfileAvatar";
import { ProfileForm } from "@/components/account/ProfileForm";

interface Profile {
  username: string | null;
  bio: string | null;
  email: string;
  avatar_url: string | null;
  wallet_address: string | null;
}

export default function Account() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { publicKey } = useWallet();
  const [profile, setProfile] = useState<Profile>({
    username: "",
    bio: "",
    email: "",
    avatar_url: "",
    wallet_address: "",
  });

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    getProfile();
  }, [user, navigate]);

  async function getProfile() {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("username, bio, email, avatar_url, wallet_address")
        .eq("id", user?.id)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setProfile(data);
      }
    } catch (error: any) {
      console.error("Profile fetch error:", error);
      toast.error("An error occurred while loading your profile");
    }
  }

  async function updateProfile() {
    try {
      const { error } = await supabase.from("profiles").upsert({
        id: user?.id,
        username: profile.username,
        bio: profile.bio,
        email: profile.email,
        avatar_url: profile.avatar_url,
        wallet_address: publicKey?.toString() || profile.wallet_address,
      });

      if (error) {
        throw error;
      }

      toast.success("Profile updated successfully!");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error("Error updating your profile");
    }
  }

  const handleProfileChange = (field: string, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleAvatarUpdate = (url: string) => {
    setProfile((prev) => ({ ...prev, avatar_url: url }));
  };

  if (!user) {
    return null;
  }

  return (
    <AuthenticatedLayout>
      <main className="container mx-auto py-6 px-4">
        <h1 className="text-4xl font-bold mb-8">Account Settings</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex flex-col items-center space-y-4">
              <ProfileAvatar
                currentAvatarUrl={profile.avatar_url}
                userId={user.id}
                onAvatarUpdate={handleAvatarUpdate}
              />
              <WalletButton />
              <p className="text-sm text-muted-foreground break-all">
                {publicKey?.toString() || profile.wallet_address || "Not connected"}
              </p>
            </div>
          </Card>
          <Card className="p-6 md:col-span-2">
            <ProfileForm
              profile={profile}
              onProfileChange={handleProfileChange}
              onSubmit={(e) => {
                e.preventDefault();
                updateProfile();
              }}
            />
          </Card>
        </div>
      </main>
    </AuthenticatedLayout>
  );
}
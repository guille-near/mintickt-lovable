import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { WalletButton } from "@/components/WalletButton";
import { useWallet } from "@solana/wallet-adapter-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import AuthenticatedLayout from "@/components/AuthenticatedLayout";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, User } from "lucide-react";

interface Profile {
  username: string | null;
  bio: string | null;
  avatar_url: string | null;
  wallet_address: string | null;
}

export default function Account() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { publicKey } = useWallet();
  const [profile, setProfile] = useState<Profile>({
    username: "",
    bio: "",
    avatar_url: "",
    wallet_address: "",
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    getProfile();
  }, [user, navigate]);

  async function getProfile() {
    try {
      if (!user?.id) return;
      
      const { data, error } = await supabase
        .from("profiles")
        .select()
        .eq("id", user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile");
        return;
      }

      if (data) {
        setProfile({
          username: data.username || "",
          bio: data.bio || "",
          avatar_url: data.avatar_url || "",
          wallet_address: data.wallet_address || "",
        });
      }
    } catch (error: any) {
      console.error("Profile fetch error:", error);
      toast.error("An error occurred while loading your profile");
    }
  }

  async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${user?.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setProfile({ ...profile, avatar_url: publicUrl });
      toast.success("Profile picture uploaded successfully!");
    } catch (error: any) {
      console.error("Error uploading avatar:", error);
      toast.error("Error uploading profile picture");
    } finally {
      setUploading(false);
    }
  }

  async function updateProfile() {
    try {
      if (!user?.id) {
        toast.error("You must be logged in to update your profile");
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          username: profile.username,
          bio: profile.bio,
          avatar_url: profile.avatar_url,
          wallet_address: publicKey?.toString() || profile.wallet_address,
          email: user.email,
        })
        .eq("id", user.id);

      if (error) {
        console.error("Error updating profile:", error);
        toast.error("Failed to update profile");
        return;
      }

      toast.success("Profile updated successfully!");
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast.error("An error occurred while updating your profile");
    }
  }

  return (
    <AuthenticatedLayout>
      <main className="container mx-auto py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Account Settings</h1>
          <ThemeToggle />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={profile.avatar_url || undefined} />
                  <AvatarFallback>
                    <User className="h-16 w-16" />
                  </AvatarFallback>
                </Avatar>
                <Label 
                  htmlFor="avatar-upload" 
                  className="absolute bottom-0 right-0 p-2 bg-background border rounded-full cursor-pointer hover:bg-accent transition-colors"
                >
                  <Camera className="h-4 w-4" />
                  <Input 
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={uploadAvatar}
                    disabled={uploading}
                    className="hidden"
                  />
                </Label>
              </div>
              <WalletButton />
              <p className="text-sm text-muted-foreground break-all">
                {publicKey?.toString() || profile.wallet_address || "Not connected"}
              </p>
            </div>
          </Card>
          <Card className="p-6 md:col-span-2">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateProfile();
              }}
              className="space-y-6"
            >
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email}
                  disabled
                  className="bg-muted"
                />
              </div>
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={profile.username || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, username: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profile.bio || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, bio: e.target.value })
                  }
                  rows={4}
                />
              </div>
              <Button type="submit">Save Changes</Button>
            </form>
          </Card>
        </div>
      </main>
    </AuthenticatedLayout>
  );
}
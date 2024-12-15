import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { WalletButton } from "@/components/WalletButton";
import AuthenticatedLayout from "@/components/AuthenticatedLayout";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, User } from "lucide-react";

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
      const { data, error } = await supabase
        .from("profiles")
        .select("username, bio, email, avatar_url, wallet_address")
        .eq("id", user?.id)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setProfile({
          username: data.username,
          bio: data.bio,
          email: data.email,
          avatar_url: data.avatar_url,
          wallet_address: data.wallet_address,
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
              className="space-y-4"
            >
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) =>
                    setProfile({ ...profile, email: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
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
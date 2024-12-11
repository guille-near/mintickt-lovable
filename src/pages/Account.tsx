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
import { Header } from "@/components/Header";

interface Profile {
  username: string | null;
  bio: string | null;
  avatar_url: string | null;
  wallet_address: string | null;
}

export default function Account() {
  const { user } = useAuth();
  const { publicKey } = useWallet();
  const [profile, setProfile] = useState<Profile>({
    username: "",
    bio: "",
    avatar_url: "",
    wallet_address: "",
  });

  useEffect(() => {
    if (user) {
      getProfile();
    }
  }, [user]);

  async function getProfile() {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select()
        .eq("id", user?.id)
        .single();

      if (error) throw error;
      if (data) {
        setProfile({
          username: data.username || "",
          bio: data.bio || "",
          avatar_url: data.avatar_url || "",
          wallet_address: data.wallet_address || "",
        });
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  async function updateProfile() {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          username: profile.username,
          bio: profile.bio,
          avatar_url: profile.avatar_url,
          wallet_address: publicKey?.toString() || profile.wallet_address,
        })
        .eq("id", user?.id);

      if (error) throw error;
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 col-span-2">
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
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Wallet Connection</h2>
            <div className="space-y-4">
              <div>
                <Label>Connected Wallet</Label>
                <p className="text-sm text-muted-foreground break-all">
                  {publicKey?.toString() || profile.wallet_address || "Not connected"}
                </p>
              </div>
              <WalletButton />
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
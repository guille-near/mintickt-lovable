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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    getProfile();
  }, [user, navigate]);

  async function getProfile() {
    try {
      setIsLoading(true);
      console.log("Fetching profile for user ID:", user?.id);
      
      const { data, error } = await supabase
        .from("profiles")
        .select("username, bio, email, avatar_url, wallet_address")
        .eq("id", user?.id)
        .maybeSingle();

      if (error) {
        console.error("Profile fetch error:", error);
        toast.error("Error al cargar el perfil");
        return;
      }

      if (data) {
        console.log("Profile data:", data);
        setProfile(data);
      } else {
        console.log("No profile found, creating one");
        // If no profile exists, create one
        const { error: createError } = await supabase
          .from("profiles")
          .insert([
            {
              id: user?.id,
              email: user?.email,
            },
          ]);

        if (createError) {
          console.error("Profile creation error:", createError);
          toast.error("Error al crear el perfil");
          return;
        }

        // Set initial profile state
        setProfile({
          username: "",
          bio: "",
          email: user?.email || "",
          avatar_url: "",
          wallet_address: "",
        });
      }
    } catch (error: any) {
      console.error("Profile fetch error:", error);
      toast.error("Error al cargar el perfil");
    } finally {
      setIsLoading(false);
    }
  }

  async function updateProfile() {
    try {
      const { error } = await supabase
        .from("profiles")
        .upsert({
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

      toast.success("Perfil actualizado correctamente");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error("Error al actualizar el perfil");
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
        <h1 className="text-4xl font-bold mb-8">Ajustes de cuenta</h1>
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
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
                  {publicKey?.toString() || profile.wallet_address || "No conectado"}
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
        )}
      </main>
    </AuthenticatedLayout>
  );
}
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Camera, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ProfileAvatarProps {
  currentAvatarUrl: string | null;
  userId: string;
  onAvatarUpdate: (url: string) => void;
}

export function ProfileAvatar({ currentAvatarUrl, userId, onAvatarUpdate }: ProfileAvatarProps) {
  const [uploading, setUploading] = useState(false);

  async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', userId);

      if (updateError) {
        throw updateError;
      }

      onAvatarUpdate(publicUrl);
      toast.success("Profile picture updated successfully");
    } catch (error: any) {
      console.error("Error uploading avatar:", error);
      toast.error("Error updating profile picture");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="relative">
      <Avatar className="h-32 w-32">
        <AvatarImage src={currentAvatarUrl || undefined} />
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
  );
}
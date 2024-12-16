import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ProfileData } from "@/components/account/types";
import { useAuthState } from "@/hooks/useAuthState";

interface ProfileHeaderProps {
  profile: ProfileData;
}

function ShareQRCode() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex-1">Share</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share your profile</DialogTitle>
        </DialogHeader>
        <div className="flex justify-center">
          <div className="w-64 h-64 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">QR Code Placeholder</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const { user } = useAuthState();

  return (
    <div className="flex flex-col items-center space-y-4">
      <Avatar className="w-24 h-24 sm:w-32 sm:h-32">
        <AvatarImage src={profile.avatar_url || undefined} alt="Profile picture" />
        <AvatarFallback>{profile.username?.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <h2 className="text-xl sm:text-2xl font-semibold">@{profile.username}</h2>
      {profile.bio && <p className="text-center text-muted-foreground">{profile.bio}</p>}

      {user?.id === profile.id && (
        <div className="flex justify-center space-x-4 w-full max-w-xs mx-auto">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => window.location.href = "/account"}
          >
            Edit Profile
          </Button>
          <ShareQRCode />
        </div>
      )}
    </div>
  );
}
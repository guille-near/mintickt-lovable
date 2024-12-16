import { User2 } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { QRCodeDialog } from "./QRCodeDialog";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthProvider";

interface ProfileHeaderProps {
  username: string | null;
  bio: string | null;
  avatarUrl: string | null;
  userId: string;
  walletAddress: string | null;
}

export function ProfileHeader({ username, bio, avatarUrl, userId, walletAddress }: ProfileHeaderProps) {
  const { user } = useAuth();
  const isOwnProfile = user?.id === userId;
  const profileUrl = window.location.origin + "/@" + username;

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="relative">
        <Avatar className="h-32 w-32">
          <AvatarImage src={avatarUrl || undefined} alt={username || 'User'} />
          <AvatarFallback>
            <User2 className="h-16 w-16" />
          </AvatarFallback>
        </Avatar>
        {walletAddress && (
          <div className="absolute -bottom-2 -right-0 h-10 w-10">
            <img
              src="/solana-badge.svg"
              alt="Solana Wallet Connected"
              className="w-full h-full"
            />
          </div>
        )}
      </div>

      <div className="text-center space-y-3">
        <h1 className="text-2xl font-bold">@{username}</h1>
        {bio && (
          <p className="text-muted-foreground max-w-2xl text-center">{bio}</p>
        )}
      </div>

      {isOwnProfile && (
        <div className="flex items-center gap-2">
          <QRCodeDialog profileUrl={profileUrl} />
          <Button variant="secondary" asChild>
            <Link to="/account">Edit Profile</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
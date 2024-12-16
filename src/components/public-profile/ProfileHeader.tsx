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
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="relative">
          <Avatar className="h-24 w-24">
            <AvatarImage src={avatarUrl || undefined} alt={username || 'User'} />
            <AvatarFallback>
              <User2 className="h-12 w-12" />
            </AvatarFallback>
          </Avatar>
          {walletAddress && (
            <div className="absolute -bottom-2 -right-2 h-8 w-8">
              <img
                src="/solana-badge.svg"
                alt="Solana Wallet Connected"
                className="w-full h-full"
              />
            </div>
          )}
        </div>
        
        <div className="space-y-2 flex-grow">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">@{username}</h1>
          </div>
          {bio && (
            <p className="text-muted-foreground max-w-2xl">{bio}</p>
          )}
        </div>

        <div className="flex items-center gap-2 self-start md:self-center">
          <QRCodeDialog profileUrl={profileUrl} />
          {isOwnProfile && (
            <Button variant="default" asChild>
              <Link to="/account">Edit Profile</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
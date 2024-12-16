import { ProfileAvatar } from "./ProfileAvatar";
import { WalletButton } from "../WalletButton";

interface AccountHeaderProps {
  profileId: string;
  avatarUrl: string | null;
  onAvatarUpdate: (url: string) => void;
}

export function AccountHeader({ profileId, avatarUrl, onAvatarUpdate }: AccountHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start gap-8">
      <div className="w-full sm:w-auto">
        <ProfileAvatar
          currentAvatarUrl={avatarUrl}
          userId={profileId}
          onAvatarUpdate={onAvatarUpdate}
        />
      </div>
      <div className="w-full">
        <h2 className="text-xl font-semibold mb-4 font-yrsa">Connect Your Wallet</h2>
        <div className="max-w-sm">
          <WalletButton />
        </div>
      </div>
    </div>
  );
}
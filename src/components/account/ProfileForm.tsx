import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ProfileFormData } from "./types";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletButton } from "../WalletButton";

interface ProfileFormProps {
  profile: ProfileFormData;
  onProfileChange: (field: keyof ProfileFormData, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export function ProfileForm({ profile, onProfileChange, onSubmit, isLoading }: ProfileFormProps) {
  const { wallets, select } = useWallet();

  const handleWalletClick = () => {
    if (!profile.wallet_address && wallets.length > 0) {
      select(wallets[0].adapter.name);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={profile.email}
            onChange={(e) => onProfileChange("email", e.target.value)}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            value={profile.username}
            onChange={(e) => onProfileChange("username", e.target.value)}
            placeholder="Choose a username"
          />
        </div>

        <div>
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={profile.bio}
            onChange={(e) => onProfileChange("bio", e.target.value)}
            placeholder="Tell us about yourself..."
            className="h-32"
          />
        </div>

        <div>
          <Label htmlFor="wallet_address">Wallet Address</Label>
          <div className="relative">
            <div 
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
              style={{
                backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgNDAwIj48cGF0aCBkPSJNMjAzLjkgMzg1YzE4LjEtMzMuMSAyNy4xLTY3LjYgMjcuMS0xMDMuNCAwLTM3LjctOS45LTczLjctMjkuNi0xMDcuOGwtOTguNC0xNzBDOTcuMyAxLjIgOTIuNiAwIDg4LjQgMGMtNC4yIDAtOC45IDEuMi0xNC4yIDMuN0wzOC40IDI1LjRDMzMuMSAyOC41IDMwIDMyLjIgMjkgMzYuNmMtMSA0LjQtLjEgOC44IDIuNyAxMy4ybDk4LjQgMTcwYzE5LjcgMzQuMSAyOS42IDcwLjEgMjkuNiAxMDcuOCAwIDM1LjgtOSA3MC4zLTI3LjEgMTAzLjQtMi44IDUuMi0zLjcgOS45LTIuNyAxNC4yIDEgNC4zIDQuMSA4IDkuNSAxMS4xbDM1LjcgMjEuN2M1LjMgMi41IDEwIDMuNyAxNC4yIDMuNyA0LjIgMCA4LjktMS4yIDE0LjItMy43bDM1LjctMjEuN2M1LjMtMy4xIDguNC02LjggOS41LTExLjEgMS01LjMuMS0xMC4xLTIuOC0xNS4zeiIgZmlsbD0iIzAwRkZBMyIvPjwvc3ZnPg==')",
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat'
              }}
            />
            <Input
              id="wallet_address"
              type="text"
              value={profile.wallet_address || ''}
              readOnly
              className="pl-10 bg-muted cursor-pointer"
              placeholder="Connect your wallet"
              onClick={handleWalletClick}
            />
          </div>
        </div>

        <div>
          <WalletButton />
        </div>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
        {isLoading ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthProvider";
import { toast } from "sonner";

export const WalletButton = () => {
  const { publicKey, connected } = useWallet();
  const { user } = useAuth();
  const hasHandledInitialConnection = useRef(false);

  useEffect(() => {
    const handleConnection = async () => {
      if (!hasHandledInitialConnection.current && connected && publicKey && user) {
        hasHandledInitialConnection.current = true;
        
        try {
          // First, check if any other profile already has this wallet address
          const { data: existingProfile } = await supabase
            .from('profiles')
            .select('id')
            .eq('wallet_address', publicKey.toString())
            .single();

          if (existingProfile && existingProfile.id !== user.id) {
            toast.error('This wallet is already connected to another account');
            return;
          }

          // If no other profile has this wallet or it's our own profile, proceed with the update
          const { error } = await supabase
            .from('profiles')
            .update({ wallet_address: publicKey.toString() })
            .eq('id', user.id);

          if (error) {
            console.error('Error updating wallet address:', error);
            toast.error('Failed to update wallet address');
            return;
          }

          toast.success('Successfully connected wallet');
        } catch (error) {
          console.error('Error:', error);
          toast.error('An unexpected error occurred');
        }
      }
    };

    handleConnection();
  }, [connected, publicKey, user]);

  return <WalletMultiButton />;
};
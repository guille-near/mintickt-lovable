import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthProvider";
import { toast } from "sonner";

export const WalletButton = () => {
  const { publicKey, connected, disconnect } = useWallet();
  const { user } = useAuth();
  const hasHandledInitialConnection = useRef(false);

  useEffect(() => {
    const handleConnection = async () => {
      if (!hasHandledInitialConnection.current && connected && publicKey && user) {
        hasHandledInitialConnection.current = true;
        
        try {
          // First, check if any other profile already has this wallet address
          const { data: existingProfile, error: fetchError } = await supabase
            .from('profiles')
            .select('id')
            .eq('wallet_address', publicKey.toString())
            .single();

          if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is the "no rows returned" error
            console.error('Error checking wallet address:', fetchError);
            toast.error('Error checking wallet status');
            await disconnect();
            hasHandledInitialConnection.current = false;
            return;
          }

          if (existingProfile && existingProfile.id !== user.id) {
            toast.error('This wallet is already connected to another account');
            await disconnect();
            hasHandledInitialConnection.current = false;
            return;
          }

          // If no other profile has this wallet or it's our own profile, proceed with the update
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ wallet_address: publicKey.toString() })
            .eq('id', user.id);

          if (updateError) {
            console.error('Error updating wallet address:', updateError);
            toast.error('Failed to update wallet address');
            await disconnect();
            hasHandledInitialConnection.current = false;
            return;
          }

          toast.success('Successfully connected wallet');
        } catch (error) {
          console.error('Error:', error);
          toast.error('An unexpected error occurred');
          await disconnect();
          hasHandledInitialConnection.current = false;
        }
      }
    };

    handleConnection();
  }, [connected, publicKey, user, disconnect]);

  return <WalletMultiButton />;
};
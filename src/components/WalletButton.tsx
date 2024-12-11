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
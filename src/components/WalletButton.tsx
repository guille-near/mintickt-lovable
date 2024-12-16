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
          // First, check if the user's profile exists
          const { data: userProfile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (profileError) {
            if (profileError.code === 'PGRST116') {
              // Profile doesn't exist, create it
              const { error: createError } = await supabase
                .from('profiles')
                .insert([{ 
                  id: user.id, 
                  email: user.email,
                  wallet_address: publicKey.toString()
                }]);

              if (createError) {
                console.error('Error creating profile:', createError);
                toast.error('Error setting up your profile');
                await disconnect();
                hasHandledInitialConnection.current = false;
                return;
              }
            } else {
              console.error('Error checking profile:', profileError);
              toast.error('Error checking profile status');
              await disconnect();
              hasHandledInitialConnection.current = false;
              return;
            }
          }

          // If profile exists, check if any other profile has this wallet address
          const { data: existingProfile, error: fetchError } = await supabase
            .from('profiles')
            .select('id')
            .eq('wallet_address', publicKey.toString())
            .neq('id', user.id)
            .single();

          if (fetchError && fetchError.code !== 'PGRST116') {
            console.error('Error checking wallet address:', fetchError);
            toast.error('Error checking wallet status');
            await disconnect();
            hasHandledInitialConnection.current = false;
            return;
          }

          if (existingProfile) {
            toast.error('This wallet is already connected to another account');
            await disconnect();
            hasHandledInitialConnection.current = false;
            return;
          }

          // Update the profile with the wallet address
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
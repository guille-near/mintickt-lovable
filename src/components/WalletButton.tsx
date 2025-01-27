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
      console.log("🔍 [Wallet] Connection state:", {
        connected,
        publicKey: publicKey?.toString(),
        userId: user?.id,
        hasHandledInitial: hasHandledInitialConnection.current
      });

      if (!hasHandledInitialConnection.current && connected && publicKey && user) {
        hasHandledInitialConnection.current = true;
        console.log("🎯 [Wallet] Starting wallet connection process");
        
        try {
          // First, check if the user's profile exists
          console.log("🔍 [Wallet] Checking user profile");
          const { data: userProfile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();

          if (profileError) {
            console.error('❌ [Wallet] Error checking profile:', profileError);
            toast.error('Error checking profile status');
            await disconnect();
            hasHandledInitialConnection.current = false;
            return;
          }

          if (!userProfile) {
            console.log("📝 [Wallet] Profile not found, creating new profile");
            const { error: createError } = await supabase
              .from('profiles')
              .insert([{ 
                id: user.id, 
                email: user.email,
                wallet_address: publicKey.toString()
              }]);

            if (createError) {
              console.error('❌ [Wallet] Error creating profile:', createError);
              toast.error('Error setting up your profile');
              await disconnect();
              hasHandledInitialConnection.current = false;
              return;
            }
            console.log("✅ [Wallet] Profile created successfully");
          }

          // Check if any other profile has this wallet address
          console.log("🔍 [Wallet] Checking for duplicate wallet addresses");
          const { data: existingProfile, error: fetchError } = await supabase
            .from('profiles')
            .select('id')
            .eq('wallet_address', publicKey.toString())
            .neq('id', user.id)
            .maybeSingle();

          if (fetchError) {
            console.error('❌ [Wallet] Error checking wallet address:', fetchError);
            toast.error('Error checking wallet status');
            await disconnect();
            hasHandledInitialConnection.current = false;
            return;
          }

          if (existingProfile) {
            console.error('❌ [Wallet] Wallet already connected to another account');
            toast.error('This wallet is already connected to another account');
            await disconnect();
            hasHandledInitialConnection.current = false;
            return;
          }

          // Update the profile with the wallet address
          console.log("📝 [Wallet] Updating profile with wallet address");
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ wallet_address: publicKey.toString() })
            .eq('id', user.id);

          if (updateError) {
            console.error('❌ [Wallet] Error updating wallet address:', updateError);
            toast.error('Failed to update wallet address');
            await disconnect();
            hasHandledInitialConnection.current = false;
            return;
          }

          localStorage.setItem('lastConnectedWallet', publicKey.toString());
          console.log("✅ [Wallet] Wallet connected successfully");
          toast.success('Successfully connected wallet');
        } catch (error) {
          console.error('❌ [Wallet] Unexpected error:', error);
          toast.error('An unexpected error occurred');
          await disconnect();
          hasHandledInitialConnection.current = false;
        }
      }
    };

    handleConnection();

    // Restore wallet connection on page load
    const restoreWalletConnection = async () => {
      try {
        const lastConnectedWallet = localStorage.getItem('lastConnectedWallet');
        if (lastConnectedWallet && user && !connected) {
          console.log("🔄 [Wallet] Attempting to restore wallet connection");
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('wallet_address')
            .eq('id', user.id)
            .maybeSingle();

          if (error) {
            console.error('❌ [Wallet] Error fetching profile:', error);
            return;
          }

          if (profile?.wallet_address === lastConnectedWallet) {
            console.log("✅ [Wallet] Wallet connection restored");
          } else {
            localStorage.removeItem('lastConnectedWallet');
          }
        }
      } catch (error) {
        console.error('❌ [Wallet] Error restoring wallet connection:', error);
        localStorage.removeItem('lastConnectedWallet');
      }
    };

    restoreWalletConnection();
  }, [connected, publicKey, user, disconnect]);

  return (
    <WalletMultiButton className="!bg-festival hover:!bg-festival-hover !h-10 !py-0 !rounded-md !text-white" />
  );
};

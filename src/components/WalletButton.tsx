import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useEffect } from "react";
import { useAuthState } from "@/hooks/useAuthState";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const WalletButton = () => {
  const { connected, publicKey, disconnect } = useWallet();
  const { user } = useAuthState();

  const saveWalletAddress = async (address: string) => {
    try {
      console.log('🔄 Attempting to save wallet address:', address);
      
      if (!user) {
        console.log('❌ No user found');
        return;
      }

      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('wallet_address')
        .eq('id', user.id)
        .maybeSingle();

      if (fetchError) {
        console.error('❌ Error fetching profile:', fetchError);
        return;
      }

      if (existingProfile?.wallet_address === address) {
        console.log('✅ Wallet address already saved');
        return;
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ wallet_address: address })
        .eq('id', user.id);

      if (updateError) {
        console.error('❌ Error updating wallet address:', updateError);
        toast.error('Failed to save wallet address');
        return;
      }

      console.log('✅ Wallet address saved successfully');
      toast.success('Wallet connected successfully');
    } catch (error) {
      console.error('❌ Unexpected error saving wallet address:', error);
      toast.error('Failed to save wallet address');
    }
  };

  const clearWalletAddress = async () => {
    try {
      console.log('🔄 Clearing wallet address');
      
      if (!user) {
        console.log('❌ No user found');
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({ wallet_address: null })
        .eq('id', user.id);

      if (error) {
        console.error('❌ Error clearing wallet address:', error);
        toast.error('Failed to clear wallet address');
        return;
      }

      console.log('✅ Wallet address cleared successfully');
      localStorage.removeItem('lastConnectedWallet');
    } catch (error) {
      console.error('❌ Unexpected error clearing wallet address:', error);
      toast.error('Failed to clear wallet address');
    }
  };

  const restoreWalletConnection = async () => {
    try {
      if (!user) {
        console.log('❌ No user found for wallet restoration');
        return;
      }

      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('wallet_address')
        .eq('id', user.id)
        .maybeSingle();

      if (fetchError) {
        console.error('❌ Error fetching profile for wallet restoration:', fetchError);
        return;
      }

      if (profile?.wallet_address && publicKey?.toBase58() !== profile.wallet_address) {
        console.log('⚠️ Wallet mismatch, disconnecting');
        disconnect();
      }
    } catch (error) {
      console.error('❌ Error in wallet restoration:', error);
    }
  };

  useEffect(() => {
    console.log('🔄 Wallet connection status changed:', {
      connected,
      publicKey: publicKey?.toBase58(),
      userId: user?.id
    });

    if (connected && publicKey && user) {
      const address = publicKey.toBase58();
      console.log('✅ Wallet connected:', address);
      saveWalletAddress(address);
      localStorage.setItem('lastConnectedWallet', address);
    } else if (!connected && user) {
      console.log('❌ Wallet disconnected');
      clearWalletAddress();
    }
  }, [connected, publicKey, user]);

  useEffect(() => {
    console.log('🔄 Checking wallet connection on mount');
    restoreWalletConnection();
  }, [connected, publicKey, user, disconnect]);

  return (
    <WalletMultiButton className="!bg-festival hover:!bg-festival-hover !h-10 !py-0 !rounded-md !text-white" />
  );
};
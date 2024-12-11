import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const WalletButton = () => {
  const { publicKey, connected } = useWallet();

  useEffect(() => {
    const handleWalletConnection = async () => {
      if (connected && publicKey) {
        try {
          // Check if profile already exists
          const { data: existingProfile, error: fetchError } = await supabase
            .from('profiles')
            .select()
            .eq('wallet_address', publicKey.toString())
            .single();

          if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is the "not found" error code
            console.error('Error fetching profile:', fetchError);
            toast.error('Failed to check existing profile');
            return;
          }

          if (!existingProfile) {
            // Create new profile
            const { error: insertError } = await supabase
              .from('profiles')
              .insert({
                id: crypto.randomUUID(),
                wallet_address: publicKey.toString(),
              });

            if (insertError) {
              console.error('Error creating profile:', insertError);
              toast.error('Failed to create profile');
              return;
            }

            toast.success('Wallet connected successfully!');
          }
        } catch (error) {
          console.error('Error handling wallet connection:', error);
          toast.error('Something went wrong');
        }
      }
    };

    handleWalletConnection();
  }, [connected, publicKey]);

  return (
    <div className="wallet-button-wrapper">
      <WalletMultiButton className="wallet-button" />
      <style>{`
        .wallet-button {
          background-color: #7B3FE4 !important;
          border-radius: 9999px !important;
          transition: all 0.2s !important;
        }
        .wallet-button:hover {
          background-color: #6935c4 !important;
        }
      `}</style>
    </div>
  );
};
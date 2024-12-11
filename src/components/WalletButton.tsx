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
          const { data: existingProfile } = await supabase
            .from('profiles')
            .select()
            .eq('wallet_address', publicKey.toString())
            .single();

          if (!existingProfile) {
            // Create new profile
            const { error } = await supabase
              .from('profiles')
              .insert({
                id: crypto.randomUUID(), // Generate a new UUID
                wallet_address: publicKey.toString(),
              });

            if (error) {
              console.error('Error creating profile:', error);
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
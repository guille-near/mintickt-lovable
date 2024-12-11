import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const WalletButton = () => {
  const { publicKey, connected } = useWallet();
  const navigate = useNavigate();

  useEffect(() => {
    const handleConnection = async () => {
      if (connected && publicKey) {
        try {
          // Check if profile exists
          const { data: profile, error: fetchError } = await supabase
            .from('profiles')
            .select()
            .eq('wallet_address', publicKey.toString())
            .single();

          if (fetchError) {
            if (fetchError.code === 'PGRST116') {
              // Profile doesn't exist, create it
              const { error: insertError } = await supabase
                .from('profiles')
                .insert({
                  wallet_address: publicKey.toString(),
                });

              if (insertError) {
                console.error('Error creating profile:', insertError);
                toast.error('Failed to create profile');
                return;
              }
            } else {
              console.error('Error fetching profile:', fetchError);
              toast.error('Failed to fetch profile');
              return;
            }
          }

          // Redirect to discover page
          navigate('/discover');
          toast.success('Successfully connected wallet');
        } catch (error) {
          console.error('Error:', error);
          toast.error('An unexpected error occurred');
        }
      }
    };

    handleConnection();
  }, [connected, publicKey, navigate]);

  return <WalletMultiButton />;
};
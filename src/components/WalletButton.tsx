import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";

export const WalletButton = () => {
  const { publicKey, connected } = useWallet();
  const navigate = useNavigate();
  const location = useLocation();
  const hasHandledInitialConnection = useRef(false);

  useEffect(() => {
    const handleConnection = async () => {
      // Only handle connection if we haven't done it before and wallet is connected
      if (!hasHandledInitialConnection.current && connected && publicKey) {
        hasHandledInitialConnection.current = true;
        
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

          // Only redirect to discover if we're on the home page
          if (location.pathname === '/') {
            navigate('/discover');
            toast.success('Successfully connected wallet');
          }
        } catch (error) {
          console.error('Error:', error);
          toast.error('An unexpected error occurred');
        }
      }
    };

    handleConnection();
  }, [connected, publicKey, navigate, location.pathname]);

  return <WalletMultiButton />;
};
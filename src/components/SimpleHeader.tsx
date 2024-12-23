import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const SimpleHeader = () => {
  const navigate = useNavigate();
  const [hasScrolled, setHasScrolled] = useState(false);
  const { session } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ['profile', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) {
        throw new Error('No user ID provided');
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Profile doesn't exist, create it
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert([{ 
              id: session.user.id, 
              email: session.user.email 
            }])
            .select()
            .single();

          if (createError) {
            throw createError;
          }

          return newProfile;
        }
        throw error;
      }

      return profile;
    },
    enabled: !!session?.user?.id
  });

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-200 ${
      hasScrolled ? "bg-background/80 dark:bg-transparent backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:supports-[backdrop-filter]:bg-transparent" : ""
    }`}>
      <div className="container mx-auto flex items-center justify-between p-6">
        <img 
          src="/Logo.svg" 
          alt="NFT Tickets Logo" 
          className="h-12 cursor-pointer dark:invert" 
          onClick={() => navigate('/')} 
        />
        {session ? (
          <div className="relative">
            <Avatar 
              className="h-10 w-10 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => navigate('/account')}
            >
              <AvatarImage src={profile?.avatar_url} />
              <AvatarFallback>
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            {profile?.wallet_address && (
              <div className="absolute -bottom-1 -right-1 h-5 w-5">
                <img
                  src="/solana-badge.svg"
                  alt="Solana Wallet Connected"
                  className="w-full h-full"
                />
              </div>
            )}
          </div>
        ) : (
          <Button
            variant="outline"
            onClick={() => navigate('/auth')}
            className="flex items-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            Sign In
          </Button>
        )}
      </div>
    </header>
  );
};
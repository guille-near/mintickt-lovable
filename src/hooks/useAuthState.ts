import { useState, useEffect } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function useAuthState() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Setting up auth state");
    
    async function getInitialSession() {
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Initial session:", session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session && isInitialLoad) {
          await handleProfileCreation(session.user);
          navigate("/discover");
        }
      } catch (error) {
        console.error("Error getting initial session:", error);
        toast.error("Error loading user session");
      } finally {
        setIsLoading(false);
        setIsInitialLoad(false);
      }
    }

    getInitialSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("Auth state changed:", _event, session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session && _event === 'SIGNED_IN') {
        console.log("User signed in, creating profile if needed");
        await handleProfileCreation(session.user);
        navigate("/discover");
      } else if (_event === 'SIGNED_OUT') {
        console.log("User signed out, clearing state");
        setSession(null);
        setUser(null);
        navigate("/");
      }
    });

    return () => {
      console.log("Cleaning up auth state subscription");
      subscription.unsubscribe();
    };
  }, [navigate, isInitialLoad]);

  return { session, user, isLoading, setSession, setUser };
}

async function handleProfileCreation(user: User) {
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError && profileError.code === 'PGRST116') {
    const { error: createError } = await supabase
      .from('profiles')
      .insert([{ 
        id: user.id, 
        email: user.email,
      }]);

    if (createError) {
      console.error('Error creating profile:', createError);
      toast.error('Error setting up your profile');
    }
  }
}
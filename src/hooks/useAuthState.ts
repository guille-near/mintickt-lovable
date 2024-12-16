import { useState, useEffect } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function useAuthState() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Setting up auth state");
    
    async function getInitialSession() {
      try {
        console.log("Getting initial session...");
        setIsLoading(true);
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          throw error;
        }

        console.log("Initial session retrieved:", session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          console.log("User is authenticated, checking profile...");
          await handleProfileCreation(session.user);
        }
      } catch (error) {
        console.error("Error in getInitialSession:", error);
        toast.error("Error loading user session");
      } finally {
        console.log("Initial session load complete");
        setIsLoading(false);
      }
    }

    getInitialSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email);
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user && event === 'SIGNED_IN') {
        console.log("User signed in, creating profile if needed");
        await handleProfileCreation(session.user);
        navigate("/discover");
      } else if (event === 'SIGNED_OUT') {
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
  }, [navigate]);

  return { session, user, isLoading };
}

async function handleProfileCreation(user: User) {
  console.log("Checking if profile exists for user:", user.email);
  
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError && profileError.code === 'PGRST116') {
    console.log("Profile not found, creating new profile");
    const { error: createError } = await supabase
      .from('profiles')
      .insert([{ 
        id: user.id, 
        email: user.email,
      }]);

    if (createError) {
      console.error('Error creating profile:', createError);
      toast.error('Error setting up your profile');
    } else {
      console.log("Profile created successfully");
    }
  } else {
    console.log("Profile already exists");
  }
}
import { useState, useEffect } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function useAuthState() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session && isInitialLoad) {
        navigate("/discover");
      }
      setIsInitialLoad(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session && _event === 'SIGNED_IN') {
        await handleProfileCreation(session.user);
        navigate("/discover");
      } else if (_event === 'SIGNED_OUT') {
        setSession(null);
        setUser(null);
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, isInitialLoad]);

  return { session, user, setSession, setUser };
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
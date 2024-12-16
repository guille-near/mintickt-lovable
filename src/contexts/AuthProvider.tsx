import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

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
        // Check if profile exists
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError && profileError.code === 'PGRST116') {
          // Profile doesn't exist, create it
          const { error: createError } = await supabase
            .from('profiles')
            .insert([{ 
              id: session.user.id, 
              email: session.user.email,
            }]);

          if (createError) {
            console.error('Error creating profile:', createError);
            toast.error('Error setting up your profile');
            return;
          }
        }

        navigate("/discover");
      } else if (_event === 'SIGNED_OUT') {
        // Clear local state and redirect to home
        setSession(null);
        setUser(null);
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, isInitialLoad]);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("Sign in error:", error);
        if (error.message.includes("Email not confirmed")) {
          toast.error("Please confirm your email before signing in");
        } else if (error.message.includes("Invalid login credentials")) {
          toast.error("The email or password you entered is incorrect");
        } else {
          toast.error(error.message);
        }
        return;
      }

      if (data?.user) {
        // Check if profile exists
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileError && profileError.code === 'PGRST116') {
          // Profile doesn't exist, create it
          const { error: createError } = await supabase
            .from('profiles')
            .insert([{ 
              id: data.user.id, 
              email: email,
            }]);

          if (createError) {
            console.error('Error creating profile:', createError);
            toast.error('Error setting up your profile');
            return;
          }
        }

        toast.success("Successfully signed in!");
        navigate("/discover");
      }
    } catch (error: any) {
      console.error("Sign in error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        console.error("Sign up error:", error);
        toast.error(error.message);
        return;
      }

      if (data.user) {
        toast.success("Registration successful! Please check your email to confirm your account.");
      }
    } catch (error: any) {
      console.error("Sign up error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Sign out error:", error);
        toast.error("Error signing out. Please try again.");
        return;
      }
      
      // Clear local state
      setSession(null);
      setUser(null);
      
      // Show success message and redirect
      toast.success("Successfully signed out!");
      navigate("/");
    } catch (error: any) {
      console.error("Sign out error:", error);
      toast.error("An unexpected error occurred while signing out.");
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
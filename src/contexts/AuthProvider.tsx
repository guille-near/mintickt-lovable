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
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session && _event === 'SIGNED_IN') {
        navigate("/discover");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, isInitialLoad]);

  const createProfile = async (userId: string, email: string) => {
    const { error } = await supabase
      .from('profiles')
      .insert([{ id: userId, email: email }]);
    
    if (error) {
      console.error('Error creating profile:', error);
      // Don't throw here as the user is already created
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // First check if the user exists
      const { data: userExists } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();

      if (!userExists) {
        toast.error("No account found with this email. Please sign up first.");
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast.error("Invalid password. Please try again.");
        } else {
          toast.error(error.message);
        }
        return;
      }

      if (data?.user) {
        toast.success("Successfully signed in!");
        navigate("/discover");
      }
    } catch (error: any) {
      toast.error("An unexpected error occurred. Please try again.");
      console.error("Sign in error:", error);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();

      if (existingUser) {
        toast.error("An account with this email already exists. Please sign in instead.");
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        toast.error(error.message);
        return;
      }

      if (data.user) {
        await createProfile(data.user.id, email);
        toast.success("Registration successful! Please check your email to confirm your account.");
      }
    } catch (error: any) {
      toast.error("An unexpected error occurred. Please try again.");
      console.error("Sign up error:", error);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error(error.message);
        return;
      }
      navigate("/");
      toast.success("Successfully signed out!");
    } catch (error: any) {
      toast.error("An unexpected error occurred while signing out.");
      console.error("Sign out error:", error);
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
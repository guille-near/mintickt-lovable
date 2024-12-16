import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User } from "@supabase/supabase-js";

export function useAuthOperations() {
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
        await handleProfileCreation(data.user);
        toast.success("Successfully signed in!");
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
      
      toast.success("Successfully signed out!");
    } catch (error: any) {
      console.error("Sign out error:", error);
      toast.error("An unexpected error occurred while signing out.");
    }
  };

  return { signIn, signUp, signOut };
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
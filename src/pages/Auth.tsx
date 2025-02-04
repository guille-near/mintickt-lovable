
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { Card } from "@/components/ui/card";
import { Auth as SupabaseAuth } from '@supabase/auth-ui-react';
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { ThemeSupa } from '@supabase/auth-ui-shared';

export default function Auth() {
  const { session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('🔐 [Auth] Checking session:', session);
    if (session) {
      navigate('/discover');
    }
  }, [session, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-6">
        <h1 className="text-2xl font-bold text-center mb-8">NFT Tickets</h1>
        <SupabaseAuth 
          supabaseClient={supabase}
          appearance={{ 
            theme: ThemeSupa,
            style: {
              button: {
                borderRadius: '6px',
                height: '40px',
              },
              input: {
                borderRadius: '6px',
                height: '40px',
                color: 'var(--foreground)',
                backgroundColor: 'var(--background)',
                border: '1px solid var(--border)',
              },
              label: {
                color: 'var(--foreground)',
              },
            },
          }}
          providers={[]}
          redirectTo={`${window.location.origin}/auth/callback`}
        />
      </Card>
    </div>
  );
}

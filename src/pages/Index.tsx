import { SimpleHeader } from "@/components/SimpleHeader";
import { DesktopEventCard } from "@/components/event-card/DesktopEventCard";
import { MobileEventCard } from "@/components/event-card/MobileEventCard";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeProvider";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthProvider";

const Index = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const isMobile = useIsMobile();
  const { session } = useAuth();

  // Redirect if user is authenticated
  useEffect(() => {
    if (session) {
      navigate('/discover');
    }
  }, [session, navigate]);

  // Ensure dark theme on landing page
  useEffect(() => {
    if (theme !== 'dark') {
      toggleTheme();
    }
  }, []);

  // Fetch events from Supabase
  const { data: events, isLoading } = useQuery({
    queryKey: ['featured-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('visibility', 'public')
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      return data;
    }
  });

  const handleEventClick = (eventId: string) => {
    navigate(`/event/${eventId}`);
  };

  return (
    <div className="min-h-screen dark:bg-[linear-gradient(135deg,#FF00E5_1%,transparent_8%),_linear-gradient(315deg,rgba(94,255,69,0.25)_0.5%,transparent_8%)] dark:bg-black">
      <SimpleHeader />
      <main className="container mx-auto px-6 py-12">
        <section className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Experience Web3 Events
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Purchase and collect event tickets as NFTs on Solana. Secure,
            transferable, and authentically yours.
          </p>
        </section>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-muted rounded-lg aspect-square" />
            ))}
          </div>
        ) : (
          <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events?.map((event) => (
              isMobile ? (
                <MobileEventCard
                  key={event.id}
                  title={event.title}
                  date={event.date}
                  image={event.image_url || '/placeholder.svg'}
                  location={event.location}
                  onClick={() => handleEventClick(event.id)}
                />
              ) : (
                <DesktopEventCard
                  key={event.id}
                  title={event.title}
                  date={event.date}
                  image={event.image_url || '/placeholder.svg'}
                  location={event.location}
                  price={event.price}
                  onClick={() => handleEventClick(event.id)}
                />
              )
            ))}
          </section>
        )}
      </main>
    </div>
  );
};

export default Index;
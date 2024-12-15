import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { DiscoverSidebar } from "@/components/discover/DiscoverSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DesktopEventCard } from "@/components/event-card/DesktopEventCard";
import { MobileEventCard } from "@/components/event-card/MobileEventCard";
import { supabase } from "@/integrations/supabase/client";

export default function DiscoverEvents() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: events, isLoading } = useQuery({
    queryKey: ['events', selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (selectedCategory) {
        query = query.eq('category', selectedCategory);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <DiscoverSidebar />
        <main className="flex-1 p-6">
          <SidebarTrigger className="fixed left-0 top-20 -translate-y-1/2 z-50 bg-background/80 backdrop-blur-sm border-r h-12 w-6 rounded-r-lg flex items-center justify-center hover:bg-accent" />
          
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Discover Events</h1>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-muted aspect-square rounded-lg mb-4"></div>
                    <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {/* Desktop View */}
                <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {events?.map((event) => (
                    <DesktopEventCard
                      key={event.id}
                      title={event.title}
                      date={event.date}
                      image={event.image_url || '/placeholder.svg'}
                      location={event.location}
                      price={event.price}
                      onClick={() => navigate(`/event/${event.id}`)}
                    />
                  ))}
                </div>

                {/* Mobile View */}
                <div className="space-y-4 md:hidden">
                  {events?.map((event) => (
                    <MobileEventCard
                      key={event.id}
                      title={event.title}
                      date={event.date}
                      image={event.image_url || '/placeholder.svg'}
                      location={event.location}
                      onClick={() => navigate(`/event/${event.id}`)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
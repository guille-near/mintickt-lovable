import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DesktopEventCard } from "@/components/event-card/DesktopEventCard";
import { MobileEventCard } from "@/components/event-card/MobileEventCard";
import { supabase } from "@/integrations/supabase/client";
import AuthenticatedLayout from "@/components/AuthenticatedLayout";

export default function DiscoverEvents() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: events, isLoading } = useQuery({
    queryKey: ['events', selectedCategory, searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`);
      }

      if (selectedCategory) {
        query = query.eq('category', selectedCategory);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  return (
    <AuthenticatedLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-4xl font-bold mb-8">Discover events</h1>
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search events..."
            className="pl-10 w-full max-w-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
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
    </AuthenticatedLayout>
  );
}
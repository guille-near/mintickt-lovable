import { User } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { WalletButton } from "@/components/WalletButton";
import { EventHeader } from "@/components/event-details/EventHeader";
import { EventUpdates } from "@/components/event-details/EventUpdates";
import { EventLocation } from "@/components/event-details/EventLocation";
import { TicketPurchase } from "@/components/event-details/TicketPurchase";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { useIsMobile } from "@/hooks/use-mobile";

export default function EventDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const { data: event, isLoading, error } = useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      if (!id || id === ':id') {
        throw new Error('Invalid event ID');
      }

      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          creator:profiles(
            username,
            avatar_url
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      if (!data) {
        throw new Error('Event not found');
      }

      return data;
    },
    enabled: !!id && id !== ':id',
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <p className="text-primary">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <p className="text-primary">Error loading event details. Please try again later.</p>
          {error && <p className="text-red-400 mt-2">{(error as Error).message}</p>}
        </div>
      </div>
    );
  }

  const updates = [
    {
      date: "2024-05-01",
      title: "Event Details Update",
      message: "Stay tuned for more information about this exciting event!"
    },
    {
      date: "2024-05-15",
      title: "Ticket Information",
      message: "Early bird tickets will be available soon. Don't miss out!"
    },
    {
      date: "2024-06-01",
      title: "Location Details",
      message: "Check back for specific details about the venue and directions."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 pb-24 md:pb-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {!isMobile && (
            <div className="lg:col-span-3">
              <h1 className="text-4xl md:text-6xl font-bold mb-8 text-primary">{event.title}</h1>
            </div>
          )}
          <div className="lg:col-span-1">
            {!isMobile && (
              <div className="sticky top-8 space-y-6">
                <div className="relative w-full pb-[100%] md:pb-[75%] lg:pb-[100%]">
                  <img
                    src={event.image_url || '/placeholder.svg'}
                    alt={event.title}
                    className="absolute inset-0 h-full w-full object-cover rounded-lg"
                  />
                </div>
                <div>
                  <TicketPurchase ticketPrice={event.price} eventTitle={event.title} />
                </div>
              </div>
            )}
            {isMobile && (
              <>
                <div className="relative w-full pb-[75%]">
                  <img
                    src={event.image_url || '/placeholder.svg'}
                    alt={event.title}
                    className="absolute inset-0 h-full w-full object-cover rounded-lg"
                  />
                </div>
                <h1 className="text-4xl font-bold my-6 text-primary">{event.title}</h1>
              </>
            )}
          </div>
          <div className="lg:col-span-2">
            <div className="space-y-6">
              <EventHeader
                title={event.title}
                date={new Date(event.date).toLocaleDateString()}
                time={new Date(event.date).toLocaleTimeString()}
                location={event.location || 'Location TBA'}
                organizerName={event.organizer_name}
                organizerAvatar={event.creator?.avatar_url}
              />
              
              <div>
                <h2 className="text-2xl font-bold mb-4 text-primary">Event Details</h2>
                <p className="text-muted-foreground">
                  {event.description || 'No description available.'}
                </p>
              </div>

              <EventUpdates updates={updates} />
              <EventLocation 
                location={event.location || 'Location TBA'} 
                mapUrl="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.982939764862!2d-73.98823908459384!3d40.74844097932847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1629794729765!5m2!1sen!2sus"
              />
            </div>
          </div>
        </div>
      </main>
      {isMobile && <TicketPurchase ticketPrice={event.price} eventTitle={event.title} />}
    </div>
  );
}
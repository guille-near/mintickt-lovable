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
import { SimpleHeader } from "@/components/SimpleHeader";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";

export default function EventDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const { data: event, isLoading: eventLoading, error: eventError } = useQuery({
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

  if (eventLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <SimpleHeader />
        <div className="flex-1 max-w-4xl mx-auto px-2 py-8">
          <p className="text-primary">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (eventError || !event) {
    return (
      <div className="min-h-screen flex flex-col">
        <SimpleHeader />
        <div className="flex-1 max-w-4xl mx-auto px-2 py-8">
          <p className="text-primary">Error loading event details. Please try again later.</p>
          {eventError && <p className="text-red-400 mt-2">{(eventError as Error).message}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SimpleHeader />
      <div className="flex-1 overflow-hidden">
        <div className="max-w-4xl mx-auto w-full px-2 sm:px-4">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto">
                <div className="relative w-full pb-[100%] md:pb-[75%] lg:pb-[100%]">
                  <img
                    src={event.image_url || '/placeholder.svg'}
                    alt={event.title}
                    className="absolute inset-0 h-full w-full object-cover rounded-lg"
                  />
                </div>
                {!isMobile && (
                  <div className="mt-6">
                    <EventHeader
                      title={event.title}
                      date={new Date(event.date).toLocaleDateString()}
                      time={new Date(event.date).toLocaleTimeString()}
                      location={event.location || 'Location TBA'}
                      organizerName={event.organizer_name}
                      organizerAvatar={event.creator?.avatar_url}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="lg:col-span-2 overflow-y-auto pr-4 max-h-[calc(100vh-8rem)]">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-6xl font-extrabold text-primary">{event.title}</h1>
                {isMobile && (
                  <EventHeader
                    title={event.title}
                    date={new Date(event.date).toLocaleDateString()}
                    time={new Date(event.date).toLocaleTimeString()}
                    location={event.location || 'Location TBA'}
                    organizerName={event.organizer_name}
                    organizerAvatar={event.creator?.avatar_url}
                  />
                )}
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-primary">Event Details</h2>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      {event.description || 'No description available.'}
                    </p>
                    <p>
                      Join us for an unforgettable experience at this amazing event. We've carefully curated every detail to ensure you have the best time possible. From the moment you arrive, you'll be immersed in an atmosphere of excitement and wonder.
                    </p>
                    <p>
                      This event brings together the best of entertainment, networking, and learning opportunities. Whether you're a seasoned professional or just starting out, you'll find valuable connections and insights here.
                    </p>
                    <p>
                      What to expect:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Interactive sessions with industry experts</li>
                      <li>Networking opportunities with like-minded individuals</li>
                      <li>Exclusive content and presentations</li>
                      <li>Complimentary refreshments throughout the event</li>
                      <li>Special surprise announcements and giveaways</li>
                    </ul>
                    <p>
                      Don't miss out on this extraordinary opportunity to be part of something special. Secure your tickets now and prepare for an event that will exceed your expectations.
                    </p>
                  </div>
                </div>

                {!isMobile && (
                  <div className="w-full">
                    <TicketPurchase ticketPrice={event.price} eventTitle={event.title} />
                  </div>
                )}

                <EventLocation 
                  location={event.location || 'Location TBA'} 
                  mapUrl="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.982939764862!2d-73.98823908459384!3d40.74844097932847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1629794729765!5m2!1sen!2sus"
                />

                <EventUpdates eventId={id || ''} />
              </div>
            </div>
          </div>
        </div>
      </div>
      {isMobile && <TicketPurchase ticketPrice={event.price} eventTitle={event.title} />}
    </div>
  );
}
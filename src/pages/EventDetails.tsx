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

const dummyUpdates = [
  {
    date: "2024-03-20",
    title: "¡Cambio de horario!",
    message: "Queridos asistentes, hemos ajustado el horario del evento para comenzar una hora más tarde. El nuevo horario de inicio será a las 19:00h. Este cambio nos permitirá asegurar una mejor experiencia para todos. ¡Gracias por vuestra comprensión!"
  },
  {
    date: "2024-03-15",
    title: "Confirmación artista invitado",
    message: "¡Estamos emocionados de anunciar que tendremos un artista sorpresa! No podemos revelar su nombre todavía, pero os aseguramos que será una actuación inolvidable. ¡Estad atentos a más actualizaciones!"
  },
  {
    date: "2024-03-10",
    title: "Información sobre parking",
    message: "Hemos conseguido un acuerdo con el parking cercano al venue. Los asistentes al evento tendrán un 50% de descuento mostrando su entrada. El parking está ubicado en Calle Principal 123, a solo 2 minutos andando del lugar del evento."
  }
];

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

  // For now, we'll use dummy updates instead of fetching from the database
  const eventUpdates = dummyUpdates;

  if (eventLoading) {
    return (
      <div>
        <SimpleHeader />
        <div className="container mx-auto px-4 py-8">
          <p className="text-primary">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (eventError || !event) {
    return (
      <div>
        <SimpleHeader />
        <div className="container mx-auto px-4 py-8">
          <p className="text-primary">Error loading event details. Please try again later.</p>
          {eventError && <p className="text-red-400 mt-2">{(eventError as Error).message}</p>}
        </div>
      </div>
    );
  }

  return (
    <div>
      <SimpleHeader />
      <div className="container mx-auto px-4 py-8 pb-32 md:pb-24">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1 lg:sticky lg:top-0 lg:self-start">
            <div className="space-y-6">
              <div className="relative w-full pb-[100%] md:pb-[75%] lg:pb-[100%]">
                <img
                  src={event.image_url || '/placeholder.svg'}
                  alt={event.title}
                  className="absolute inset-0 h-full w-full object-cover rounded-lg"
                />
              </div>
              {!isMobile && (
                <EventHeader
                  title={event.title}
                  date={new Date(event.date).toLocaleDateString()}
                  time={new Date(event.date).toLocaleTimeString()}
                  location={event.location || 'Location TBA'}
                  organizerName={event.organizer_name}
                  organizerAvatar={event.creator?.avatar_url}
                />
              )}
            </div>
          </div>
          <div className="lg:col-span-2 lg:max-h-screen lg:overflow-y-auto">
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
      {isMobile && <TicketPurchase ticketPrice={event.price} eventTitle={event.title} />}
    </div>
  );
}

import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { SimpleHeader } from "@/components/SimpleHeader";
import { EventHeader } from "@/components/event-details/EventHeader";
import { EventImage } from "@/components/event-details/EventImage";
import { EventContent } from "@/components/event-details/EventContent";
import { TicketPurchase } from "@/components/event-details/TicketPurchase";
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
      <div className="min-h-screen flex flex-col dark:bg-[linear-gradient(135deg,#FF00E5_1%,transparent_8%),_linear-gradient(315deg,rgba(94,255,69,0.25)_0.5%,transparent_8%)] dark:bg-black">
        <SimpleHeader />
        <div className="flex-1 max-w-4xl mx-auto px-2 py-8">
          <p className="text-primary">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (eventError || !event) {
    return (
      <div className="min-h-screen flex flex-col dark:bg-[linear-gradient(135deg,#FF00E5_1%,transparent_8%),_linear-gradient(315deg,rgba(94,255,69,0.25)_0.5%,transparent_8%)] dark:bg-black">
        <SimpleHeader />
        <div className="flex-1 max-w-4xl mx-auto px-2 py-8">
          <p className="text-primary">Error loading event details. Please try again later.</p>
          {eventError && <p className="text-red-400 mt-2">{(eventError as Error).message}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen dark:bg-[linear-gradient(135deg,#FF00E5_1%,transparent_8%),_linear-gradient(315deg,rgba(94,255,69,0.25)_0.5%,transparent_8%)] dark:bg-black">
      <SimpleHeader />
      <div className="flex-1 pt-6">
        <div className="max-w-4xl mx-auto w-full">
          <div className={`grid gap-8 ${isMobile ? '' : 'lg:grid-cols-3'}`}>
            <div className={`${isMobile ? 'px-4' : 'lg:col-span-1'}`}>
              <div className={`${isMobile ? '' : 'sticky top-0 max-h-[calc(100vh-4rem)] overflow-y-auto'}`}>
                <EventImage imageUrl={event.image_url} title={event.title} />
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
            <div className={`${isMobile ? 'px-4 pb-32' : 'lg:col-span-2 pr-4 max-h-[calc(100vh-8rem)] overflow-y-auto'}`}>
              <div className="space-y-6">
                <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-custom-gradient-start to-custom-gradient-end bg-clip-text text-transparent dark:text-primary">{event.title}</h1>
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
                {!isMobile && (
                  <div className="w-full">
                    <TicketPurchase ticketPrice={event.price} eventTitle={event.title} />
                  </div>
                )}
                <EventContent 
                  description={event.description}
                  location={event.location}
                  id={event.id}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {isMobile && <TicketPurchase ticketPrice={event.price} eventTitle={event.title} />}
    </div>
  );
}
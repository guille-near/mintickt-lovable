import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { SimpleHeader } from "@/components/SimpleHeader";
import { EventHeader } from "@/components/event-details/EventHeader";
import { EventImage } from "@/components/event-details/EventImage";
import { EventContent } from "@/components/event-details/EventContent";
import { TicketPurchase } from "@/components/event-details/TicketPurchase";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogContent, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

export default function EventDetails() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  console.log('🔍 [EventDetails] Component mounted with eventId:', eventId);

  const { data: event, isLoading: eventLoading, error: eventError } = useQuery({
    queryKey: ['event', eventId],
    queryFn: async () => {
      console.log('📡 [EventDetails] Starting event fetch for ID:', eventId);

      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select(`
          *,
          creator:profiles (
            username,
            avatar_url
          )
        `)
        .eq('id', eventId)
        .single();

      console.log('📦 [EventDetails] Supabase response:', { eventData, eventError });

      if (eventError) {
        console.error('❌ [EventDetails] Error loading event:', eventError);
        throw new Error(eventError.message);
      }

      if (!eventData) {
        console.error('❌ [EventDetails] No event found');
        throw new Error('Event not found');
      }

      console.log('✅ [EventDetails] Event loaded successfully:', eventData);
      return eventData;
    },
    retry: 1,
    retryDelay: 1000,
    meta: {
      errorMessage: "Could not load the event. Please try again."
    }
  });

  console.log('🔄 [EventDetails] Current state:', { event, eventLoading, eventError });

  if (eventLoading) {
    console.log('⏳ [EventDetails] Loading state');
    return (
      <div className="min-h-screen flex flex-col dark:bg-[linear-gradient(135deg,#FF00E5_1%,transparent_8%),_linear-gradient(315deg,rgba(94,255,69,0.25)_0.5%,transparent_8%)] dark:bg-black">
        <SimpleHeader />
        <div className="flex-1 max-w-4xl mx-auto px-2 py-8">
          <p className="text-primary font-yrsa">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (eventError || !event) {
    console.error('❌ [EventDetails] Error state:', eventError);
    return (
      <div className="min-h-screen flex flex-col dark:bg-[linear-gradient(135deg,#FF00E5_1%,transparent_8%),_linear-gradient(315deg,rgba(94,255,69,0.25)_0.5%,transparent_8%)] dark:bg-black">
        <SimpleHeader />
        <div className="flex-1 max-w-4xl mx-auto px-2 py-8">
          <p className="text-primary font-yrsa">Error loading event details. Please try again.</p>
          {eventError && <p className="text-red-400 mt-2 font-yrsa">{(eventError as Error).message}</p>}
          <Button 
            onClick={() => navigate('/discover')} 
            className="mt-4"
          >
            Back to Events
          </Button>
        </div>
      </div>
    );
  }

  console.log('✨ [EventDetails] Rendering event:', event);

  return (
    <div className="flex flex-col min-h-screen dark:bg-[linear-gradient(135deg,#FF00E5_1%,transparent_8%),_linear-gradient(315deg,rgba(94,255,69,0.25)_0.5%,transparent_8%)] dark:bg-black">
      <SimpleHeader />
      <div className="flex-1 pt-6">
        <div className="max-w-4xl mx-auto w-full">
          <div className={`grid gap-8 ${isMobile ? '' : 'lg:grid-cols-3'}`}>
            <div className={`${isMobile ? 'px-4' : 'lg:col-span-1'}`}>
              <div className={`${isMobile ? '' : 'sticky top-0 max-h-[calc(100vh-4rem)] overflow-y-auto space-y-6'}`}>
                <EventImage imageUrl={event.image_url} title={event.title} />
                {!isMobile && (
                  <>
                    <div>
                      <EventHeader
                        title={event.title}
                        date={new Date(event.date).toLocaleDateString()}
                        time={new Date(event.date).toLocaleTimeString()}
                        location={event.location || 'Location TBA'}
                        organizerName={event.organizer_name}
                        organizerAvatar={event.creator?.avatar_url}
                      />
                    </div>
                    <TicketPurchase ticketPrice={event.price} eventTitle={event.title} />
                  </>
                )}
              </div>
            </div>
            <div className={`${isMobile ? 'px-4 pb-32' : 'lg:col-span-2 pr-4 max-h-[calc(100vh-8rem)] overflow-y-auto'}`}>
              <div className="space-y-6">
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter bg-gradient-to-r from-custom-gradient-start to-custom-gradient-end bg-clip-text text-transparent dark:text-primary">{event.title}</h1>
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
                <EventContent 
                  description={event.description}
                  location={event.location}
                  id={event.id}
                  price={event.price}
                  title={event.title}
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
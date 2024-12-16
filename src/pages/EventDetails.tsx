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
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const { data: event, isLoading: eventLoading, error: eventError } = useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      // Validación inicial del ID
      if (!id) {
        console.error('No se proporcionó ID de evento');
        throw new Error('ID de evento no proporcionado');
      }

      // Validar formato UUID
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(id)) {
        console.error('Formato de ID inválido:', id);
        throw new Error('Formato de ID inválido');
      }

      console.log('Iniciando búsqueda de evento con ID:', id);

      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select(`
          *,
          creator:profiles (
            username,
            avatar_url
          )
        `)
        .eq('id', id)
        .single();

      console.log('Respuesta de Supabase:', { eventData, eventError });

      if (eventError) {
        console.error('Error al cargar el evento:', eventError);
        throw new Error(eventError.message);
      }

      if (!eventData) {
        console.error('No se encontró el evento');
        throw new Error('Evento no encontrado');
      }

      console.log('Evento cargado exitosamente:', eventData);
      return eventData;
    },
    retry: 1,
    retryDelay: 1000,
    onError: (error) => {
      console.error('Error en la consulta:', error);
      toast.error("No se pudo cargar el evento. Por favor, intenta de nuevo.");
    }
  });

  if (eventLoading) {
    return (
      <div className="min-h-screen flex flex-col dark:bg-[linear-gradient(135deg,#FF00E5_1%,transparent_8%),_linear-gradient(315deg,rgba(94,255,69,0.25)_0.5%,transparent_8%)] dark:bg-black">
        <SimpleHeader />
        <div className="flex-1 max-w-4xl mx-auto px-2 py-8">
          <p className="text-primary font-yrsa">Cargando detalles del evento...</p>
        </div>
      </div>
    );
  }

  if (eventError || !event) {
    return (
      <div className="min-h-screen flex flex-col dark:bg-[linear-gradient(135deg,#FF00E5_1%,transparent_8%),_linear-gradient(315deg,rgba(94,255,69,0.25)_0.5%,transparent_8%)] dark:bg-black">
        <SimpleHeader />
        <div className="flex-1 max-w-4xl mx-auto px-2 py-8">
          <p className="text-primary font-yrsa">Error al cargar los detalles del evento. Por favor, intenta de nuevo.</p>
          {eventError && <p className="text-red-400 mt-2 font-yrsa">{(eventError as Error).message}</p>}
          <Button 
            onClick={() => navigate('/discover')} 
            className="mt-4"
          >
            Volver a Eventos
          </Button>
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
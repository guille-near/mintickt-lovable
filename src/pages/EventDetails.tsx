import { User } from 'lucide-react';
import { useParams } from 'react-router-dom';
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

export default function EventDetails() {
  const { id } = useParams<{ id: string }>();

  const { data: event, isLoading, error } = useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      console.log('Fetching event with ID:', id);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Fetched event:', data);
      return data;
    },
    enabled: !!id,
  });

  // Sample updates data
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <div className="relative w-full pb-[100%] md:pb-[75%] lg:pb-[100%]">
              <img
                src={event.image_url || '/placeholder.svg'}
                alt={event.title}
                className="absolute inset-0 h-full w-full object-cover rounded-lg"
              />
            </div>
          </div>
          <div className="lg:col-span-2 space-y-6">
            <EventHeader
              title={event.title}
              date={new Date(event.date).toLocaleDateString()}
              time={new Date(event.date).toLocaleTimeString()}
              location={event.location || 'Location TBA'}
            />
            
            <Card className="w-full md:w-1/2 bg-card">
              <CardContent className="flex items-center space-x-4 py-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder.svg" alt="Event Organizer" />
                  <AvatarFallback><User className="h-6 w-6" /></AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-primary">Event Organizer</p>
                  <p className="text-sm text-muted-foreground">Organizer</p>
                </div>
              </CardContent>
            </Card>

            <div>
              <h2 className="text-2xl font-bold mb-4 text-primary">Event Details</h2>
              <p className="text-muted-foreground">
                {event.description || 'No description available.'}
              </p>
            </div>

            <EventUpdates updates={updates} />
            <TicketPurchase ticketPrice={event.price} eventTitle={event.title} />
            <EventLocation 
              location={event.location || 'Location TBA'} 
              mapUrl="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.982939764862!2d-73.98823908459384!3d40.74844097932847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1629794729765!5m2!1sen!2sus"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
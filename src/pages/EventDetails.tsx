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

export default function EventDetails() {
  const { id } = useParams();

  const { data: event, isLoading, error } = useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary to-primary">
        <header className="container mx-auto flex items-center justify-between p-6">
          <h1 className="text-2xl font-bold text-white">NFT Tickets</h1>
          <WalletButton />
        </header>
        <div className="container mx-auto px-4 py-8">
          <p className="text-white">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary to-primary">
        <header className="container mx-auto flex items-center justify-between p-6">
          <h1 className="text-2xl font-bold text-white">NFT Tickets</h1>
          <WalletButton />
        </header>
        <div className="container mx-auto px-4 py-8">
          <p className="text-white">Error loading event details. Please try again later.</p>
        </div>
      </div>
    );
  }

  // Mock updates data (since we don't have this in the database yet)
  const updates = [
    {
      date: "2024-05-01",
      title: "Headliner Announcement Coming Soon!",
      message: "Exciting news! We've just confirmed our headliner for the Summer Music Festival 2024. Stay tuned for the big reveal next week!"
    },
    {
      date: "2024-05-15",
      title: "Early Bird Tickets Now Available",
      message: "Early bird tickets are now on sale! Get them before they're gone. First 100 buyers get a special meet-and-greet pass!"
    },
    {
      date: "2024-06-01",
      title: "Full Lineup Announced",
      message: "We're thrilled to announce our full lineup! Check our website for the complete list of amazing artists joining us this summer."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary to-primary">
      <header className="container mx-auto flex items-center justify-between p-6">
        <h1 className="text-2xl font-bold text-white">NFT Tickets</h1>
        <WalletButton />
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1 lg:sticky lg:top-8 lg:self-start">
            <div className="aspect-square w-full overflow-hidden rounded-lg bg-card">
              <img
                src={event.image_url || '/placeholder.svg'}
                alt={event.title}
                className="object-cover w-full h-full"
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
            
            <Card className="w-full md:w-1/2 bg-card backdrop-blur-sm">
              <CardContent className="flex items-center space-x-4 py-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder.svg" alt="Event Organizer" />
                  <AvatarFallback><User className="h-6 w-6" /></AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-white">Event Organizer</p>
                  <p className="text-sm text-gray-300">Organizer</p>
                </div>
              </CardContent>
            </Card>

            <div>
              <h2 className="text-2xl font-bold mb-4 text-white">Event Details</h2>
              <p className="text-gray-300">
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
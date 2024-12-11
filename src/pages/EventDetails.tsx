import { User } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { WalletButton } from "@/components/WalletButton";
import { EventHeader } from "@/components/event-details/EventHeader";
import { EventUpdates } from "@/components/event-details/EventUpdates";
import { EventLocation } from "@/components/event-details/EventLocation";
import { TicketPurchase } from "@/components/event-details/TicketPurchase";

export default function EventDetails() {
  // Mock event data
  const event = {
    title: "Summer Music Festival 2024",
    date: "2024-07-15",
    time: "12:00 PM - 10:00 PM",
    location: "Sunshine Park, 123 Music Lane, Harmony City",
    organizer: "Harmony Events Co.",
    ticketPrice: 50,
    availableTickets: 500,
    image: "/placeholder.svg",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.982939764862!2d-73.98823908459384!3d40.74844097932847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1629794729765!5m2!1sen!2sus",
    updates: [
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
    ]
  };

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
                src={event.image}
                alt={event.title}
                className="object-cover w-full h-full"
              />
            </div>
          </div>
          <div className="lg:col-span-2 space-y-6">
            <EventHeader
              title={event.title}
              date={event.date}
              time={event.time}
              location={event.location}
            />
            
            <Card className="w-full md:w-1/2 bg-card backdrop-blur-sm">
              <CardContent className="flex items-center space-x-4 py-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder.svg" alt={event.organizer} />
                  <AvatarFallback><User className="h-6 w-6" /></AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-white">{event.organizer}</p>
                  <p className="text-sm text-gray-300">Organizer</p>
                </div>
              </CardContent>
            </Card>

            <div>
              <h2 className="text-2xl font-bold mb-4 text-white">Event Details</h2>
              <p className="text-gray-300">
                Join us for an unforgettable summer music festival featuring top artists and amazing performances.
              </p>
            </div>

            <EventUpdates updates={event.updates} />
            <TicketPurchase ticketPrice={event.ticketPrice} eventTitle={event.title} />
            <EventLocation location={event.location} mapUrl={event.mapUrl} />
          </div>
        </div>
      </div>
    </div>
  );
}
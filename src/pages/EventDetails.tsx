import { useState } from 'react'
import { Calendar, Clock, MapPin, Ticket, User, MessageCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { WalletButton } from "@/components/WalletButton"

export default function EventDetails() {
  const [ticketQuantity, setTicketQuantity] = useState(1)

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
  }

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
            <h1 className="text-3xl font-bold text-white">{event.title}</h1>
            <div className="space-y-4 text-white">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>{event.location}</span>
              </div>
            </div>
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
            <Card className="bg-card backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Updates</CardTitle>
                <CardDescription className="text-gray-300">Latest updates from the organizer</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {event.updates.map((update, index) => (
                    <Dialog key={index}>
                      <DialogTrigger asChild>
                        <div className="border-b border-gray-700 pb-4 last:border-b-0 last:pb-0 cursor-pointer hover:bg-gray-800/50 rounded-md p-2 transition-colors">
                          <p className="text-sm text-gray-400 mb-2">{update.date}</p>
                          <div className="flex items-start space-x-2">
                            <MessageCircle className="w-5 h-5 mt-1 flex-shrink-0 text-gray-300" />
                            <div>
                              <p className="text-sm font-medium text-white">{update.title}</p>
                              <p className="text-sm text-gray-400 mt-1 line-clamp-2">{update.message}</p>
                            </div>
                          </div>
                        </div>
                      </DialogTrigger>
                      <DialogContent className="bg-card backdrop-blur-sm">
                        <DialogHeader>
                          <DialogTitle className="text-white">{update.title}</DialogTitle>
                          <DialogDescription className="text-gray-300">{update.date}</DialogDescription>
                        </DialogHeader>
                        <p className="mt-4 text-gray-300">{update.message}</p>
                      </DialogContent>
                    </Dialog>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Get Your Tickets</CardTitle>
                <CardDescription className="text-gray-300">Secure your spot at {event.title}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-white">Number of Tickets</Label>
                    <Input 
                      type="number" 
                      min="1" 
                      max="10" 
                      value={ticketQuantity} 
                      onChange={(e) => setTicketQuantity(parseInt(e.target.value) || 1)} 
                      className="bg-background/50 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Price per Ticket</Label>
                    <Input value={`${event.ticketPrice} SOL`} disabled className="bg-background/50 text-white" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-2xl font-bold text-white">
                  Total: {ticketQuantity * event.ticketPrice} SOL
                </div>
                <Button className="bg-primary text-white hover:bg-primary/80">
                  <Ticket className="mr-2 h-4 w-4" /> Buy Tickets
                </Button>
              </CardFooter>
            </Card>
            <Card className="bg-card backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Event Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="aspect-video w-full overflow-hidden rounded-md">
                    <iframe
                      src={event.mapUrl}
                      width="600"
                      height="450"
                      style={{border:0}}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="w-full h-full"
                    ></iframe>
                  </div>
                  <p className="text-sm text-gray-300">
                    {event.location}
                  </p>
                  <Button variant="outline" className="text-white hover:text-primary-foreground">
                    <MapPin className="mr-2 h-4 w-4" /> Get Directions
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
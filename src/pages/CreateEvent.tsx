import * as React from "react"
import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { DateTimePicker } from "@/components/create-event/DateTimePicker"
import { ImageUpload } from "@/components/create-event/ImageUpload"
import { GiphySearch } from "@/components/create-event/GiphySearch"
import { useWallet } from "@solana/wallet-adapter-react"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

export default function CreateEvent() {
  const navigate = useNavigate()
  const { publicKey } = useWallet()
  const [formData, setFormData] = React.useState({
    name: "",
    date: undefined as Date | undefined,
    location: "",
    description: "",
    image: null as File | null,
    giphyUrl: "",
    ticketType: "free",
    price: "",
    totalTickets: "100"
  })

  const [showGiphySearch, setShowGiphySearch] = React.useState(false)
  const eventNameInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (eventNameInputRef.current) {
      eventNameInputRef.current.focus()
    }
  }, [])

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!publicKey) {
      toast.error("Please connect your wallet first")
      return
    }

    if (!formData.name || !formData.date || !formData.location) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      // Get the creator's profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('wallet_address', publicKey.toString())
        .single()

      if (!profile) {
        toast.error("Profile not found")
        return
      }

      // Create the event
      const { data: event, error } = await supabase
        .from('events')
        .insert({
          title: formData.name,
          description: formData.description,
          date: formData.date?.toISOString(),
          location: formData.location,
          image_url: formData.giphyUrl,
          price: formData.ticketType === 'free' ? 0 : parseFloat(formData.price),
          total_tickets: parseInt(formData.totalTickets),
          remaining_tickets: parseInt(formData.totalTickets),
          creator_id: profile.id
        })
        .select()
        .single()

      if (error) throw error

      toast.success("Event created successfully!")
      navigate(`/event/${event.id}`)
    } catch (error) {
      console.error('Error creating event:', error)
      toast.error("Failed to create event")
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <ImageUpload
                image={formData.image}
                giphyUrl={formData.giphyUrl}
                onImageChange={(image) => handleChange('image', image)}
                onGiphyUrlChange={(url) => handleChange('giphyUrl', url)}
                onGiphySearchOpen={() => setShowGiphySearch(true)}
              />
            </div>
            <div className="md:col-span-2 flex flex-col">
              <input 
                type="text"
                ref={eventNameInputRef}
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Enter your event name"
                className="w-full text-2xl md:text-4xl font-bold bg-transparent border-b border-input focus:outline-none focus:border-ring pb-2 mb-6 text-foreground placeholder-muted-foreground"
              />
              <Card className="bg-card border-border">
                <CardContent className="p-6 space-y-4">
                  <div>
                    <Label className="text-foreground">Date and Time</Label>
                    <DateTimePicker
                      date={formData.date}
                      setDate={(date) => handleChange('date', date)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="location" className="text-foreground">Location</Label>
                    <Input 
                      id="location" 
                      value={formData.location}
                      onChange={(e) => handleChange('location', e.target.value)}
                      placeholder="Enter event location"
                      className="bg-input text-input-foreground placeholder-muted-foreground border-input"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-foreground">Description</Label>
                    <Textarea 
                      id="description" 
                      value={formData.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      placeholder="Describe your event"
                      rows={3}
                      className="bg-input text-input-foreground placeholder-muted-foreground border-input"
                    />
                  </div>

                  <div>
                    <Label className="text-foreground">Ticket Type</Label>
                    <Tabs defaultValue="free" onValueChange={(value) => handleChange('ticketType', value)} className="w-full mt-2">
                      <TabsList className="grid w-1/2 grid-cols-2 bg-muted">
                        <TabsTrigger value="free" className="text-sm py-1 data-[state=active]:bg-background data-[state=active]:text-foreground">Free</TabsTrigger>
                        <TabsTrigger value="paid" className="text-sm py-1 data-[state=active]:bg-background data-[state=active]:text-foreground">Paid</TabsTrigger>
                      </TabsList>
                      <TabsContent value="free">
                        <p className="text-sm text-muted-foreground mt-2">This event is free to attend.</p>
                      </TabsContent>
                      <TabsContent value="paid">
                        <div className="relative mt-2">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">€</span>
                          <Input
                            id="price"
                            type="number"
                            value={formData.price}
                            onChange={(e) => handleChange('price', e.target.value)}
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                            className="pl-7 bg-input text-input-foreground placeholder-muted-foreground border-input"
                          />
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>

                  <div>
                    <Label htmlFor="totalTickets" className="text-foreground">Total Tickets</Label>
                    <Input 
                      id="totalTickets" 
                      type="number"
                      value={formData.totalTickets}
                      onChange={(e) => handleChange('totalTickets', e.target.value)}
                      min="1"
                      className="bg-input text-input-foreground placeholder-muted-foreground border-input"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">Create Event</Button>
          </div>
        </form>

        {showGiphySearch && (
          <GiphySearch
            onSelect={(gif) => {
              handleChange('giphyUrl', gif.images.original.url)
              handleChange('image', null)
              setShowGiphySearch(false)
            }}
            onClose={() => setShowGiphySearch(false)}
          />
        )}
      </div>
    </div>
  )
}
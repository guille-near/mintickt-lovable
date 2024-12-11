import * as React from "react"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarIcon, Upload, Sticker } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { GiphyFetch } from "@giphy/js-fetch-api"
import { Grid } from "@giphy/react-components"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { useWallet } from "@solana/wallet-adapter-react"
import { toast } from "sonner"

const gf = new GiphyFetch('ZJiC6NxTDkQPeckG9KS7OCcU6kGdSyVe')

interface DateTimePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

function DateTimePicker({ date, setDate }: DateTimePickerProps) {
  const [selectedTime, setSelectedTime] = React.useState<string | undefined>(
    date ? format(date, "HH:mm") : undefined
  )

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const newDate = new Date(selectedDate)
      if (selectedTime) {
        const [hours, minutes] = selectedTime.split(':')
        newDate.setHours(parseInt(hours, 10), parseInt(minutes, 10))
      }
      setDate(newDate)
    } else {
      setDate(undefined)
    }
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    if (date) {
      const [hours, minutes] = time.split(':')
      const newDate = new Date(date)
      newDate.setHours(parseInt(hours, 10), parseInt(minutes, 10))
      setDate(newDate)
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date ? "text-muted-foreground" : "text-foreground",
            "bg-background border-input hover:bg-accent hover:text-accent-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP HH:mm") : <span>Pick a date and time</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-popover" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          initialFocus
          className="bg-popover text-popover-foreground"
        />
        <div className="p-3 border-t border-border">
          <Select onValueChange={handleTimeSelect} value={selectedTime}>
            <SelectTrigger className="bg-popover border-input text-popover-foreground">
              <SelectValue placeholder="Select a time" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-input">
              {Array.from({ length: 24 * 4 }).map((_, i) => {
                const hours = Math.floor(i / 4)
                const minutes = (i % 4) * 15
                const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
                return <SelectItem key={i} value={timeString} className="text-popover-foreground hover:bg-accent hover:text-accent-foreground">{timeString}</SelectItem>
              })}
            </SelectContent>
          </Select>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default function CreateEventPage() {
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

  const [showGiphySearch, setShowGiphySearch] = useState(false)
  const [giphySearchTerm, setGiphySearchTerm] = useState("")
  const eventNameInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (eventNameInputRef.current) {
      eventNameInputRef.current.focus()
    }
  }, [])

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleChange('image', e.target.files[0])
      handleChange('giphyUrl', "")
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleChange('image', e.dataTransfer.files[0])
      handleChange('giphyUrl', "")
    }
  }

  const handleGiphySelect = (gif: any) => {
    handleChange('giphyUrl', gif.images.original.url)
    handleChange('image', null)
    setShowGiphySearch(false)
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

  const fetchGifs = (offset: number) => {
    if (giphySearchTerm) {
      return gf.search(giphySearchTerm, { offset, limit: 10 })
    } else {
      return gf.trending({ offset, limit: 10 })
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-4">
              <Card className="aspect-square border-0 bg-card">
                <CardContent className="p-0 h-full">
                  <div 
                    className={cn(
                      "relative w-full h-full rounded-lg flex flex-col items-center justify-center cursor-pointer overflow-hidden",
                      !formData.image && !formData.giphyUrl && "border-2 border-dashed border-border"
                    )}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    <Label htmlFor="event-image" className="sr-only">Event Image</Label>
                    {formData.image ? (
                      <img
                        src={URL.createObjectURL(formData.image)}
                        alt="Event preview"
                        className="w-full h-full object-cover"
                      />
                    ) : formData.giphyUrl ? (
                      <img
                        src={formData.giphyUrl}
                        alt="Event preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center p-4">
                        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Drag & drop or click to upload
                        </p>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 164 35" className="w-16 h-4 mt-2 mx-auto">
                          <path d="M0 3h4v29H0zm24 0h4v29h-4zm18 0h4v29h-4zm67 0h4v29h-4zm35 0h4v29h-4zm17 0h4v29h-4zM5 3h17v4H5zm25 0h12v4H30zm19 0h31v4H49zm48 0h8v4h-8zm15 0h18v4H112zm30 0h17v4h-17zM5 17h8v4H5zm25 0h8v4h-8zm19 0h8v4h-8zm48 0h8v4h-8zm15 0h8v4h-8zm30 0h8v4h-8zM5 31h17v4H5zm25 0h12v4H30zm19 0h16v4H49zm48 0h21v4h-21zm15 0h18v4h-18zm30 0h7v4h-7z" fill="currentColor" />
                        </svg>
                      </div>
                    )}
                    <input
                      id="event-image"
                      type="file"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={handleImageUpload}
                      accept="image/*"
                    />
                  </div>
                </CardContent>
              </Card>
              <Button
                type="button"
                variant="outline"
                className="w-full flex items-center justify-center space-x-1 bg-background h-9 px-3 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground border-input"
                onClick={() => setShowGiphySearch(true)}
              >
                <Sticker className="w-4 h-4 mr-1" />
                <span>Search Giphy</span>
              </Button>
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
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-background rounded-lg p-6 w-full max-w-2xl border border-border">
              <div className="flex items-center mb-4">
                <Input
                  type="text"
                  placeholder="Search Giphy"
                  value={giphySearchTerm}
                  onChange={(e) => setGiphySearchTerm(e.target.value)}
                  className="flex-grow mr-2 bg-input text-input-foreground placeholder-muted-foreground border-input"
                />
                <Button onClick={() => setShowGiphySearch(false)} className="bg-secondary text-secondary-foreground hover:bg-secondary/80">Close</Button>
              </div>
              <div className="h-96 overflow-y-auto">
                <Grid
                  width={600}
                  columns={3}
                  fetchGifs={fetchGifs}
                  onGifClick={handleGiphySelect}
                  key={giphySearchTerm}
                  noLink={true}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
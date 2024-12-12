import { useState } from 'react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { supabase } from "@/integrations/supabase/client"
import { EventCard } from "@/components/EventCard"
import { Header } from "@/components/Header"

const DiscoverEvents = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const { data: events, isLoading, error } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    }
  })

  const filterEvents = () => {
    if (!events) return []
    return events.filter(event => 
      event.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  const filteredEvents = filterEvents()

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="container mx-auto py-8 text-foreground">Loading events...</div>
      </>
    )
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="container mx-auto py-8 text-foreground">Error loading events: {error.message}</div>
      </>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8 text-foreground">Discover Events</h1>
        
        <div className="flex gap-4 mb-8">
          <Input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Music">Music</SelectItem>
              <SelectItem value="Technology">Technology</SelectItem>
              <SelectItem value="Food">Food</SelectItem>
              <SelectItem value="Art">Art</SelectItem>
              <SelectItem value="Business">Business</SelectItem>
              <SelectItem value="Entertainment">Entertainment</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEvents.map(event => (
            <EventCard
              key={event.id}
              id={event.id}
              title={event.title}
              date={new Date(event.date).toLocaleDateString()}
              price={Number(event.price)}
              image={event.image_url || '/placeholder.svg'}
              location={event.location}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DiscoverEvents;
import { useState } from 'react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
        <div className="container py-8">Loading events...</div>
      </>
    )
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="container py-8">Error loading events: {error.message}</div>
      </>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="container py-8 space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Discover Events</h1>
          <p className="text-muted-foreground">
            Browse and find events that interest you.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Input
            type="search"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
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
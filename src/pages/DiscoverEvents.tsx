import { useState, useCallback } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, MapPinIcon } from 'lucide-react'

// Mock data for events
const mockEvents = [
  { id: 1, title: "Summer Music Festival", date: "2023-07-15", location: "Central Park", category: "Music" },
  { id: 2, title: "Tech Conference 2023", date: "2023-08-10", location: "Convention Center", category: "Technology" },
  { id: 3, title: "Food & Wine Expo", date: "2023-09-05", location: "City Hall", category: "Food" },
  { id: 4, title: "Art Gallery Opening", date: "2023-07-22", location: "Downtown Museum", category: "Art" },
  { id: 5, title: "Startup Pitch Night", date: "2023-08-18", location: "Innovation Hub", category: "Business" },
  { id: 6, title: "Comedy Night", date: "2023-09-12", location: "Laugh Factory", category: "Entertainment" },
]

const DiscoverEvents = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const filterEvents = useCallback(() => {
    return mockEvents.filter(event => 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === "all" || event.category === selectedCategory)
    )
  }, [searchTerm, selectedCategory])

  const filteredEvents = filterEvents()

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary to-primary">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8 text-white">Discover Events</h1>
        
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => (
            <Card key={event.id} className="bg-card backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">{event.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="flex items-center text-sm text-gray-300 mb-2">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {event.date}
                </p>
                <p className="flex items-center text-sm text-gray-300">
                  <MapPinIcon className="mr-2 h-4 w-4" />
                  {event.location}
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full text-white hover:text-primary-foreground">
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DiscoverEvents;
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DateTimePicker } from "./DateTimePicker";
import { ImageUpload } from "./ImageUpload";
import { GiphySearch } from "./GiphySearch";
import { useState, useRef, useEffect } from "react";

interface FormData {
  name: string;
  date: Date | undefined;
  location: string;
  description: string;
  image: File | null;
  giphyUrl: string;
  ticketType: string;
  price: string;
  totalTickets: string;
}

interface EventFormProps {
  onSubmit: (formData: FormData) => void;
}

export const EventForm = ({ onSubmit }: EventFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    date: undefined,
    location: "",
    description: "",
    image: null,
    giphyUrl: "",
    ticketType: "free",
    price: "",
    totalTickets: "100"
  });

  const [showGiphySearch, setShowGiphySearch] = useState(false);
  const eventNameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (eventNameInputRef.current) {
      eventNameInputRef.current.focus();
    }
  }, []);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isFree = formData.ticketType === 'free';
    const submissionData = {
      ...formData,
      price: isFree ? null : formData.price,
      is_free: isFree,
    };
    onSubmit(submissionData);
  };

  return (
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

      {showGiphySearch && (
        <GiphySearch
          onSelect={(gif) => {
            handleChange('giphyUrl', gif.images.original.url);
            handleChange('image', null);
            setShowGiphySearch(false);
          }}
          onClose={() => setShowGiphySearch(false)}
        />
      )}
    </form>
  );
};
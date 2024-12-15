import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DateTimePicker } from "./DateTimePicker";
import { ImageUpload } from "./ImageUpload";
import { GiphySearch } from "./GiphySearch";
import { LocationInput } from "./LocationInput";
import { useState, useRef, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";

interface FormData {
  title: string;
  date: Date | undefined;
  location: string;
  description: string;
  image: File | null;
  giphyUrl: string;
  ticketType: "free" | "paid";
  price: string;
  totalTickets: string;
  organizerName: string;
}

interface EventFormProps {
  form: UseFormReturn<FormData>;
}

export const EventForm = ({ form }: EventFormProps) => {
  const [showGiphySearch, setShowGiphySearch] = useState(false);
  const eventNameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (eventNameInputRef.current) {
      eventNameInputRef.current.focus();
    }
  }, []);

  const { register, watch, setValue } = form;
  const formValues = watch();

  const handleChange = (field: keyof FormData, value: any) => {
    setValue(field, value);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <ImageUpload
            image={formValues.image}
            giphyUrl={formValues.giphyUrl}
            onImageChange={(image) => handleChange('image', image)}
            onGiphyUrlChange={(url) => handleChange('giphyUrl', url)}
            onGiphySearchOpen={() => setShowGiphySearch(true)}
          />
        </div>
        <div className="md:col-span-2 flex flex-col">
          <input 
            type="text"
            ref={eventNameInputRef}
            {...register('title')}
            placeholder="Enter your event name"
            className="w-full text-2xl md:text-4xl font-bold bg-transparent border-b border-input focus:outline-none focus:border-ring pb-2 mb-6 text-foreground placeholder-muted-foreground"
          />
          <Card className="bg-card border-border">
            <CardContent className="p-6 space-y-4">
              <div>
                <Label className="text-foreground">Date and Time</Label>
                <DateTimePicker
                  date={formValues.date}
                  setDate={(date) => handleChange('date', date)}
                />
              </div>

              <LocationInput 
                value={formValues.location}
                onChange={(location) => handleChange('location', location)}
              />

              <div>
                <Label htmlFor="description" className="text-foreground">Description</Label>
                <Textarea 
                  id="description" 
                  {...register('description')}
                  placeholder="Describe your event"
                  rows={3}
                  className="bg-input text-input-foreground placeholder-muted-foreground border-input"
                />
              </div>

              <div>
                <Label className="text-foreground">Ticket Type</Label>
                <Tabs 
                  defaultValue="free" 
                  onValueChange={(value: "free" | "paid") => handleChange('ticketType', value)} 
                  value={formValues.ticketType}
                  className="w-full mt-2"
                >
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
                        type="number"
                        {...register('price')}
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
                  type="number"
                  {...register('totalTickets')}
                  min="1"
                  className="bg-input text-input-foreground placeholder-muted-foreground border-input"
                />
              </div>

              <div>
                <Label htmlFor="organizerName" className="text-foreground">Organizer Name</Label>
                <Input 
                  type="text"
                  {...register('organizerName')}
                  placeholder="Enter organizer name"
                  className="bg-input text-input-foreground placeholder-muted-foreground border-input"
                />
              </div>
            </CardContent>
          </Card>
        </div>
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
    </div>
  );
};
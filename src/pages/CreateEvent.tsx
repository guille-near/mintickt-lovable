import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { EventForm, FormData } from "@/components/create-event/EventForm";
import AuthenticatedLayout from "@/components/AuthenticatedLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthProvider";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  date: z.date({
    required_error: "Date is required",
  }),
  location: z.string().min(1, "Location is required"),
  image: z.instanceof(File).nullable(),
  giphyUrl: z.string().optional(),
  ticketType: z.enum(["free", "paid"]),
  price: z.string().optional(),
  totalTickets: z.string().min(1, "Total tickets is required"),
});

export default function CreateEvent() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ticketType: "free",
      image: null,
      totalTickets: "100",
    },
  });

  const initializeNFTCollection = async (eventId: string) => {
    try {
      const response = await fetch('/functions/v1/initialize-nft-collection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
        body: JSON.stringify({ eventId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to initialize NFT collection');
      }

      const data = await response.json();
      console.log('NFT Collection initialized:', data);
      return data;
    } catch (error) {
      console.error('Error initializing NFT collection:', error);
      throw error;
    }
  };

  const onSubmit = async (formData: FormData) => {
    try {
      setIsSubmitting(true);

      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to create an event",
          variant: "destructive",
        });
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, username')
        .eq('id', user.id)
        .single();

      if (profileError || !profile) {
        console.error('Error getting profile:', profileError);
        toast({
          title: "Error",
          description: "Failed to get user profile",
          variant: "destructive",
        });
        return;
      }

      let imageUrl = formData.giphyUrl;

      if (formData.image) {
        const fileExt = formData.image.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError, data } = await supabase.storage
          .from('event-images')
          .upload(filePath, formData.image);

        if (uploadError) {
          console.error('Error uploading image:', uploadError);
          toast({
            title: "Error",
            description: "Failed to upload image",
            variant: "destructive",
          });
          return;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('event-images')
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      const { data: event, error } = await supabase
        .from('events')
        .insert({
          title: formData.title,
          description: formData.description,
          date: formData.date?.toISOString(),
          location: formData.location,
          image_url: imageUrl,
          price: formData.ticketType === 'free' ? 0 : parseFloat(formData.price || "0"),
          total_tickets: parseInt(formData.totalTickets || "0"),
          remaining_tickets: parseInt(formData.totalTickets || "0"),
          creator_id: profile.id,
          is_free: formData.ticketType === 'free',
          organizer_name: profile.username || 'Anonymous',
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating event:', error);
        toast({
          title: "Error",
          description: "Failed to create event",
          variant: "destructive",
        });
        return;
      }

      // Initialize NFT collection after event creation
      try {
        await initializeNFTCollection(event.id);
        toast({
          title: "Success",
          description: "Event created and NFT collection initialized successfully",
        });
      } catch (nftError) {
        console.error('Error initializing NFT collection:', nftError);
        toast({
          title: "Warning",
          description: "Event created but failed to initialize NFT collection. Please try again later.",
        });
      }

      navigate(`/event/${event.id}`);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthenticatedLayout>
      <div className="container max-w-4xl mx-auto py-6">
        <h1 className="text-4xl font-bold mb-8">Create Event</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <EventForm form={form} />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Event"}
            </Button>
          </form>
        </Form>
      </div>
    </AuthenticatedLayout>
  );
}
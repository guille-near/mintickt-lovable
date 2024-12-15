import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { EventForm } from "@/components/create-event/EventForm";
import AuthenticatedLayout from "@/components/AuthenticatedLayout";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  date: z.date({
    required_error: "Date is required",
  }),
  location: z.string().min(1, "Location is required"),
  image: z.instanceof(File).optional(),
  giphyUrl: z.string().optional(),
  ticketType: z.enum(["free", "paid"]),
  price: z.string().optional(),
  totalTickets: z.string().min(1, "Total tickets is required"),
  organizerName: z.string().min(1, "Organizer name is required"),
});

type FormData = z.infer<typeof formSchema>;

export default function CreateEvent() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ticketType: "free",
      organizerName: "",
    },
  });

  const onSubmit = async (formData: FormData) => {
    try {
      setIsSubmitting(true);

      // Get the current user's profile
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to create an event",
          variant: "destructive",
        });
        return;
      }

      // Get the profile ID for the current user
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('wallet_address', user.id)
        .single();

      if (profileError || !profiles) {
        console.error('Error getting profile:', profileError);
        toast({
          title: "Error",
          description: "Failed to get user profile",
          variant: "destructive",
        });
        return;
      }

      let imageUrl = formData.giphyUrl;

      // If there's a file to upload, handle it first
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

        // Get the public URL for the uploaded image
        const { data: { publicUrl } } = supabase.storage
          .from('event-images')
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      // Create the event with the creator_id set to the profile's ID
      const { data: event, error } = await supabase
        .from('events')
        .insert({
          title: formData.title,
          description: formData.description,
          date: formData.date?.toISOString(),
          location: formData.location,
          image_url: imageUrl,
          price: formData.ticketType === 'free' ? 0 : parseFloat(formData.price || "0"),
          total_tickets: parseInt(formData.totalTickets),
          remaining_tickets: parseInt(formData.totalTickets),
          creator_id: profiles.id,
          is_free: formData.ticketType === 'free',
          organizer_name: formData.organizerName,
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

      toast({
        title: "Success",
        description: "Event created successfully",
      });

      // Navigate to the event details page
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
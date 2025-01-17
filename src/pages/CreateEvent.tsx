import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { EventForm, FormData } from "@/components/create-event/EventForm";
import AuthenticatedLayout from "@/components/AuthenticatedLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthProvider";
import { useWallet } from "@solana/wallet-adapter-react";
import { initializeCandyMachine } from "@/utils/candy-machine";

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
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const wallet = useWallet();

  console.log("🔍 [CreateEvent] Component rendered with user:", user?.id);
  console.log("🔍 [CreateEvent] Wallet connected status:", wallet.connected);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ticketType: "free",
      image: null,
      totalTickets: "100",
    },
  });

  const onSubmit = async (formData: FormData) => {
    try {
      setIsSubmitting(true);
      console.log("🎯 [CreateEvent] Starting form submission with data:", {
        title: formData.title,
        description: formData.description?.substring(0, 50) + "...",
        date: formData.date,
        location: formData.location,
        hasImage: !!formData.image,
        hasGiphyUrl: !!formData.giphyUrl,
        ticketType: formData.ticketType,
        totalTickets: formData.totalTickets,
      });

      if (!user) {
        console.error("❌ [CreateEvent] No user found in context");
        toast.error("You must be logged in to create an event");
        return;
      }

      if (!wallet.connected) {
        console.error("❌ [CreateEvent] Wallet not connected");
        toast.error("Please connect your wallet to create an event");
        return;
      }

      console.log("🎯 [CreateEvent] Getting user profile for ID:", user.id);
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, username')
        .eq('id', user.id)
        .single();

      if (profileError || !profile) {
        console.error('❌ [CreateEvent] Error getting profile:', profileError);
        toast.error("Failed to get user profile");
        return;
      }

      console.log("✅ [CreateEvent] Found profile:", profile);

      let imageUrl = formData.giphyUrl;

      if (formData.image) {
        console.log("🎯 [CreateEvent] Starting image upload");
        const fileExt = formData.image.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        console.log("🎯 [CreateEvent] Uploading image:", {
          fileName,
          fileSize: formData.image.size,
          fileType: formData.image.type
        });

        const { error: uploadError, data } = await supabase.storage
          .from('event-images')
          .upload(filePath, formData.image);

        if (uploadError) {
          console.error('❌ [CreateEvent] Error uploading image:', uploadError);
          toast.error("Failed to upload image");
          return;
        }

        console.log("✅ [CreateEvent] Image uploaded successfully");

        const { data: { publicUrl } } = supabase.storage
          .from('event-images')
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
        console.log("✅ [CreateEvent] Image public URL generated:", imageUrl);
      }

      console.log("🎯 [CreateEvent] Initializing Candy Machine");
      const candyMachine = await initializeCandyMachine(
        wallet,
        formData.title,
        parseInt(formData.totalTickets)
      );

      console.log("✅ [CreateEvent] Candy Machine initialized:", candyMachine);

      console.log("🎯 [CreateEvent] Creating event in database");
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
          creator_id: profile.id,
          is_free: formData.ticketType === 'free',
          organizer_name: profile.username || 'Anonymous',
          candy_machine_address: candyMachine.address,
          candy_machine_config: candyMachine.config,
        })
        .select()
        .single();

      if (error) {
        console.error('❌ [CreateEvent] Error creating event:', error);
        toast.error("Failed to create event");
        return;
      }

      console.log("✅ [CreateEvent] Event created successfully:", event);
      toast.success("Event created successfully");
      navigate(`/event/${event.id}`);
    } catch (error) {
      console.error('❌ [CreateEvent] Unexpected error:', error);
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
      console.log("🏁 [CreateEvent] Form submission completed");
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
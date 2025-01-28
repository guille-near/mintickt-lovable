import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { EventForm, FormData } from "@/components/create-event/EventForm";
import AuthenticatedLayout from "@/components/AuthenticatedLayout";
import { useAuth } from "@/contexts/AuthProvider";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEventCreation } from "@/hooks/useEventCreation";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
  const { user } = useAuth();
  const wallet = useWallet();
  const { createEvent, isCreating } = useEventCreation();

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

    const event = await createEvent(formData, profile.id, profile.username || 'Anonymous');
    if (event) {
      navigate(`/event/${event.id}`);
    }
  };

  return (
    <AuthenticatedLayout>
      <div className="container max-w-4xl mx-auto py-6">
        <h1 className="text-4xl font-bold mb-8">Create Event</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <EventForm form={form} />
            <Button type="submit" className="w-full" disabled={isCreating}>
              {isCreating ? "Creating..." : "Create Event"}
            </Button>
          </form>
        </Form>
      </div>
    </AuthenticatedLayout>
  );
}
import { EventForm } from "@/components/create-event/EventForm";
import { useWallet } from "@solana/wallet-adapter-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import AuthenticatedLayout from "@/components/AuthenticatedLayout";
import { useEffect } from "react";

export default function CreateEvent() {
  const navigate = useNavigate();
  const { publicKey } = useWallet();

  useEffect(() => {
    console.log("CreateEvent component mounted");
    console.log("Wallet public key:", publicKey?.toString());
  }, [publicKey]);

  const handleSubmit = async (formData: any) => {
    console.log("Form submission attempted", formData);
    
    if (!publicKey) {
      toast.error("Please connect your wallet first");
      return;
    }

    try {
      // First, get the profile ID for the connected wallet
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('wallet_address', publicKey.toString())
        .single();

      console.log("Profile fetch result:", { profile, profileError });

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        toast.error('Failed to fetch profile');
        return;
      }

      if (!profile) {
        toast.error('Profile not found');
        return;
      }

      // Create the event with the creator_id set to the profile's ID
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
          creator_id: profile.id,
          is_free: formData.ticketType === 'free'
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating event:', error);
        toast.error('Failed to create event');
        return;
      }

      toast.success("Event created successfully!");
      navigate(`/event/${event.id}`);
    } catch (error) {
      console.error('Error:', error);
      toast.error('An unexpected error occurred');
    }
  };

  return (
    <AuthenticatedLayout>
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <EventForm onSubmit={handleSubmit} />
        </div>
      </main>
    </AuthenticatedLayout>
  );
}

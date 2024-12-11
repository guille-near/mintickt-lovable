import { WalletButton } from "@/components/WalletButton";
import { EventForm } from "@/components/create-event/EventForm";
import { useWallet } from "@solana/wallet-adapter-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Header } from "@/components/Header";

export default function CreateEvent() {
  const navigate = useNavigate();
  const { publicKey } = useWallet();

  const handleSubmit = async (formData: any) => {
    if (!publicKey) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!formData.name || !formData.date || !formData.location) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      // First, ensure we have a profile for this wallet
      const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('wallet_address', publicKey.toString())
        .single();

      if (profileError) {
        // If no profile exists, create one
        const { data: newProfile, error: createProfileError } = await supabase
          .from('profiles')
          .insert({ wallet_address: publicKey.toString() })
          .select('id')
          .single();

        if (createProfileError) throw createProfileError;
        
        // Use the newly created profile's ID
        formData.creator_id = newProfile.id;
      } else {
        // Use the existing profile's ID
        formData.creator_id = existingProfile.id;
      }

      // Create the event with the creator_id
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
          creator_id: formData.creator_id,
          is_free: formData.ticketType === 'free'
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Event created successfully!");
      navigate(`/event/${event.id}`);
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error("Failed to create event");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <EventForm onSubmit={handleSubmit} />
        </div>
      </main>
    </div>
  );
}
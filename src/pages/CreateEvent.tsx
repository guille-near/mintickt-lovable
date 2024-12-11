import { WalletButton } from "@/components/WalletButton";
import { EventForm } from "@/components/create-event/EventForm";
import { useWallet } from "@solana/wallet-adapter-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
      // Get the creator's profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('wallet_address', publicKey.toString())
        .single();

      if (!profile) {
        toast.error("Profile not found");
        return;
      }

      // Create the event
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
          creator_id: profile.id
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
    <div className="min-h-screen bg-gradient-to-br from-secondary to-primary">
      <header className="container mx-auto flex items-center justify-between p-6">
        <h1 className="text-2xl font-bold text-white">Create Event</h1>
        <WalletButton />
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <EventForm onSubmit={handleSubmit} />
        </div>
      </main>
    </div>
  );
}
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useEventImage } from './useEventImage';
import { useNFTCollection } from './useNFTCollection';
import { FormData } from '@/components/create-event/EventForm';
import { toast } from "sonner";

export const useEventCreation = () => {
  const [isCreating, setIsCreating] = useState(false);
  const { uploadEventImage, isUploading } = useEventImage();
  const { initializeNFTCollection } = useNFTCollection();

  const createEvent = async (formData: FormData, userId: string, username: string) => {
    try {
      setIsCreating(true);
      console.log("🎯 [useEventCreation] Starting event creation with data:", {
        title: formData.title,
        description: formData.description?.substring(0, 50) + "...",
        date: formData.date,
        location: formData.location,
        hasImage: !!formData.image,
        hasGiphyUrl: !!formData.giphyUrl,
        ticketType: formData.ticketType,
        totalTickets: formData.totalTickets,
      });

      const imageUrl = await uploadEventImage(formData.image, formData.giphyUrl);
      if (!imageUrl && (formData.image || formData.giphyUrl)) {
        return null;
      }

      // Set price to 0 for free events, otherwise use the provided price
      const price = formData.ticketType === 'free' ? 0 : parseFloat(formData.price || '0');
      console.log("💰 [useEventCreation] Event price:", price);

      const nftCollectionData = {
        eventId: 'temp-id',
        name: formData.title!,
        symbol: 'TCKT',
        description: formData.description || '',
        imageUrl: imageUrl || '',
        totalSupply: parseInt(formData.totalTickets!),
        price: price,
        sellerFeeBasisPoints: 500,
      };

      const nftData = await initializeNFTCollection(nftCollectionData);
      if (!nftData) {
        return null;
      }

      console.log("🎯 [useEventCreation] Creating event in database");
      const { data: event, error } = await supabase
        .from('events')
        .insert({
          title: formData.title,
          description: formData.description,
          date: formData.date?.toISOString(),
          location: formData.location,
          image_url: imageUrl,
          price: price,
          total_tickets: parseInt(formData.totalTickets!),
          remaining_tickets: parseInt(formData.totalTickets!),
          creator_id: userId,
          is_free: formData.ticketType === 'free',
          organizer_name: username || 'Anonymous',
          candy_machine_address: nftData.candyMachineAddress,
          candy_machine_config: nftData.config || {},
        })
        .select()
        .single();

      if (error) {
        console.error('❌ [useEventCreation] Error creating event:', error);
        toast.error("Failed to create event");
        return null;
      }

      console.log("✅ [useEventCreation] Event created successfully:", event);
      toast.success("Event created successfully");
      return event;
    } catch (error) {
      console.error('❌ [useEventCreation] Error:', error);
      toast.error("Something went wrong");
      return null;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createEvent,
    isCreating: isCreating || isUploading
  };
};
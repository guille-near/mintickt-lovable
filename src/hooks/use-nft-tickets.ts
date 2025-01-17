import { useWallet } from "@solana/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";
import { EventTicketsClient } from "@/utils/anchor-client";
import { useConnection } from "@solana/wallet-adapter-react";
import { AnchorProvider } from "@project-serum/anchor";
import { toast } from "sonner";
import { PublicKey } from "@solana/web3.js";
import { supabase } from "@/integrations/supabase/client";

export const useNFTTickets = (eventId: string) => {
  const { connection } = useConnection();
  const wallet = useWallet();

  const provider = new AnchorProvider(
    connection,
    wallet as any,
    AnchorProvider.defaultOptions()
  );

  const client = new EventTicketsClient(provider);

  const { data: tickets, isLoading, refetch } = useQuery({
    queryKey: ['nft-tickets', eventId, wallet.publicKey?.toString()],
    queryFn: async () => {
      if (!wallet.publicKey) {
        return [];
      }

      try {
        const { data: tickets, error } = await supabase
          .from('tickets')
          .select('*')
          .eq('event_id', eventId)
          .eq('owner_id', wallet.publicKey.toString());

        if (error) {
          console.error('Error fetching tickets:', error);
          throw error;
        }

        return tickets || [];
      } catch (error) {
        console.error('Error fetching NFT tickets:', error);
        toast.error('Failed to load tickets');
        return [];
      }
    },
    enabled: !!wallet.publicKey && !!eventId,
  });

  const purchaseTicket = async (price: number) => {
    if (!wallet.publicKey) {
      toast.error('Please connect your wallet first');
      return;
    }

    const toastId = toast.loading('Processing your ticket purchase...');

    try {
      console.log('Starting ticket purchase process for event:', eventId);
      
      // Get the event PDA
      const [eventPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("event"), wallet.publicKey.toBuffer()],
        client.program.programId
      );

      console.log('Event PDA:', eventPda.toString());

      // Get the next ticket number
      const eventAccount = await client.program.account.eventCollection.fetch(eventPda);
      const ticketNumber = eventAccount.ticketsMinted.toNumber() + 1;

      console.log('Minting ticket number:', ticketNumber);

      // Mint the ticket NFT
      const tx = await client.mintTicket(
        eventPda,
        wallet.publicKey,
        ticketNumber
      );

      console.log('Ticket minted successfully, transaction:', tx);

      // Record the ticket in the database
      const { error: dbError } = await supabase
        .from('tickets')
        .insert({
          event_id: eventId,
          owner_id: wallet.publicKey.toString(),
          mint_address: tx, // Using transaction signature as mint address for now
        });

      if (dbError) {
        console.error('Error recording ticket in database:', dbError);
        throw new Error('Failed to record ticket purchase');
      }

      // Refresh the tickets list
      await refetch();

      toast.success('Ticket purchased successfully!', {
        id: toastId,
      });

      return tx;
    } catch (error) {
      console.error('Error purchasing ticket:', error);
      toast.error('Failed to purchase ticket', {
        id: toastId,
      });
      throw error;
    }
  };

  return {
    tickets,
    isLoading,
    purchaseTicket
  };
};
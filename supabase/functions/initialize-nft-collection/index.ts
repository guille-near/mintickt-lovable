import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import * as anchor from "https://esm.sh/@project-serum/anchor@0.26.0"
import { Connection, Keypair, PublicKey, clusterApiUrl } from "https://esm.sh/@solana/web3.js@1.95.8"
import { EventTickets } from "../../../src/programs/event-tickets/types"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { eventId } = await req.json()

    if (!eventId) {
      return new Response(
        JSON.stringify({ error: 'Event ID is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    console.log('Initializing NFT collection for event:', eventId)

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Fetch event details
    const { data: event, error: eventError } = await supabaseClient
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single()

    if (eventError || !event) {
      console.error('Error fetching event:', eventError)
      return new Response(
        JSON.stringify({ error: 'Event not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      )
    }

    // Initialize Solana connection (using devnet for development)
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed')

    // Create a new keypair for the collection
    const collectionKeypair = Keypair.generate()
    console.log('Generated collection keypair:', collectionKeypair.publicKey.toString())

    // Initialize Anchor provider
    const wallet = new anchor.Wallet(collectionKeypair)
    const provider = new anchor.AnchorProvider(
      connection,
      wallet,
      { commitment: 'confirmed' }
    )

    // Initialize the program
    const programId = new PublicKey(Deno.env.get('PROGRAM_ID') ?? '')
    const program = new anchor.Program(EventTickets.IDL, programId, provider)

    // Generate PDA for the event
    const [eventPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("event"), collectionKeypair.publicKey.toBuffer()],
      programId
    )

    console.log('Initializing event collection on-chain...')

    // Initialize the event collection on-chain
    const tx = await program.methods
      .initializeEventCollection(
        event.title,
        event.nft_symbol || 'TCKT',
        `https://arweave.net/${eventId}` // Placeholder URI, should be replaced with actual metadata URI
      )
      .accounts({
        authority: collectionKeypair.publicKey,
        event: eventPda,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([collectionKeypair])
      .rpc()

    console.log('Transaction signature:', tx)

    // Update the event with the collection address and metadata
    const { error: updateError } = await supabaseClient
      .from('events')
      .update({
        nft_collection_name: event.title,
        nft_metadata_uri: `https://arweave.net/${eventId}`, // Placeholder URI
        nft_symbol: event.nft_symbol || 'TCKT',
      })
      .eq('id', eventId)

    if (updateError) {
      console.error('Error updating event:', updateError)
      return new Response(
        JSON.stringify({ error: 'Failed to update event with collection details' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    return new Response(
      JSON.stringify({
        message: 'NFT collection initialized successfully',
        collectionAddress: collectionKeypair.publicKey.toString(),
        transactionSignature: tx
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error) {
    console.error('Error initializing NFT collection:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to initialize NFT collection', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
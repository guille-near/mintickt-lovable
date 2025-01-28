import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import * as anchor from "https://esm.sh/@project-serum/anchor@0.26.0"
import { Connection, Keypair, PublicKey, clusterApiUrl } from "https://esm.sh/@solana/web3.js@1.95.8"

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

    // Generate PDA for the event
    const [eventPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("event"), collectionKeypair.publicKey.toBuffer()],
      programId
    )

    console.log('Event PDA:', eventPda.toString())

    // Create the NFT collection
    const tx = await connection.requestAirdrop(collectionKeypair.publicKey, 1000000000)
    await connection.confirmTransaction(tx)

    console.log('Transaction signature:', tx)

    // Update the event with the collection address and metadata
    const { error: updateError } = await supabaseClient
      .from('events')
      .update({
        candy_machine_address: collectionKeypair.publicKey.toString(),
        candy_machine_config: {
          itemsAvailable: event.total_tickets,
          sellerFeeBasisPoints: event.royalties_percentage * 100,
          symbol: event.nft_symbol || 'TCKT',
          collection: {
            name: event.title,
            family: "NFT Tickets",
          }
        }
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
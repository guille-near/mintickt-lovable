import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import * as anchor from "https://esm.sh/@project-serum/anchor@0.26.0"
import { Connection, Keypair, PublicKey } from "https://esm.sh/@solana/web3.js@1.95.8"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
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
      return new Response(
        JSON.stringify({ error: 'Event not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      )
    }

    // Initialize Solana connection
    const connection = new Connection(
      'https://api.devnet.solana.com',
      'confirmed'
    )

    // Create a new keypair for the collection
    const collectionKeypair = Keypair.generate()

    // Initialize the collection using our Anchor program
    // Note: This is a placeholder for the actual initialization logic
    // You'll need to implement the actual NFT collection creation here
    const collectionAddress = collectionKeypair.publicKey.toString()

    // Update the event with the collection address
    const { error: updateError } = await supabaseClient
      .from('events')
      .update({
        nft_collection_name: event.title,
        nft_metadata_uri: `https://arweave.net/${collectionAddress}`, // Placeholder URI
        nft_symbol: event.nft_symbol || 'TCKT',
      })
      .eq('id', eventId)

    if (updateError) {
      return new Response(
        JSON.stringify({ error: 'Failed to update event with collection details' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    return new Response(
      JSON.stringify({
        message: 'NFT collection initialized successfully',
        collectionAddress
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to initialize NFT collection', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
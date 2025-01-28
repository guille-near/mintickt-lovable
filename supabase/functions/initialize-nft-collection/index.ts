import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { Connection, Keypair, PublicKey, clusterApiUrl } from "https://esm.sh/@solana/web3.js@1.95.8"
import { Metaplex } from "https://esm.sh/@metaplex-foundation/js@0.19.4"

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

    console.log('Initializing NFT collection for event:', eventId)

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

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

    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed')
    const collectionKeypair = Keypair.generate()
    
    console.log('Generated collection keypair:', collectionKeypair.publicKey.toString())

    // Request airdrop for the collection keypair
    const airdropTx = await connection.requestAirdrop(collectionKeypair.publicKey, 2 * 1_000_000_000) // 2 SOL
    await connection.confirmTransaction(airdropTx)
    console.log('Airdrop confirmed:', airdropTx)

    // Initialize Metaplex
    const metaplex = new Metaplex(connection)
    metaplex.use({
      keypair: collectionKeypair,
    })

    console.log('Creating NFT collection...')
    const { nft: collectionNft } = await metaplex.nfts().create({
      name: event.title,
      symbol: event.nft_symbol || 'TCKT',
      uri: event.image_url || '',
      sellerFeeBasisPoints: (event.royalties_percentage || 5) * 100,
      isCollection: true,
      updateAuthority: collectionKeypair,
    })

    console.log('Collection NFT created:', collectionNft.address.toString())

    const { error: updateError } = await supabaseClient
      .from('events')
      .update({
        candy_machine_address: collectionKeypair.publicKey.toString(),
        candy_machine_config: {
          itemsAvailable: event.total_tickets,
          sellerFeeBasisPoints: (event.royalties_percentage || 5) * 100,
          symbol: event.nft_symbol || 'TCKT',
          collection: {
            address: collectionNft.address.toString(),
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
        collectionAddress: collectionNft.address.toString(),
        candyMachineAddress: collectionKeypair.publicKey.toString(),
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
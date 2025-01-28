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

    const connection = new Connection(clusterApiUrl('devnet'))
    const metaplex = new Metaplex(connection)
    
    // Generate a new keypair for the collection
    const collectionAuthority = Keypair.generate()
    console.log('Generated collection authority:', collectionAuthority.publicKey.toString())

    // Request airdrop for the collection authority
    const airdropSignature = await connection.requestAirdrop(
      collectionAuthority.publicKey,
      2 * 1_000_000_000 // 2 SOL
    )
    await connection.confirmTransaction(airdropSignature)
    console.log('Airdrop confirmed:', airdropSignature)

    // Create the NFT collection
    const { nft: collectionNft } = await metaplex
      .nfts()
      .create({
        name: event.title,
        symbol: event.nft_symbol || 'TCKT',
        uri: event.image_url || '',
        sellerFeeBasisPoints: (event.royalties_percentage || 5) * 100,
        isCollection: true,
        updateAuthority: collectionAuthority,
      })

    console.log('Collection NFT created:', collectionNft.address.toString())

    // Update event with collection details
    const { error: updateError } = await supabaseClient
      .from('events')
      .update({
        nft_collection_name: event.title,
        nft_metadata_uri: event.image_url,
        candy_machine_address: collectionNft.address.toString(),
        candy_machine_config: {
          collection: {
            address: collectionNft.address.toString(),
            updateAuthority: collectionAuthority.publicKey.toString()
          }
        }
      })
      .eq('id', eventId)

    if (updateError) {
      console.error('Error updating event:', updateError)
      throw updateError
    }

    return new Response(
      JSON.stringify({
        message: 'NFT collection initialized successfully',
        collectionAddress: collectionNft.address.toString(),
        collectionAuthority: collectionAuthority.publicKey.toString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error initializing NFT collection:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to initialize NFT collection' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
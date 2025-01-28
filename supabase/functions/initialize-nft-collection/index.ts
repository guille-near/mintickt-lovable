import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { 
  Metaplex, 
  keypairIdentity, 
  bundlrStorage,
  toMetaplexFile,
  CandyMachineItem,
} from 'https://esm.sh/@metaplex-foundation/js@0.19.4'
import { Connection, Keypair, clusterApiUrl } from 'https://esm.sh/@solana/web3.js@1.87.6'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CreateCollectionInput {
  eventId: string;
  name: string;
  symbol: string;
  description: string;
  imageUrl: string;
  totalSupply: number;
  price: number;
  sellerFeeBasisPoints: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { eventId, name, symbol, description, imageUrl, totalSupply, price, sellerFeeBasisPoints } = await req.json() as CreateCollectionInput

    // Validate input
    if (!eventId || !name || !symbol || !description || !imageUrl || !totalSupply || price === undefined) {
      throw new Error('Missing required fields')
    }

    // Initialize Solana connection
    const connection = new Connection(clusterApiUrl('devnet'))
    
    // Create keypair from environment variable
    const privateKey = Deno.env.get('CANDY_MACHINE_PRIVATE_KEY')
    if (!privateKey) {
      throw new Error('Missing CANDY_MACHINE_PRIVATE_KEY environment variable')
    }

    const keypairArray = new Uint8Array(JSON.parse(privateKey))
    const keypair = Keypair.fromSecretKey(keypairArray)

    // Initialize Metaplex
    const metaplex = Metaplex.make(connection)
      .use(keypairIdentity(keypair))
      .use(bundlrStorage({
        address: 'https://devnet.bundlr.network',
        providerUrl: clusterApiUrl('devnet'),
        timeout: 60000,
      }))

    console.log('🎯 Creating Candy Machine...')

    // Create Candy Machine
    const { candyMachine } = await metaplex.candyMachines().create({
      itemsAvailable: totalSupply,
      sellerFeeBasisPoints: sellerFeeBasisPoints,
      collection: {
        name: name,
        family: symbol,
      },
      items: Array(totalSupply).fill({
        name: `${name} #$ID+1$`,
        uri: imageUrl,
      }) as CandyMachineItem[],
      guards: {
        solPayment: {
          amount: { basisPoints: price * 1_000_000_000, currency: { symbol: 'SOL', decimals: 9 } },
          destination: keypair.publicKey,
        },
      },
    })

    console.log('✅ Candy Machine created:', candyMachine.address.toString())

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Update event with Candy Machine details
    const { error: updateError } = await supabaseClient
      .from('events')
      .update({
        candy_machine_address: candyMachine.address.toString(),
        candy_machine_config: {
          price: price,
          totalSupply: totalSupply,
          itemsRedeemed: 0,
          isActive: true,
        },
        nft_collection_name: name,
        nft_symbol: symbol,
        nft_description: description,
        nft_metadata_uri: imageUrl,
      })
      .eq('id', eventId)

    if (updateError) {
      console.error('❌ Error updating event:', updateError)
      throw updateError
    }

    return new Response(
      JSON.stringify({
        candyMachineAddress: candyMachine.address.toString(),
        message: 'Candy Machine created successfully',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('❌ Error:', error)
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
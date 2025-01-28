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
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('🎯 [NewEvent-Nft-Collection] Starting function');
    
    const input = await req.json() as CreateCollectionInput;
    console.log('📝 [NewEvent-Nft-Collection] Input:', input);

    // Validate input
    if (!input.name || !input.symbol || !input.totalSupply || input.price === undefined) {
      throw new Error('Missing required fields')
    }

    // Initialize Solana connection
    console.log('🔗 [NewEvent-Nft-Collection] Connecting to Solana devnet');
    const connection = new Connection(clusterApiUrl('devnet'))
    
    // Create keypair from environment variable
    const privateKey = Deno.env.get('CANDY_MACHINE_PRIVATE_KEY')
    if (!privateKey) {
      console.error('❌ [NewEvent-Nft-Collection] Missing CANDY_MACHINE_PRIVATE_KEY');
      throw new Error('Missing CANDY_MACHINE_PRIVATE_KEY environment variable')
    }

    const keypairArray = new Uint8Array(JSON.parse(privateKey))
    const keypair = Keypair.fromSecretKey(keypairArray)

    console.log('🔑 [NewEvent-Nft-Collection] Keypair created');

    // Initialize Metaplex
    const metaplex = Metaplex.make(connection)
      .use(keypairIdentity(keypair))
      .use(bundlrStorage({
        address: 'https://devnet.bundlr.network',
        providerUrl: clusterApiUrl('devnet'),
        timeout: 60000,
      }))

    console.log('🎨 [NewEvent-Nft-Collection] Metaplex initialized');
    console.log('🎯 [NewEvent-Nft-Collection] Creating Candy Machine...');

    // Create Candy Machine
    const { candyMachine } = await metaplex.candyMachines().create({
      itemsAvailable: input.totalSupply,
      sellerFeeBasisPoints: input.sellerFeeBasisPoints,
      collection: {
        name: input.name,
        family: input.symbol,
      },
      items: Array(input.totalSupply).fill({
        name: `${input.name} #$ID+1$`,
        uri: input.imageUrl,
      }) as CandyMachineItem[],
      guards: input.price > 0 ? {
        solPayment: {
          amount: { basisPoints: input.price * 1_000_000_000, currency: { symbol: 'SOL', decimals: 9 } },
          destination: keypair.publicKey,
        },
      } : undefined,
    })

    console.log('✅ [NewEvent-Nft-Collection] Candy Machine created:', candyMachine.address.toString());

    return new Response(
      JSON.stringify({
        candyMachineAddress: candyMachine.address.toString(),
        config: {
          price: input.price,
          totalSupply: input.totalSupply,
          itemsRedeemed: 0,
          isActive: true,
          collection: {
            name: input.name,
            family: input.symbol,
            description: input.description,
            image: input.imageUrl
          },
        },
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('❌ [NewEvent-Nft-Collection] Error:', error);
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
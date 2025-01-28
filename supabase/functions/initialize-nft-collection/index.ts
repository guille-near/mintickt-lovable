import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Metaplex } from "https://esm.sh/@metaplex-foundation/js@0.19.4"
import { Connection, Keypair, clusterApiUrl } from "https://esm.sh/@solana/web3.js@1.87.6"

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
    const connection = new Connection(clusterApiUrl('devnet'));

    // Create keypair from environment variable
    const privateKey = Deno.env.get('CANDY_MACHINE_PRIVATE_KEY');
    if (!privateKey) {
      console.error('❌ [NewEvent-Nft-Collection] Missing CANDY_MACHINE_PRIVATE_KEY');
      throw new Error('Missing CANDY_MACHINE_PRIVATE_KEY environment variable');
    }

    const keypairArray = new Uint8Array(JSON.parse(privateKey));
    const keypair = Keypair.fromSecretKey(keypairArray);
    console.log('🔑 [NewEvent-Nft-Collection] Keypair created');

    // Initialize Metaplex
    const metaplex = Metaplex.make(connection)
      .use(keypairIdentity(keypair));

    console.log('🎨 [NewEvent-Nft-Collection] Metaplex initialized');

    // Create basic NFT collection
    const { nft } = await metaplex.nfts().create({
      name: input.name,
      symbol: input.symbol,
      sellerFeeBasisPoints: input.sellerFeeBasisPoints,
      uri: input.imageUrl,
      maxSupply: input.totalSupply,
    });

    console.log('✅ [NewEvent-Nft-Collection] Collection created:', nft.address.toString());

    return new Response(
      JSON.stringify({
        collectionAddress: nft.address.toString(),
        config: {
          price: input.price,
          totalSupply: input.totalSupply,
          itemsRedeemed: 0,
          isActive: true,
          collection: {
            name: input.name,
            symbol: input.symbol,
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
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
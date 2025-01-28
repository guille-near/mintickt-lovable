import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
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
  console.log('🚀 [initialize-nft-collection] Function started');
  console.log('📨 [initialize-nft-collection] Request method:', req.method);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('✨ [initialize-nft-collection] Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('🎯 [initialize-nft-collection] Parsing request body');
    const input = await req.json() as CreateCollectionInput;
    console.log('📝 [initialize-nft-collection] Input received:', {
      eventId: input.eventId,
      name: input.name,
      symbol: input.symbol,
      totalSupply: input.totalSupply,
      price: input.price
    });

    // Validate input
    if (!input.name || !input.symbol || !input.totalSupply || input.price === undefined) {
      console.error('❌ [initialize-nft-collection] Validation failed: Missing required fields');
      throw new Error('Missing required fields: name, symbol, totalSupply, or price');
    }

    // Initialize Solana connection
    console.log('🔗 [initialize-nft-collection] Connecting to Solana devnet');
    const connection = new Connection(clusterApiUrl('devnet'));
    console.log('✅ [initialize-nft-collection] Connected to Solana devnet');

    // Get private key from environment
    console.log('🔑 [initialize-nft-collection] Retrieving private key from environment');
    const privateKey = Deno.env.get('CANDY_MACHINE_PRIVATE_KEY');
    if (!privateKey) {
      console.error('❌ [initialize-nft-collection] Missing CANDY_MACHINE_PRIVATE_KEY environment variable');
      throw new Error('Missing CANDY_MACHINE_PRIVATE_KEY environment variable');
    }

    // Create keypair
    console.log('🔐 [initialize-nft-collection] Creating keypair from private key');
    const keypairArray = new Uint8Array(JSON.parse(privateKey));
    const keypair = Keypair.fromSecretKey(keypairArray);
    console.log('✅ [initialize-nft-collection] Keypair created successfully');
    console.log('📍 [initialize-nft-collection] Public key:', keypair.publicKey.toString());

    // For now, return a mock response while we implement the full NFT collection creation
    console.log('📤 [initialize-nft-collection] Preparing response');
    const response = {
      candyMachineAddress: keypair.publicKey.toString(),
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
    };
    
    console.log('✅ [initialize-nft-collection] Function completed successfully');
    return new Response(
      JSON.stringify(response),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('❌ [initialize-nft-collection] Error occurred:', error);
    console.error('❌ [initialize-nft-collection] Error stack:', error.stack);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        stack: error.stack 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
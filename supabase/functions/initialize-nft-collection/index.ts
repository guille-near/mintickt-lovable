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
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('✨ [initialize-nft-collection] Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Log request details
    console.log('📨 [initialize-nft-collection] Request method:', req.method);
    console.log('📨 [initialize-nft-collection] Content-Type:', req.headers.get('content-type'));

    // Get the request body
    const bodyText = await req.text();
    console.log('📝 [initialize-nft-collection] Raw request body:', bodyText);

    // Parse JSON with error handling
    let input: CreateCollectionInput;
    try {
      input = JSON.parse(bodyText);
    } catch (parseError) {
      console.error('❌ [initialize-nft-collection] JSON parse error:', parseError);
      return new Response(
        JSON.stringify({
          error: 'Invalid JSON in request body',
          details: parseError.message,
          receivedBody: bodyText
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Validate input
    if (!input.name || !input.symbol || !input.totalSupply || input.price === undefined) {
      console.error('❌ [initialize-nft-collection] Validation failed: Missing required fields');
      return new Response(
        JSON.stringify({
          error: 'Missing required fields',
          receivedInput: input
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('✅ [initialize-nft-collection] Input validation passed:', {
      name: input.name,
      symbol: input.symbol,
      totalSupply: input.totalSupply,
      price: input.price
    });

    // Initialize Solana connection
    console.log('🔗 [initialize-nft-collection] Connecting to Solana devnet');
    const connection = new Connection(clusterApiUrl('devnet'));
    console.log('✅ [initialize-nft-collection] Connected to Solana devnet');

    // Get private key from environment
    const privateKey = Deno.env.get('CANDY_MACHINE_PRIVATE_KEY');
    if (!privateKey) {
      console.error('❌ [initialize-nft-collection] Missing CANDY_MACHINE_PRIVATE_KEY environment variable');
      return new Response(
        JSON.stringify({ error: 'Server configuration error: Missing private key' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Create keypair
    const keypairArray = new Uint8Array(JSON.parse(privateKey));
    const keypair = Keypair.fromSecretKey(keypairArray);
    console.log('✅ [initialize-nft-collection] Keypair created successfully');
    console.log('📍 [initialize-nft-collection] Public key:', keypair.publicKey.toString());

    // For now, return a mock response
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
    );

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
    );
  }
})
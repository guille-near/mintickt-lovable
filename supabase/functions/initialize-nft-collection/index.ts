import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { 
  Connection, 
  Keypair, 
  clusterApiUrl, 
  PublicKey,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction
} from "https://esm.sh/@solana/web3.js@1.87.6"

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
  console.log('📝 [initialize-nft-collection] Request method:', req.method);
  
  if (req.method === 'OPTIONS') {
    console.log('✨ [initialize-nft-collection] Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get and validate request body
    const rawBody = await req.text();
    console.log('📝 [initialize-nft-collection] Raw request body:', rawBody);
    
    if (!rawBody) {
      throw new Error('Request body is empty');
    }

    // Clean and parse the JSON input
    let input: CreateCollectionInput;
    try {
      const cleanBody = rawBody.replace(/^\s+|\s+$/g, ''); // Remove leading/trailing whitespace
      console.log('🔍 [initialize-nft-collection] Cleaned body:', cleanBody);
      
      input = JSON.parse(cleanBody);
      
      // Validate the parsed input
      if (typeof input !== 'object' || input === null) {
        throw new Error('Invalid input format: expected an object');
      }

      // Log the parsed input for debugging
      console.log('✅ [initialize-nft-collection] Parsed input:', {
        eventId: input.eventId,
        name: input.name,
        symbol: input.symbol,
        totalSupply: input.totalSupply,
        price: input.price
      });
    } catch (parseError) {
      console.error('❌ [initialize-nft-collection] JSON parse error:', parseError);
      return new Response(
        JSON.stringify({
          error: 'Invalid JSON in request body',
          details: parseError.message,
          receivedBody: rawBody
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Validate required fields
    const requiredFields = ['name', 'symbol', 'totalSupply'] as const;
    const missingFields = requiredFields.filter(field => !input[field]);
    
    if (missingFields.length > 0) {
      console.error('❌ [initialize-nft-collection] Missing required fields:', missingFields);
      return new Response(
        JSON.stringify({
          error: 'Missing required fields',
          missingFields,
          receivedInput: input
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Ensure price is a number
    input.price = typeof input.price === 'number' ? input.price : 0;
    console.log('💰 [initialize-nft-collection] Validated price:', input.price);

    // Initialize Solana connection
    console.log('🔗 [initialize-nft-collection] Connecting to Solana devnet');
    const connection = new Connection(clusterApiUrl('devnet'));
    
    // Get private key from environment
    const privateKeyString = Deno.env.get('CANDY_MACHINE_PRIVATE_KEY');
    if (!privateKeyString) {
      throw new Error('Missing CANDY_MACHINE_PRIVATE_KEY environment variable');
    }

    // Create keypair from private key
    const privateKeyUint8 = new Uint8Array(JSON.parse(privateKeyString));
    const keypair = Keypair.fromSecretKey(privateKeyUint8);
    console.log('✅ [initialize-nft-collection] Keypair created:', keypair.publicKey.toString());

    // Create a new mint account
    const mintKeypair = Keypair.generate();
    console.log('✅ [initialize-nft-collection] Mint keypair created:', mintKeypair.publicKey.toString());

    // Calculate the rent-exempt minimum balance
    const rentExemptBalance = await connection.getMinimumBalanceForRentExemption(0);

    // Create transaction to create mint account
    const createMintAccountTx = new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: keypair.publicKey,
        newAccountPubkey: mintKeypair.publicKey,
        space: 82,
        lamports: rentExemptBalance,
        programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
      })
    );

    try {
      // Send and confirm transaction
      const signature = await sendAndConfirmTransaction(
        connection,
        createMintAccountTx,
        [keypair, mintKeypair]
      );
      console.log('✅ [initialize-nft-collection] Mint account created. Signature:', signature);

      // Prepare response
      const response = {
        success: true,
        candyMachineAddress: mintKeypair.publicKey.toString(),
        signature,
        config: {
          price: input.price,
          totalSupply: input.totalSupply,
          itemsRedeemed: 0,
          isActive: true,
          collection: {
            name: input.name,
            symbol: input.symbol,
            description: input.description || '',
            image: input.imageUrl || '',
          },
        },
      };

      return new Response(
        JSON.stringify(response),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      );

    } catch (txError) {
      console.error('❌ [initialize-nft-collection] Transaction error:', txError);
      return new Response(
        JSON.stringify({
          error: 'Transaction failed',
          details: txError.message,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

  } catch (error) {
    console.error('❌ [initialize-nft-collection] Error occurred:', error);
    return new Response(
      JSON.stringify({
        error: error.message,
        stack: error.stack,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
})
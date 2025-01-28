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
  
  if (req.method === 'OPTIONS') {
    console.log('✨ [initialize-nft-collection] Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const rawBody = await req.text();
    console.log('📝 [initialize-nft-collection] Raw request body:', rawBody);

    let input: CreateCollectionInput;
    try {
      input = JSON.parse(rawBody);
      console.log('✅ [initialize-nft-collection] Successfully parsed JSON:', input);
    } catch (parseError) {
      console.error('❌ [initialize-nft-collection] JSON parse error:', parseError);
      return new Response(
        JSON.stringify({
          error: 'Invalid JSON in request body',
          details: parseError.message,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const requiredFields = ['name', 'symbol', 'totalSupply', 'price'];
    const missingFields = requiredFields.filter(field => !input[field]);
    
    if (missingFields.length > 0) {
      console.error('❌ [initialize-nft-collection] Missing required fields:', missingFields);
      return new Response(
        JSON.stringify({
          error: 'Missing required fields',
          missingFields,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

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
        programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'), // Token Program ID
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

      // Prepare response with necessary information for frontend
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
      throw new Error(`Failed to create mint account: ${txError.message}`);
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
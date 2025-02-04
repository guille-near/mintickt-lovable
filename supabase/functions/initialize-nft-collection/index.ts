
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

// Custom JSON serializer to handle bigint
const customJSONStringify = (obj: any): string => {
  return JSON.stringify(obj, (_, value) =>
    typeof value === 'bigint'
      ? value.toString()
      : value
  );
};

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
    console.log('✨ [initialize-nft-collection] Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get private key from environment and validate it
    const privateKeyString = Deno.env.get('CANDY_MACHINE_PRIVATE_KEY');
    if (!privateKeyString) {
      console.error('❌ [initialize-nft-collection] Missing CANDY_MACHINE_PRIVATE_KEY');
      return new Response(
        customJSONStringify({ 
          error: 'Missing CANDY_MACHINE_PRIVATE_KEY environment variable. Please set it in Supabase Edge Function secrets.' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('🔍 [initialize-nft-collection] Private key type:', typeof privateKeyString);
    console.log('🔑 [initialize-nft-collection] Private key string (first 20 chars):', privateKeyString.substring(0, 20) + '...');
    console.log('📏 [initialize-nft-collection] Private key length:', privateKeyString.length);

    // Test private key parsing
    let privateKeyUint8: Uint8Array;
    try {
      // First, try to parse the string as JSON
      const parsedJson = JSON.parse(privateKeyString);
      console.log('✅ [initialize-nft-collection] Successfully parsed JSON. Type:', Array.isArray(parsedJson) ? 'array' : typeof parsedJson);
      
      // Convert to Uint8Array
      privateKeyUint8 = new Uint8Array(parsedJson);
      console.log('✅ [initialize-nft-collection] Successfully created Uint8Array of length:', privateKeyUint8.length);
    } catch (parseError) {
      console.error('❌ [initialize-nft-collection] Parse error details:', parseError);
      console.error('❌ [initialize-nft-collection] Invalid private key format. Expected a JSON array of numbers.');
      return new Response(
        customJSONStringify({
          error: 'Invalid private key format. Please ensure CANDY_MACHINE_PRIVATE_KEY is set to a JSON array of numbers in Supabase Edge Function secrets.',
          details: parseError.message
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Test keypair creation
    let keypair: Keypair;
    try {
      keypair = Keypair.fromSecretKey(privateKeyUint8);
      console.log('✅ [initialize-nft-collection] Successfully created keypair. Public key:', keypair.publicKey.toString());
    } catch (keypairError) {
      console.error('❌ [initialize-nft-collection] Failed to create keypair:', keypairError);
      return new Response(
        customJSONStringify({
          error: 'Invalid keypair. Please check the CANDY_MACHINE_PRIVATE_KEY format.',
          details: keypairError.message
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Test connection and balance
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    const balance = await connection.getBalance(keypair.publicKey);
    console.log('💰 [initialize-nft-collection] Keypair balance:', balance / 1e9, 'SOL');
    
    if (balance < 1000000) { // Less than 0.001 SOL
      return new Response(
        customJSONStringify({
          error: `Insufficient balance (${balance / 1e9} SOL). Please fund the wallet with some devnet SOL`,
          publicKey: keypair.publicKey.toString()
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Parse and validate input
    const rawBody = await req.text();
    console.log('📝 [initialize-nft-collection] Raw request body:', rawBody);

    if (!rawBody) {
      return new Response(
        customJSONStringify({ error: 'Request body is empty' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let input: CreateCollectionInput;
    try {
      input = JSON.parse(rawBody);
      console.log('✅ [initialize-nft-collection] Parsed input:', JSON.stringify(input, null, 2));
    } catch (parseError) {
      console.error('❌ [initialize-nft-collection] JSON parse error:', parseError);
      return new Response(
        customJSONStringify({ error: 'Invalid JSON in request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate required fields
    const requiredFields = ['name', 'symbol', 'totalSupply'];
    const missingFields = requiredFields.filter(field => !input[field]);
    if (missingFields.length > 0) {
      console.error('❌ [initialize-nft-collection] Missing required fields:', missingFields);
      return new Response(
        customJSONStringify({ error: 'Missing required fields', missingFields }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create a new mint account
    const mintKeypair = Keypair.generate();
    console.log('✅ [initialize-nft-collection] Mint keypair created:', mintKeypair.publicKey.toString());

    // Calculate the rent-exempt minimum balance
    const rentExemptBalance = await connection.getMinimumBalanceForRentExemption(82); // Size for mint account
    console.log('💰 [initialize-nft-collection] Rent-exempt balance required:', rentExemptBalance / 1e9, 'SOL');

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
        [keypair, mintKeypair],
        { commitment: 'confirmed' }
      );
      console.log('✅ [initialize-nft-collection] Transaction successful. Signature:', signature);

      return new Response(
        customJSONStringify({
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
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } catch (txError) {
      console.error('❌ [initialize-nft-collection] Transaction error:', txError);
      return new Response(
        customJSONStringify({
          error: 'Transaction failed',
          details: txError.message,
          publicKey: keypair.publicKey.toString()
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

  } catch (error) {
    console.error('❌ [initialize-nft-collection] Error:', error);
    return new Response(
      customJSONStringify({
        error: error.message,
        stack: error.stack,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
})

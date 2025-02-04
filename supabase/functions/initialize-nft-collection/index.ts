
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { 
  Connection, 
  Keypair,
  clusterApiUrl,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
  PublicKey,
} from "https://esm.sh/@solana/web3.js@1.87.6"

import { corsHeaders, handleCorsPreflightRequest } from "./cors.ts"
import { 
  customJSONStringify,
  validatePrivateKey,
  createKeypairFromPrivateKey,
  checkBalance,
  validateInput
} from "./utils.ts"
import { CreateCollectionInput } from "./types.ts"

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('✨ [initialize-nft-collection] Handling CORS preflight request');
    return handleCorsPreflightRequest();
  }

  try {
    // Get and validate private key
    const privateKeyUint8 = validatePrivateKey(Deno.env.get('CANDY_MACHINE_PRIVATE_KEY'));
    const keypair = createKeypairFromPrivateKey(privateKeyUint8);
    
    // Set up connection and check balance
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    await checkBalance(connection, keypair.publicKey);
    
    // Parse and validate request body
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
      validateInput(input);
    } catch (parseError) {
      console.error('❌ [initialize-nft-collection] Input validation error:', parseError);
      return new Response(
        customJSONStringify({ error: parseError.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create a new mint account
    const mintKeypair = Keypair.generate();
    console.log('✅ [initialize-nft-collection] Mint keypair created:', mintKeypair.publicKey.toString());

    // Calculate rent-exempt balance and ensure it's handled as a bigint
    const rentExemptBalance = BigInt(await connection.getMinimumBalanceForRentExemption(82));
    console.log('💰 [initialize-nft-collection] Rent-exempt balance required:', Number(rentExemptBalance) / 1e9, 'SOL');

    // Create transaction
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
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('❌ [initialize-nft-collection] Error:', error);
    return new Response(
      customJSONStringify({
        error: error.message,
        stack: error.stack,
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
})

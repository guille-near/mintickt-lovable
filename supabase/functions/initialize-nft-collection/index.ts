
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { 
  Connection, 
  Keypair,
  clusterApiUrl
} from "https://esm.sh/@solana/web3.js@1.87.6"

import { corsHeaders } from "./cors.ts"
import { 
  customJSONStringify,
  validatePrivateKey,
  createKeypairFromPrivateKey,
  checkConnection,
  checkBalance,
  validateInput,
  generateSugarConfig
} from "./utils.ts"
import { CreateCollectionInput } from "./types.ts"

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('✨ [initialize-nft-collection] Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Set up connection and check connectivity first
    const connection = new Connection(clusterApiUrl('devnet'));
    await checkConnection(connection);
    
    // Get and validate private key
    const privateKeyUint8 = validatePrivateKey(Deno.env.get('CANDY_MACHINE_PRIVATE_KEY'));
    const keypair = createKeypairFromPrivateKey(privateKeyUint8);
    
    // Check balance after confirming connection
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
      console.log('✅ [initialize-nft-collection] Parsed input:', input);
      validateInput(input);
    } catch (parseError) {
      console.error('❌ [initialize-nft-collection] Input validation error:', parseError);
      return new Response(
        customJSONStringify({ error: parseError.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate Sugar configuration
    const config = generateSugarConfig(input, keypair);
    console.log('📝 [initialize-nft-collection] Generated Sugar config:', config);

    // For now, return just the configuration since Sugar CLI is not available
    // TODO: Implement alternative approach for NFT collection creation
    const responseData = {
      success: true,
      config,
      message: "Sugar configuration generated. Manual deployment required.",
      publicKey: keypair.publicKey.toString()
    };

    console.log('✅ [initialize-nft-collection] Operation completed:', responseData);

    return new Response(
      customJSONStringify(responseData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('❌ [initialize-nft-collection] Error:', error);
    return new Response(
      customJSONStringify({
        error: error.message,
        details: error.stack,
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
})

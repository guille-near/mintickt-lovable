
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
  generateSugarConfig,
  initializeSugarEnvironment,
  runSugarCommand
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

    // Create temporary directory for Sugar files
    const configDir = await Deno.makeTempDir();
    console.log('📁 [initialize-nft-collection] Created temp directory:', configDir);

    // Initialize Sugar environment
    await initializeSugarEnvironment(input, configDir);

    // Run Sugar commands
    const createResult = await runSugarCommand(['create-config'], configDir);
    if (!createResult.success) {
      throw new Error(`Failed to create Sugar config: ${createResult.output}`);
    }

    const uploadResult = await runSugarCommand(['upload'], configDir);
    if (!uploadResult.success) {
      throw new Error(`Failed to upload assets: ${uploadResult.output}`);
    }

    const deployResult = await runSugarCommand(['deploy'], configDir);
    if (!deployResult.success) {
      throw new Error(`Failed to deploy collection: ${deployResult.output}`);
    }

    // Parse collection mint address from deploy output
    const mintAddressMatch = deployResult.output.match(/Collection mint ID: ([A-Za-z0-9]+)/);
    const collectionMint = mintAddressMatch ? mintAddressMatch[1] : null;

    // Create response data
    const responseData = {
      success: true,
      config,
      cache: null, // Sugar will generate this
      collectionMint
    };

    console.log('✅ [initialize-nft-collection] Operation successful:', responseData);

    // Cleanup temp directory
    try {
      await Deno.remove(configDir, { recursive: true });
      console.log('🧹 [initialize-nft-collection] Cleaned up temp directory');
    } catch (cleanupError) {
      console.error('⚠️ [initialize-nft-collection] Failed to cleanup temp directory:', cleanupError);
    }

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


import { Connection, Keypair, PublicKey } from "https://esm.sh/@solana/web3.js@1.87.6";

// Custom JSON serializer to handle bigint
export const customJSONStringify = (obj: any): string => {
  return JSON.stringify(obj, (_, value) =>
    typeof value === 'bigint'
      ? value.toString()
      : value
  );
};

export const validatePrivateKey = (privateKeyString: string | undefined): Uint8Array => {
  if (!privateKeyString) {
    throw new Error('Missing CANDY_MACHINE_PRIVATE_KEY environment variable');
  }

  try {
    const parsedJson = JSON.parse(privateKeyString);
    return new Uint8Array(parsedJson);
  } catch (parseError) {
    console.error('❌ [initialize-nft-collection] Parse error details:', parseError);
    throw new Error('Invalid private key format. Expected a JSON array of numbers.');
  }
};

export const createKeypairFromPrivateKey = (privateKeyUint8: Uint8Array): Keypair => {
  try {
    const keypair = Keypair.fromSecretKey(privateKeyUint8);
    console.log('✅ [initialize-nft-collection] Successfully created keypair. Public key:', keypair.publicKey.toString());
    return keypair;
  } catch (keypairError) {
    console.error('❌ [initialize-nft-collection] Failed to create keypair:', keypairError);
    throw new Error('Invalid keypair');
  }
};

export const checkConnection = async (connection: Connection): Promise<void> => {
  try {
    console.log('🔄 [initialize-nft-collection] Checking Solana connection...');
    const version = await connection.getVersion();
    console.log('✅ [initialize-nft-collection] Connected to Solana:', version);
  } catch (error) {
    console.error('❌ [initialize-nft-collection] Connection error:', error);
    throw new Error('Failed to connect to Solana network');
  }
};

export const checkBalance = async (connection: Connection, publicKey: PublicKey): Promise<void> => {
  try {
    const balance = await connection.getBalance(publicKey);
    const balanceInSOL = balance.toString();
    console.log('💰 [initialize-nft-collection] Keypair balance (lamports):', balance.toString());
    
    // Convert balance to SOL for display (1 SOL = 1e9 lamports)
    const balanceSOL = Number(balance) / 1_000_000_000;
    console.log('💰 [initialize-nft-collection] Keypair balance:', balanceSOL, 'SOL');
    
    if (balance < BigInt(1_000_000)) { // Less than 0.001 SOL
      throw new Error(
        `The system wallet (${publicKey.toString()}) has insufficient balance (${balanceSOL} SOL) to create NFT collections. ` +
        `Please fund it with some devnet SOL at https://solfaucet.com`
      );
    }
  } catch (error) {
    console.error('❌ [initialize-nft-collection] Error checking balance:', error);
    throw error;
  }
};

export const validateInput = (input: any): void => {
  const requiredFields = ['name', 'symbol', 'totalSupply'];
  const missingFields = requiredFields.filter(field => !input[field]);
  
  if (missingFields.length > 0) {
    console.error('❌ [initialize-nft-collection] Missing required fields:', missingFields);
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }
};

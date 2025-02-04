
import { Connection, Keypair, PublicKey } from "https://esm.sh/@solana/web3.js@1.87.6";
import { CreateCollectionInput } from "./types.ts";

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
    const balanceNumber = Number(balance);
    console.log('💰 [initialize-nft-collection] Keypair balance (lamports):', balanceNumber);
    
    const balanceSOL = balanceNumber / 1_000_000_000;
    console.log('💰 [initialize-nft-collection] Keypair balance:', balanceSOL, 'SOL');
    
    if (balanceNumber < 1_000_000) { // Less than 0.001 SOL
      throw new Error(
        `Insufficient balance (${balanceSOL} SOL) to create NFT collections. ` +
        `Please fund the wallet with some devnet SOL.`
      );
    }
  } catch (error) {
    console.error('❌ [initialize-nft-collection] Error checking balance:', error);
    throw error;
  }
};

export const validateInput = (input: CreateCollectionInput): void => {
  console.log('🔍 [initialize-nft-collection] Validating input:', input);

  const requiredFields = ['eventId', 'name', 'totalSupply'];
  const missingFields = requiredFields.filter(field => !input[field]);
  
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }

  if (typeof input.totalSupply !== 'number' || input.totalSupply <= 0) {
    throw new Error('totalSupply must be a positive number');
  }

  if (input.price && (typeof input.price !== 'number' || input.price < 0)) {
    throw new Error('price must be a non-negative number');
  }

  console.log('✅ [initialize-nft-collection] Input validation passed');
};

export const generateSugarConfig = (
  input: CreateCollectionInput,
  keypair: Keypair
): Record<string, any> => {
  console.log('🔧 [initialize-nft-collection] Generating Sugar config');
  
  return {
    price: input.price || 0,
    number: input.totalSupply,
    gatekeeper: null,
    solTreasuryAccount: keypair.publicKey.toString(),
    splTokenAccount: null,
    splToken: null,
    symbol: input.symbol || "TCKT",
    sellerFeeBasisPoints: input.sellerFeeBasisPoints || 500,
    isMutable: true,
    retainAuthority: true,
    goLiveDate: null,
    endSettings: null,
    creators: [
      {
        address: keypair.publicKey.toString(),
        share: 100
      }
    ],
    hiddenSettings: null,
    uploadMethod: "bundlr",
    awsConfig: null,
    collection: {
      name: input.name,
      family: "NFT Tickets"
    }
  };
};

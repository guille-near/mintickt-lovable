import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { toast } from "sonner";

export const initializeCandyMachine = async (
  wallet: any,
  eventTitle: string,
  totalTickets: number
) => {
  try {
    console.log('🍬 [CandyMachine] Starting initialization with params:', {
      eventTitle,
      totalTickets,
      walletPublicKey: wallet.publicKey?.toString()
    });
    
    const connection = new Connection(clusterApiUrl("devnet"));
    console.log('🔗 [CandyMachine] Connected to Solana devnet');
    
    const metaplex = new Metaplex(connection).use(walletAdapterIdentity(wallet));
    console.log('🎨 [CandyMachine] Metaplex instance created');

    console.log('⚙️ [CandyMachine] Configuring Candy Machine settings');
    // Create the Candy Machine with more detailed configuration
    const { candyMachine } = await metaplex.candyMachines().create({
      itemsAvailable: totalTickets,
      sellerFeeBasisPoints: 500, // 5% royalties
      collection: {
        address: wallet.publicKey,
        updateAuthority: wallet
      },
      guards: {
        solPayment: {
          amount: { 
            basisPoints: 0, 
            currency: { 
              symbol: "SOL", 
              decimals: 9 
            } 
          },
          destination: wallet.publicKey,
        },
      },
      creators: [
        {
          address: wallet.publicKey,
          share: 100,
        },
      ],
      isMutable: true,
    });

    console.log('✅ [CandyMachine] Created successfully:', {
      address: candyMachine.address.toString(),
      itemsAvailable: totalTickets,
      creator: wallet.publicKey.toString()
    });
    
    return {
      address: candyMachine.address.toString(),
      config: {
        itemsAvailable: totalTickets,
        sellerFeeBasisPoints: 500,
        collection: {
          name: eventTitle,
          family: "NFT Tickets",
        },
        creators: [{
          address: wallet.publicKey.toString(),
          share: 100
        }]
      },
    };
  } catch (error) {
    console.error('❌ [CandyMachine] Error during initialization:', error);
    toast.error('Failed to initialize NFT collection');
    throw error;
  }
};

export const mintTicketNFT = async (
  wallet: any,
  candyMachineAddress: string,
  eventTitle: string
) => {
  try {
    console.log('🎫 [CandyMachine] Starting NFT mint process:', {
      candyMachineAddress,
      eventTitle
    });
    
    const connection = new Connection(clusterApiUrl("devnet"));
    const metaplex = new Metaplex(connection).use(walletAdapterIdentity(wallet));

    console.log('🔍 [CandyMachine] Finding Candy Machine by address');
    const candyMachine = await metaplex.candyMachines().findByAddress({
      address: new PublicKey(candyMachineAddress),
    });

    console.log('🎯 [CandyMachine] Minting NFT');
    const { nft } = await metaplex.candyMachines().mint({
      candyMachine,
      collectionUpdateAuthority: wallet.publicKey,
    });

    console.log('✅ [CandyMachine] NFT minted successfully:', {
      mintAddress: nft.address.toString(),
      owner: nft.owner.toString()
    });
    
    return nft.address.toString();
  } catch (error) {
    console.error('❌ [CandyMachine] Error minting NFT:', error);
    toast.error('Failed to mint ticket NFT');
    throw error;
  }
};
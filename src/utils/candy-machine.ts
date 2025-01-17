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
    console.log('🍬 Initializing Candy Machine for event:', eventTitle);
    
    const connection = new Connection(clusterApiUrl("devnet"));
    const metaplex = new Metaplex(connection).use(walletAdapterIdentity(wallet));

    // Create the Candy Machine
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
          }, // Free minting
          destination: wallet.publicKey,
        },
      },
    });

    console.log('🍬 Candy Machine created:', candyMachine.address.toString());
    
    return {
      address: candyMachine.address.toString(),
      config: {
        itemsAvailable: totalTickets,
        sellerFeeBasisPoints: 500,
        collection: {
          name: eventTitle,
          family: "NFT Tickets",
        },
      },
    };
  } catch (error) {
    console.error('Error initializing Candy Machine:', error);
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
    console.log('🎫 Minting ticket NFT from Candy Machine:', candyMachineAddress);
    
    const connection = new Connection(clusterApiUrl("devnet"));
    const metaplex = new Metaplex(connection).use(walletAdapterIdentity(wallet));

    const candyMachine = await metaplex.candyMachines().findByAddress({
      address: new PublicKey(candyMachineAddress),
    });

    const { nft } = await metaplex.candyMachines().mint({
      candyMachine,
      collectionUpdateAuthority: wallet.publicKey,
    });

    console.log('🎫 Ticket NFT minted:', nft.address.toString());
    
    return nft.address.toString();
  } catch (error) {
    console.error('Error minting ticket NFT:', error);
    toast.error('Failed to mint ticket NFT');
    throw error;
  }
};
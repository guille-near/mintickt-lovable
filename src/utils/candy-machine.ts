import { Metaplex, walletAdapterIdentity, CreateCandyMachineInput } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { toast } from "sonner";

export const initializeCandyMachine = async (
  wallet: any,
  eventTitle: string,
  totalTickets: number,
  price: number,
  imageUrl: string,
  description: string,
  royaltiesPercentage: number = 5
) => {
  try {
    console.log('🍬 [CandyMachine] Starting initialization with params:', {
      eventTitle,
      totalTickets,
      price,
      walletPublicKey: wallet.publicKey?.toString()
    });
    
    const connection = new Connection(clusterApiUrl("devnet"));
    console.log('🔗 [CandyMachine] Connected to Solana devnet');
    
    const metaplex = new Metaplex(connection).use(walletAdapterIdentity(wallet));
    console.log('🎨 [CandyMachine] Metaplex instance created');

    console.log('⚙️ [CandyMachine] Configuring Candy Machine settings');

    const candyMachineSettings: CreateCandyMachineInput = {
      itemsAvailable: totalTickets,
      sellerFeeBasisPoints: royaltiesPercentage * 100, // Convert percentage to basis points
      symbol: "TCKT",
      maxEditionSupply: 0,
      isMutable: true,
      creators: [
        {
          address: wallet.publicKey,
          share: 100,
        },
      ],
      collection: {
        address: wallet.publicKey,
        updateAuthority: wallet
      },
      items: [{
        name: `${eventTitle} Ticket`,
        uri: imageUrl,
        sellerFeeBasisPoints: royaltiesPercentage * 100,
      }],
      guards: {
        solPayment: {
          amount: { 
            basisPoints: price * 1_000_000_000, // Convert SOL to lamports
            currency: { 
              symbol: "SOL",
              decimals: 9,
              namespace: "spl-token"
            }
          },
          destination: wallet.publicKey,
        },
      }
    };

    console.log('🎯 [CandyMachine] Creating Candy Machine with settings:', candyMachineSettings);
    
    const { candyMachine } = await metaplex.candyMachines().create(candyMachineSettings);

    console.log('✅ [CandyMachine] Created successfully:', {
      address: candyMachine.address.toString(),
      itemsAvailable: totalTickets,
      creator: wallet.publicKey.toString()
    });
    
    return {
      address: candyMachine.address.toString(),
      config: {
        itemsAvailable: totalTickets,
        sellerFeeBasisPoints: royaltiesPercentage * 100,
        price: price,
        collection: {
          name: eventTitle,
          family: "NFT Tickets",
          description: description,
          image: imageUrl
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
  eventTitle: string,
  price: number
) => {
  try {
    console.log('🎫 [CandyMachine] Starting NFT mint process:', {
      candyMachineAddress,
      eventTitle,
      price
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
      price: price
    });

    console.log('✅ [CandyMachine] NFT minted successfully:', {
      mintAddress: nft.address.toString(),
      ownerAddress: nft.token.ownerAddress.toString()
    });
    
    return nft.address.toString();
  } catch (error) {
    console.error('❌ [CandyMachine] Error minting NFT:', error);
    toast.error('Failed to mint ticket NFT');
    throw error;
  }
};
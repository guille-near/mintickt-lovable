
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface NFTCollectionData {
  eventId: string;
  name: string;
  symbol: string;
  description: string;
  imageUrl: string;
  totalSupply: number;
  price: number;
  sellerFeeBasisPoints: number;
}

export const useNFTCollection = () => {
  const initializeNFTCollection = async (data: NFTCollectionData) => {
    try {
      // Validate price is a number
      const validatedData = {
        ...data,
        price: typeof data.price === 'number' ? data.price : 0
      };

      console.log("🎯 [useNFTCollection] Initializing NFT collection with data:", validatedData);
      
      const { data: nftData, error: nftError } = await supabase.functions.invoke(
        'initialize-nft-collection',
        {
          body: JSON.stringify(validatedData),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (nftError) {
        console.error('❌ [useNFTCollection] Error initializing NFT collection:', nftError);
        
        // Check for insufficient balance error
        if (nftError.message.includes('Insufficient balance')) {
          toast.error(
            "The system wallet needs devnet SOL to create NFT collections. Please contact support.",
            {
              duration: 6000,
            }
          );
          return null;
        }

        toast.error("Failed to initialize NFT collection");
        return null;
      }

      console.log("✅ [useNFTCollection] NFT collection initialized:", nftData);
      return nftData;
    } catch (error) {
      console.error('❌ [useNFTCollection] Error:', error);
      
      // Handle known error cases
      if (error instanceof Error && error.message.includes('Insufficient balance')) {
        toast.error(
          "The system wallet needs devnet SOL to create NFT collections. Please contact support.",
          {
            duration: 6000,
          }
        );
        return null;
      }

      toast.error("Failed to initialize NFT collection");
      return null;
    }
  };

  return {
    initializeNFTCollection
  };
};

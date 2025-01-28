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
      // Ensure price is a valid number, defaulting to 0 if undefined or invalid
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
        toast.error("Failed to initialize NFT collection");
        return null;
      }

      console.log("✅ [useNFTCollection] NFT collection initialized:", nftData);
      return nftData;
    } catch (error) {
      console.error('❌ [useNFTCollection] Error:', error);
      toast.error("Failed to initialize NFT collection");
      return null;
    }
  };

  return {
    initializeNFTCollection
  };
};
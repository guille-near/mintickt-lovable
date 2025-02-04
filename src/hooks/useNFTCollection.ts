
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
      console.log("🎯 [useNFTCollection] Initializing NFT collection with data:", data);
      
      // Format the data for the edge function
      const formattedData = {
        eventId: data.eventId,
        name: data.name,
        symbol: data.symbol || 'TCKT',
        description: data.description || '',
        imageUrl: data.imageUrl || '',
        totalSupply: data.totalSupply,
        price: typeof data.price === 'number' ? data.price : 0,
        sellerFeeBasisPoints: data.sellerFeeBasisPoints || 500 // 5% default
      };

      console.log("📝 [useNFTCollection] Formatted data:", formattedData);

      const { data: nftData, error: nftError } = await supabase.functions.invoke(
        'initialize-nft-collection',
        {
          body: JSON.stringify(formattedData)
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

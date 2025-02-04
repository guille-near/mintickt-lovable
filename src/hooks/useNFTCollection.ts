
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
      
      const formattedData = {
        eventId: data.eventId,
        name: data.name,
        symbol: data.symbol || 'TCKT',
        description: data.description || '',
        imageUrl: data.imageUrl || '',
        totalSupply: data.totalSupply,
        price: typeof data.price === 'number' ? data.price : 0,
        sellerFeeBasisPoints: data.sellerFeeBasisPoints || 500
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

      // Update event with Sugar configuration
      const { error: updateError } = await supabase
        .from('events')
        .update({
          sugar_config: nftData.config,
          sugar_cache: nftData.cache,
          collection_mint: nftData.collectionMint
        })
        .eq('id', data.eventId);

      if (updateError) {
        console.error('❌ [useNFTCollection] Error updating event with Sugar config:', updateError);
        toast.error("Failed to save NFT collection configuration");
        return null;
      }

      console.log("✅ [useNFTCollection] NFT collection initialized:", nftData);
      toast.success("NFT collection initialized successfully");
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

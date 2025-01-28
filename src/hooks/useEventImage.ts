import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useEventImage = () => {
  const [isUploading, setIsUploading] = useState(false);

  const uploadEventImage = async (image: File | null, giphyUrl: string | undefined) => {
    if (!image && !giphyUrl) return null;
    if (giphyUrl) return giphyUrl;
    
    try {
      setIsUploading(true);
      console.log("🎯 [useEventImage] Starting image upload");
      
      const fileExt = image!.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      console.log("🎯 [useEventImage] Uploading image:", {
        fileName,
        fileSize: image!.size,
        fileType: image!.type
      });

      const { error: uploadError, data } = await supabase.storage
        .from('event-images')
        .upload(filePath, image!);

      if (uploadError) {
        console.error('❌ [useEventImage] Error uploading image:', uploadError);
        toast.error("Failed to upload image");
        return null;
      }

      console.log("✅ [useEventImage] Image uploaded successfully");

      const { data: { publicUrl } } = supabase.storage
        .from('event-images')
        .getPublicUrl(filePath);

      console.log("✅ [useEventImage] Image public URL generated:", publicUrl);
      return publicUrl;
    } catch (error) {
      console.error('❌ [useEventImage] Error:', error);
      toast.error("Failed to upload image");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadEventImage,
    isUploading
  };
};
import { useIsMobile } from "@/hooks/use-mobile";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface EventImageProps {
  imageUrl: string | null;
  title: string;
}

export const EventImage = ({ imageUrl, title }: EventImageProps) => {
  const isMobile = useIsMobile();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div 
          className="relative w-full cursor-pointer rounded-lg overflow-hidden" 
          style={{ 
            aspectRatio: isMobile ? '16/9' : '1/1'
          }}
        >
          <img
            src={imageUrl || '/placeholder.svg'}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-[90vw] max-h-[80vh] w-[120vh] p-0">
        <img
          src={imageUrl || '/placeholder.svg'}
          alt={title}
          className="h-full w-full object-contain"
        />
      </DialogContent>
    </Dialog>
  );
};
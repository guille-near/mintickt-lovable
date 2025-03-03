import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Upload, Sticker } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImageUploadProps {
  image: File | null;
  giphyUrl: string;
  onImageChange: (image: File | null) => void;
  onGiphyUrlChange: (url: string) => void;
  onGiphySearchOpen: () => void;
}

export function ImageUpload({ 
  image, 
  giphyUrl, 
  onImageChange, 
  onGiphyUrlChange,
  onGiphySearchOpen 
}: ImageUploadProps) {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageChange(e.target.files[0])
      onGiphyUrlChange("")
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageChange(e.dataTransfer.files[0])
      onGiphyUrlChange("")
    }
  }

  return (
    <div className="space-y-4">
      <Card className="aspect-square border-0 bg-card">
        <CardContent className="p-0 h-full">
          <div 
            className={cn(
              "relative w-full h-full rounded-lg flex flex-col items-center justify-center cursor-pointer overflow-hidden",
              !image && !giphyUrl && "border-2 border-dashed border-border"
            )}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <Label htmlFor="event-image" className="sr-only">Event Image</Label>
            {image ? (
              <img
                src={URL.createObjectURL(image)}
                alt="Event preview"
                className="w-full h-full object-cover"
              />
            ) : giphyUrl ? (
              <img
                src={giphyUrl}
                alt="Event preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center p-4">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Drag & drop or click to upload
                </p>
              </div>
            )}
            <input
              id="event-image"
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleImageUpload}
              accept="image/*"
            />
          </div>
        </CardContent>
      </Card>
      <Button
        type="button"
        variant="outline"
        className="w-full flex items-center justify-center space-x-1 bg-background h-9 px-3 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground border-input"
        onClick={onGiphySearchOpen}
      >
        <Sticker className="w-4 h-4 mr-1" />
        <span>Search Giphy</span>
      </Button>
    </div>
  )
}
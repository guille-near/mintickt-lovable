import * as React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { GiphyFetch } from "@giphy/js-fetch-api"
import { Grid } from "@giphy/react-components"

const gf = new GiphyFetch('ZJiC6NxTDkQPeckG9KS7OCcU6kGdSyVe')

interface GiphySearchProps {
  onSelect: (gif: any) => void;
  onClose: () => void;
}

export function GiphySearch({ onSelect, onClose }: GiphySearchProps) {
  const [searchTerm, setSearchTerm] = React.useState("")

  const fetchGifs = (offset: number) => {
    if (searchTerm) {
      return gf.search(searchTerm, { offset, limit: 10 })
    } else {
      return gf.trending({ offset, limit: 10 })
    }
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-background rounded-lg p-6 w-full max-w-2xl border border-border">
        <div className="flex items-center mb-4">
          <Input
            type="text"
            placeholder="Search Giphy"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow mr-2 bg-input text-input-foreground placeholder-muted-foreground border-input"
          />
          <Button onClick={onClose} className="bg-secondary text-secondary-foreground hover:bg-secondary/80">Close</Button>
        </div>
        <div className="h-96 overflow-y-auto">
          <Grid
            width={600}
            columns={3}
            fetchGifs={fetchGifs}
            onGifClick={onSelect}
            key={searchTerm}
            noLink={true}
          />
        </div>
      </div>
    </div>
  )
}
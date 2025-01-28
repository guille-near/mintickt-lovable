import { ExternalLink } from "lucide-react";

interface EventNFTInfoProps {
  collectionName: string | null;
  symbol: string | null;
  metadataUri: string | null;
  royaltiesPercentage: number | null;
}

export const EventNFTInfo = ({ 
  collectionName, 
  symbol, 
  metadataUri, 
  royaltiesPercentage 
}: EventNFTInfoProps) => {
  if (!collectionName) return null;

  const explorerUrl = `https://explorer.solana.com/address/${collectionName}?cluster=devnet`;
  const magicEdenUrl = `https://magiceden.io/marketplace/devnet/${collectionName}`;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold mb-4 text-primary">NFT Collection Details</h2>
      <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
        <div className="flex flex-col gap-2">
          <p>Collection Name: {collectionName}</p>
          {symbol && <p>Symbol: {symbol}</p>}
          {royaltiesPercentage && <p>Royalties: {royaltiesPercentage}%</p>}
          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-festival hover:text-festival-hover transition-colors"
            >
              View on Solana Explorer <ExternalLink className="h-4 w-4" />
            </a>
            <a
              href={magicEdenUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-festival hover:text-festival-hover transition-colors"
            >
              View on Magic Eden <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
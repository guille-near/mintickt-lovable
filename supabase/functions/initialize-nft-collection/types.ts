
export interface CreateCollectionInput {
  eventId: string;
  name: string;
  symbol: string;
  description: string;
  imageUrl: string;
  totalSupply: number;
  price: number;
  sellerFeeBasisPoints: number;
}

export interface CandyMachineConfig {
  price: number;
  totalSupply: number;
  itemsRedeemed: number;
  isActive: boolean;
  collection: {
    name: string;
    symbol: string;
    description: string;
    image: string;
  };
}


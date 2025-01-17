import { PublicKey } from "@solana/web3.js";

export interface NFTMetadata {
  name: string;
  symbol: string;
  description: string;
  seller_fee_basis_points: number;
  external_url: string;
  attributes: {
    trait_type: string;
    value: string;
  }[];
  image: string;
  properties: {
    creators: {
      address: string;
      share: number;
    }[];
    files: {
      uri: string;
      type: string;
    }[];
  };
}

export const generateTicketMetadata = (
  eventTitle: string,
  eventDate: string,
  ticketNumber: number,
  creatorAddress: string,
  imageUrl: string,
  royaltiesPercentage: number = 5
): NFTMetadata => {
  return {
    name: `${eventTitle} - Ticket #${ticketNumber}`,
    symbol: "TCKT",
    description: `Ticket #${ticketNumber} for ${eventTitle}`,
    seller_fee_basis_points: royaltiesPercentage * 100, // Convert percentage to basis points
    external_url: window.location.origin,
    attributes: [
      { trait_type: "Event", value: eventTitle },
      { trait_type: "Ticket Number", value: ticketNumber.toString() },
      { trait_type: "Event Date", value: eventDate }
    ],
    image: imageUrl,
    properties: {
      creators: [
        {
          address: creatorAddress,
          share: 100
        }
      ],
      files: [
        {
          uri: imageUrl,
          type: "image/png"
        }
      ]
    }
  };
};
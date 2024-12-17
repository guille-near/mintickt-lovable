import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { PublicKey, Keypair, SystemProgram } from "@solana/web3.js";
import { EventTickets, IDL } from "../programs/event-tickets/types";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

// Using the program ID from environment variables
const PROGRAM_ID = new PublicKey(process.env.PROGRAM_ID || "11111111111111111111111111111111");

export class EventTicketsClient {
  program: Program<EventTickets>;
  
  constructor(provider: anchor.AnchorProvider) {
    this.program = new Program(IDL, PROGRAM_ID, provider);
  }

  async initializeEventCollection(
    authority: PublicKey,
    name: string,
    symbol: string,
    uri: string
  ) {
    console.log('Initializing event collection with:', { name, symbol, uri });
    
    const [eventPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("event"), authority.toBuffer()],
      this.program.programId
    );

    const collectionMint = Keypair.generate();
    console.log('Generated collection mint:', collectionMint.publicKey.toString());

    try {
      const tx = await this.program.methods
        .initializeEventCollection(name, symbol, uri)
        .accounts({
          authority,
          event: eventPda,
          collectionMint: collectionMint.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        })
        .signers([collectionMint])
        .rpc();

      console.log('Transaction signature:', tx);
      
      return {
        tx,
        eventPda,
        collectionMint: collectionMint.publicKey.toString()
      };
    } catch (error) {
      console.error('Error initializing event collection:', error);
      throw error;
    }
  }

  async mintTicket(
    event: PublicKey,
    authority: PublicKey,
    ticketNumber: number
  ) {
    console.log('Minting ticket:', { event: event.toString(), ticketNumber });
    
    try {
      const tx = await this.program.methods
        .mintTicket(new anchor.BN(ticketNumber))
        .accounts({
          event,
          authority,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        })
        .rpc();

      console.log('Ticket minted successfully:', tx);
      return tx;
    } catch (error) {
      console.error('Error minting ticket:', error);
      throw error;
    }
  }
}
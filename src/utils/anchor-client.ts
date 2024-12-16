import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { EventTickets, IDL } from "../programs/event-tickets/types";

// Reemplaza esto con tu Program ID real una vez que despliegues el programa
const PROGRAM_ID = new PublicKey("your_program_id");

export class EventTicketsClient {
  program: Program<EventTickets>;
  
  constructor(provider: anchor.AnchorProvider) {
    // Inicializar el programa con el IDL
    this.program = new Program(IDL, PROGRAM_ID, provider);
  }

  async initializeEventCollection(
    authority: PublicKey,
    name: string,
    symbol: string,
    uri: string
  ) {
    const [eventPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("event"), authority.toBuffer()],
      this.program.programId
    );

    const tx = await this.program.methods
      .initializeEventCollection(name, symbol, uri)
      .accounts({
        authority,
        event: eventPda,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    return { tx, eventPda };
  }

  async mintTicket(
    event: PublicKey,
    authority: PublicKey,
    ticketNumber: number
  ) {
    const tx = await this.program.methods
      .mintTicket(new anchor.BN(ticketNumber))
      .accounts({
        event,
        authority,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    return tx;
  }
}
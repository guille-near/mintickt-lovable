use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{Mint, Token, TokenAccount},
};
use mpl_token_metadata::state::Collection;

declare_id!("your_program_id");

#[program]
pub mod event_tickets {
    use super::*;

    // Inicializar una nueva colección de NFTs para un evento
    pub fn initialize_event_collection(
        ctx: Context<InitializeEventCollection>,
        name: String,
        symbol: String,
        uri: String,
    ) -> Result<()> {
        // Crear la colección del evento
        let event = &mut ctx.accounts.event;
        event.authority = ctx.accounts.authority.key();
        event.collection_mint = ctx.accounts.collection_mint.key();
        event.name = name;
        event.symbol = symbol;
        event.uri = uri;
        event.tickets_minted = 0;
        event.max_tickets = 100; // Configurable

        Ok(())
    }

    // Acuñar un nuevo NFT como entrada
    pub fn mint_ticket(
        ctx: Context<MintTicket>,
        ticket_number: u64,
    ) -> Result<()> {
        // Verificar que quedan entradas disponibles
        let event = &mut ctx.accounts.event;
        require!(
            event.tickets_minted < event.max_tickets,
            EventTicketError::SoldOut
        );

        // Incrementar el contador de entradas
        event.tickets_minted += 1;

        // Aquí iría la lógica para acuñar el NFT usando Metaplex
        // y asignarlo a la colección del evento

        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeEventCollection<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        init,
        payer = authority,
        space = EventCollection::LEN
    )]
    pub event: Account<'info, EventCollection>,
    pub collection_mint: Account<'info, Mint>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct MintTicket<'info> {
    #[account(mut)]
    pub event: Account<'info, EventCollection>,
    #[account(mut)]
    pub authority: Signer<'info>,
    /// CHECK: Validated in CPI
    pub metadata_program: UncheckedAccount<'info>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[account]
pub struct EventCollection {
    pub authority: Pubkey,
    pub collection_mint: Pubkey,
    pub name: String,
    pub symbol: String,
    pub uri: String,
    pub tickets_minted: u64,
    pub max_tickets: u64,
}

impl EventCollection {
    pub const LEN: usize = 8 + // discriminator
        32 + // authority
        32 + // collection_mint
        64 + // name
        16 + // symbol
        128 + // uri
        8 + // tickets_minted
        8; // max_tickets
}

#[error_code]
pub enum EventTicketError {
    #[msg("El evento está agotado")]
    SoldOut,
}
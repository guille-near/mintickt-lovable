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

    pub fn initialize_event_collection(
        ctx: Context<InitializeEventCollection>,
        name: String,
        symbol: String,
        uri: String,
    ) -> Result<()> {
        let event = &mut ctx.accounts.event;
        event.authority = ctx.accounts.authority.key();
        event.collection_mint = ctx.accounts.collection_mint.key();
        event.name = name;
        event.symbol = symbol;
        event.uri = uri;
        event.tickets_minted = 0;
        event.max_tickets = 100;

        // Inicializar los metadatos de la colección NFT
        let seeds = &[
            b"event",
            ctx.accounts.authority.key().as_ref(),
            &[*ctx.bumps.get("event").unwrap()],
        ];
        let signer = &[&seeds[..]];

        let cpi_context = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            token::MintTo {
                mint: ctx.accounts.collection_mint.to_account_info(),
                to: ctx.accounts.collection_token_account.to_account_info(),
                authority: event.to_account_info(),
            },
            signer,
        );

        token::mint_to(cpi_context, 1)?;

        Ok(())
    }

    pub fn mint_ticket(
        ctx: Context<MintTicket>,
        ticket_number: u64,
    ) -> Result<()> {
        require!(
            ctx.accounts.event.tickets_minted < ctx.accounts.event.max_tickets,
            EventTicketError::SoldOut
        );

        ctx.accounts.event.tickets_minted += 1;

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(name: String, symbol: String, uri: String)]
pub struct InitializeEventCollection<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    
    #[account(
        init,
        payer = authority,
        space = EventCollection::SPACE,
        seeds = [b"event", authority.key().as_ref()],
        bump
    )]
    pub event: Account<'info, EventCollection>,
    
    #[account(
        init,
        payer = authority,
        mint::decimals = 0,
        mint::authority = event,
    )]
    pub collection_mint: Account<'info, Mint>,
    
    #[account(
        init,
        payer = authority,
        associated_token::mint = collection_mint,
        associated_token::authority = authority,
    )]
    pub collection_token_account: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct MintTicket<'info> {
    #[account(mut)]
    pub event: Account<'info, EventCollection>,
    #[account(mut)]
    pub authority: Signer<'info>,
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
    pub const SPACE: usize = 8 + // discriminator
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
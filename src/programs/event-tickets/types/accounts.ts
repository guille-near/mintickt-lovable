export type EventCollection = {
  "version": "0.1.0",
  "name": "event_tickets",
  "accounts": [
    {
      "name": "eventCollection",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "collectionMint",
            "type": "publicKey"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "symbol",
            "type": "string"
          },
          {
            "name": "uri",
            "type": "string"
          },
          {
            "name": "ticketsMinted",
            "type": "u64"
          },
          {
            "name": "maxTickets",
            "type": "u64"
          }
        ]
      }
    }
  ]
};